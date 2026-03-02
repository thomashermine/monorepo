#!/usr/bin/env python3
"""
Hostex → Odoo Sync Service
Syncs Hostex reservations as Odoo sale orders.

Usage:
    python3 sync.py                  # Sync all missing reservations
    python3 sync.py --dry-run        # Preview what would be synced
    python3 sync.py --force CODE     # Force re-sync a specific reservation

Env vars:
    HOSTEX_ACCESS_TOKEN   — Hostex API bearer token
    ODOO_CONFIG           — Path to Odoo config (default: ~/.config/odoo/config.json)
"""

import argparse
import json
import os
import sys
import time
import xmlrpc.client
from datetime import datetime
from pathlib import Path

import requests

# ─── Configuration ───────────────────────────────────────────────────────────

HOSTEX_BASE_URL = "https://api.hostex.io/v3"
PROPERTY_ID = 12085500
ACCOMMODATION_PRODUCT_ID = 78
ROUNDING_PRODUCT_ID = 85

ODOO_CONFIG_PATH = Path(os.environ.get("ODOO_CONFIG", Path.home() / ".config" / "odoo" / "config.json"))

# ─── Hostex API ──────────────────────────────────────────────────────────────

def hostex_session():
    s = requests.Session()
    token = os.environ.get("HOSTEX_ACCESS_TOKEN")
    if not token:
        print("ERROR: HOSTEX_ACCESS_TOKEN not set", file=sys.stderr)
        sys.exit(1)
    s.headers.update({
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    })
    return s

def fetch_all_reservations(session):
    seen_codes = set()
    all_reservations = []
    page = 1
    while page <= 200:  # safety cap
        resp = session.get(f"{HOSTEX_BASE_URL}/reservations", params={
            "property_id": PROPERTY_ID,
            "page": page,
        }, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        reservations = data.get("data", {}).get("reservations", [])
        if not reservations:
            break
        new_count = 0
        for r in reservations:
            code = r["reservation_code"]
            if code not in seen_codes:
                seen_codes.add(code)
                all_reservations.append(r)
                new_count += 1
        print(f"   Page {page}: {len(reservations)} fetched, {new_count} new", flush=True)
        if new_count == 0 or len(reservations) < 20:
            break
        page += 1
        time.sleep(0.2)
    return all_reservations

# ─── Odoo RPC ────────────────────────────────────────────────────────────────

class OdooClient:
    def __init__(self):
        with open(ODOO_CONFIG_PATH) as f:
            cfg = json.load(f)
        self.url = cfg["url"]
        self.db = cfg["db"]
        self.user = cfg["user"]
        self.api_key = cfg["api_key"]
        common = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/common", allow_none=True)
        self.uid = common.authenticate(self.db, self.user, self.api_key, {})
        if not self.uid:
            print("ERROR: Odoo auth failed", file=sys.stderr)
            sys.exit(1)
        self.models = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/object", allow_none=True)

    def execute(self, model, method, *args, **kwargs):
        return self.models.execute_kw(self.db, self.uid, self.api_key, model, method, list(args), kwargs or {})

    def search(self, model, domain, fields=[], limit=0):
        kw = {"fields": fields}
        if limit:
            kw["limit"] = limit
        return self.execute(model, "search_read", domain, **kw)

    def create(self, model, vals):
        return self.execute(model, "create", [vals])

    def get_existing_refs(self):
        orders = self.search("sale.order", [["client_order_ref", "ilike", "HOSTEX_BOOKING_"]], fields=["client_order_ref"])
        return {o["client_order_ref"] for o in orders if o.get("client_order_ref")}

    def find_or_create_partner(self, name, email, phone):
        if email:
            p = self.search("res.partner", [["email", "=", email]], fields=["id"], limit=1)
            if p: return p[0]["id"]
        if phone:
            p = self.search("res.partner", [["phone", "=", phone]], fields=["id"], limit=1)
            if p: return p[0]["id"]
        p = self.search("res.partner", [["name", "=", name]], fields=["id"], limit=1)
        if p: return p[0]["id"]
        vals = {"name": name, "customer_rank": 1}
        if email: vals["email"] = email
        if phone: vals["phone"] = phone
        pid = self.create("res.partner", vals)
        if isinstance(pid, list): pid = pid[0]
        print(f"  → Created partner: {name} (id={pid})", flush=True)
        return pid

# ─── Sync Logic ──────────────────────────────────────────────────────────────

def nights(ci, co):
    return max((datetime.strptime(co, "%Y-%m-%d") - datetime.strptime(ci, "%Y-%m-%d")).days, 1)

def price_per_night(r):
    n = nights(r["check_in_date"], r["check_out_date"])
    amt = r["rates"]["total_rate"]["amount"]
    for d in r["rates"].get("details", []):
        if d["type"] == "ACCOMMODATION":
            amt = d["amount"]
            break
    ppn = round(amt / n, 2)
    rnd = round(amt - ppn * n, 2)
    return ppn, rnd

def channel(r):
    ct = r.get("channel_type", "")
    if ct == "airbnb": return "Airbnb"
    if ct == "booking_site": return "Booking.com"
    return r.get("custom_channel", {}).get("name", ct)

def build_order(r, partner_id):
    code = r["reservation_code"]
    n = nights(r["check_in_date"], r["check_out_date"])
    ppn, rnd = price_per_night(r)
    ch = channel(r)

    note = (
        f"Booking confirmed from {r['check_in_date']} to {r['check_out_date']}.\n"
        f"Reservation: {code}\nChannel: {ch}\nGuests: {r['number_of_guests']}"
    )

    lines = [(0, 0, {
        "product_id": ACCOMMODATION_PRODUCT_ID,
        "name": "[THEVIEW_ACCOMMODATION] TheView - ACCOMMODATION",
        "product_uom_qty": n,
        "price_unit": ppn,
    })]
    if rnd != 0:
        lines.append((0, 0, {
            "product_id": ROUNDING_PRODUCT_ID,
            "name": "Arrondi",
            "product_uom_qty": 1,
            "price_unit": rnd,
        }))

    booked = r.get("booked_at", "")
    date_order = booked.replace("T", " ").split("+")[0] if booked else False

    return {
        "partner_id": partner_id,
        "name": f"TheView, Booking #{code}",
        "client_order_ref": f"HOSTEX_BOOKING_{code}",
        "date_order": date_order,
        "note": f"<p>{note}</p>",
        "order_line": lines,
    }

def sync(dry_run=False, force_code=None):
    print("=" * 60, flush=True)
    print(f"Hostex → Odoo Sync | {datetime.now().isoformat()}", flush=True)
    print("=" * 60, flush=True)

    session = hostex_session()
    print("\n📡 Fetching Hostex reservations...", flush=True)
    reservations = fetch_all_reservations(session)
    print(f"   Total: {len(reservations)}", flush=True)

    eligible = [r for r in reservations
                if r["status"] == "accepted"
                and r.get("cancelled_at") is None
                and r["rates"]["total_rate"]["amount"] > 0]
    print(f"   Eligible: {len(eligible)}", flush=True)

    if force_code:
        eligible = [r for r in reservations if r["reservation_code"] == force_code]
        if not eligible:
            print(f"\n❌ {force_code} not found"); return

    if not dry_run:
        print("\n🔌 Connecting to Odoo...", flush=True)
        odoo = OdooClient()
        existing = odoo.get_existing_refs()
        print(f"   {len(existing)} already in Odoo", flush=True)
    else:
        existing = set()
        print("\n🔍 DRY RUN", flush=True)

    created = skipped = errors = 0

    for r in eligible:
        ref = f"HOSTEX_BOOKING_{r['reservation_code']}"
        if ref in existing and not force_code:
            skipped += 1; continue

        n = nights(r["check_in_date"], r["check_out_date"])
        ppn, _ = price_per_night(r)
        total = r["rates"]["total_rate"]["amount"]

        print(f"\n{'[DRY] ' if dry_run else ''}📋 {r['guest_name']} — {r['reservation_code']}", flush=True)
        print(f"   {r['check_in_date']} → {r['check_out_date']} ({n}n) | {channel(r)} | €{total} (€{ppn}/n)", flush=True)

        if dry_run:
            created += 1; continue

        try:
            pid = odoo.find_or_create_partner(r["guest_name"], r.get("guest_email", ""), r.get("guest_phone", ""))
            oid = odoo.create("sale.order", build_order(r, pid))
            if isinstance(oid, list): oid = oid[0]
            print(f"  → SO id={oid}", flush=True)
            odoo.execute("sale.order", "action_confirm", [oid])
            print(f"  → Confirmed", flush=True)
            created += 1
        except Exception as e:
            print(f"  ❌ {e}", file=sys.stderr, flush=True)
            errors += 1

    print(f"\n{'=' * 60}", flush=True)
    print(f"✅ Done — Created: {created} | Skipped: {skipped} | Errors: {errors}", flush=True)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--force", metavar="CODE")
    a = p.parse_args()
    sync(dry_run=a.dry_run, force_code=a.force)

if __name__ == "__main__":
    main()
