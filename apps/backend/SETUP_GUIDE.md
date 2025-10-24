# Setup Guide - Voucher Management

Quick setup guide for the automatic voucher cleanup system.

## Step 1: Configure Environment Variables

Add these to your `.env` file:

```bash
# Hostex API Configuration
HOSTEX_ACCESS_TOKEN=your-access-token-here
HOSTEX_SESSION_COOKIE=your-session-cookie-here
```

**Getting the Session Cookie:**

1. Open https://hostex.io in your browser
2. Log in to your Hostex account
3. Open Developer Tools (F12)
4. Go to: Application (or Storage) → Cookies → https://hostex.io
5. Find the cookie named `hostex_session`
6. Copy its value (without quotes)
7. Paste it into your `.env` file

## Step 2: Configure Your Property

Edit `src/config/property.ts`:

```typescript
export const PROPERTY: Record<number, PropertyConfig> = {
    123: {
        // Replace with your property ID
        thirdpartyAccountId: '422121', // Your Hostex account ID
        times: {
            checkInHour: 16, // 4 PM
            checkInMinute: 0,
            checkOutHour: 12, // 12 PM (noon)
            checkOutMinute: 0,
        },
        voucherGreenlist: [
            'FRIENDSOFTHEVIEW',
            'SINDYMAENHOUT',
            // Add more voucher codes you want to keep
        ],
        loyaltyToVoucher: {
            discountType: 'flat', // 'flat' = points as € discount, 'percent' = points as %
            minimumStay: 1, // Minimum nights required
            numberOfRedemptions: 1, // How many times voucher can be used
        },
    },
}
```

**Important Fields:**

- `thirdpartyAccountId`: Find this in Hostex (required for voucher management)
- `voucherGreenlist`: Array of voucher codes to KEEP (all others will be deleted)
- `times`: Check-in and check-out times for calendar generation

## Step 3: Start Your App

```bash
npm run dev
```

## What Happens on Startup

The app will:

1. ✅ List all vouchers from Hostex for your configured property
2. ✅ Compare each voucher against your greenlist
3. ✅ Keep vouchers that are IN the greenlist
4. ❌ Delete vouchers that are NOT in the greenlist
5. 🎴 Fetch loyalty cards from Odoo
6. ➕ Create Hostex vouchers for each loyalty card
7. 📋 Log everything to the console

## Example Console Output

```
🎫 Checking vouchers for cleanup...
   🔍 Property 123: Checking vouchers (Account: 422121)
      📋 Found 5 voucher(s), greenlist has 2 code(s)
      ✅ Keeping voucher: FRIENDSOFTHEVIEW (ID: 100545) - in greenlist
      🗑️  Deleting voucher: OLDCODE (ID: 100546)
      ✅ Keeping voucher: SINDYMAENHOUT (ID: 100551) - in greenlist
      🗑️  Deleting voucher: TESTCODE (ID: 100547)
   ✅ Voucher cleanup complete: Checked 5, deleted 2

🎴 Syncing Odoo loyalty cards to Hostex vouchers...
   📋 Fetching loyalty cards from Odoo...
   ✅ Found 3 loyalty card(s) in Odoo
   🔄 Property 123: Creating vouchers (Account: 422121, Type: flat)...
      ℹ️  Voucher FRIENDSOFTHEVIEW already exists (ID: 100545) - skipping
      ℹ️  Voucher SINDYMAENHOUT already exists (ID: 100551) - skipping
      ➕ Creating voucher: NEWCARD (€25)
         ✅ Created voucher ID: 100888
   ✅ Loyalty sync complete: Created 1, Skipped 0, Errors 0
```

## Important Warnings

⚠️ **Empty Greenlist**: If `voucherGreenlist: []`, ALL vouchers will be deleted!

⚠️ **No Undo**: Deleted vouchers cannot be recovered - they must be recreated in Hostex

⚠️ **Case Insensitive**: `SUMMER2024` matches `summer2024` and `Summer2024`

⚠️ **Session Expires**: If you see authentication errors, get a fresh session cookie

## Troubleshooting

### "No properties configured"

- Add your property configuration to `src/config/property.ts`

### "No thirdparty_account_id configured"

- Add the `thirdpartyAccountId` field to your property config

### "Authentication failed" or "Unauthorized"

- Your session cookie has expired
- Get a fresh cookie from your browser (see Step 1)
- Update your `.env` file

### Vouchers not being deleted

- Check that voucher codes in greenlist match exactly (case-insensitive)
- Check console logs for error messages
- Verify `thirdpartyAccountId` is correct

## Getting Help

1. Check the console output for detailed error messages
2. Review `VOUCHER_MANAGEMENT.md` for more details
3. Check `src/config/README.md` for configuration options

## Quick Reference

**Files to Edit:**

- `.env` - Environment variables (session cookie)
- `src/config/property.ts` - Property configuration (greenlist)

**Key Concepts:**

- Greenlist = codes to KEEP during cleanup
- Everything else = DELETED on startup
- Loyalty cards = automatically create vouchers
- Case-insensitive matching
- Runs automatically on every app start

**Loyalty Card Sync:**

- Odoo loyalty cards → Hostex vouchers
- `discountType: 'flat'` = points as € (50 points = €50 off)
- `discountType: 'percent'` = points as % (20 points = 20% off)
- Existing vouchers are not duplicated
