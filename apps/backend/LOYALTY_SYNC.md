# Loyalty Card to Voucher Sync

This document describes the automatic synchronization of Odoo loyalty cards to Hostex vouchers.

## Overview

After cleaning up vouchers on app startup, the system automatically:

1. Fetches all loyalty cards from Odoo
2. Creates corresponding vouchers in Hostex for each loyalty card
3. Skips vouchers that already exist

## How It Works

### Startup Sequence

1. **Cleanup Phase**: Remove non-greenlisted vouchers
2. **Sync Phase**: Create vouchers from Odoo loyalty cards
    - Fetch all loyalty cards from Odoo
    - For each property with configuration:
        - Check if voucher already exists (by code)
        - Create voucher if it doesn't exist
        - Skip if already present

### Mapping

Odoo loyalty cards are converted to Hostex vouchers as follows:

| Odoo Field        | Hostex Field           | Notes                                    |
| ----------------- | ---------------------- | ---------------------------------------- |
| `code`            | `code`                 | Voucher code (converted to uppercase)    |
| `points`          | `discount`             | Discount value (rounded to integer)      |
| `expiration_date` | `expired_at`           | Expiration date                          |
| -                 | `discount_type`        | From configuration (`flat` or `percent`) |
| -                 | `minimum_stay`         | From configuration (default: 1)          |
| -                 | `number_of_redemption` | From configuration (default: 1)          |

## Configuration

### Property Configuration

Add the `loyaltyToVoucher` section to your property configuration:

```typescript
// src/config/property.ts
export const PROPERTY: Record<number, PropertyConfig> = {
    123: {
        times: {
            /* ... */
        },
        voucherGreenlist: ['FRIENDSOFTHEVIEW', 'SINDYMAENHOUT'],
        thirdpartyAccountId: '422121',

        // Loyalty card to voucher conversion
        loyaltyToVoucher: {
            discountType: 'flat', // How to interpret points
            minimumStay: 1, // Minimum nights to use voucher
            numberOfRedemptions: 1, // How many times it can be used
        },
    },
}
```

### Discount Type Options

**`flat` (Recommended for Currency Points)**

- Loyalty card points = Currency discount
- Example: 50 points → €50 off

**`percent` (For Percentage Discounts)**

- Loyalty card points = Percentage discount
- Example: 20 points → 20% off

### Default Configuration

If `loyaltyToVoucher` is not specified, these defaults are used:

```typescript
{
    discountType: 'flat',
    minimumStay: 1,
    numberOfRedemptions: 1,
}
```

## Console Output Example

```
🎴 Syncing Odoo loyalty cards to Hostex vouchers...
   📋 Fetching loyalty cards from Odoo...
   ✅ Found 3 loyalty card(s) in Odoo
   🔄 Property 123: Creating vouchers (Account: 422121, Type: flat)...
      ➕ Creating voucher: FRIENDSOFTHEVIEW (€15)
         ✅ Created voucher ID: 100887
      ℹ️  Voucher SINDYMAENHOUT already exists (ID: 100551) - skipping
      ➕ Creating voucher: WELCOMEBACK (€30)
         ✅ Created voucher ID: 100888
   ✅ Loyalty sync complete: Created 2, Skipped 0, Errors 0
```

## Validation

The system validates loyalty cards before creating vouchers:

- **Skips if no code**: Loyalty card must have a code
- **Skips if no points**: Points must be > 0
- **Skips if exists**: Voucher with same code already exists
- **Case insensitive**: `SUMMER2024` matches `summer2024`

## Important Notes

⚠️ **Automatic Greenlist**: Loyalty card codes are automatically kept during voucher cleanup. You don't need to add them to `voucherGreenlist` - they will be recreated if deleted.

⚠️ **Single Property**: If you have multiple properties, each will create its own set of vouchers from the same Odoo loyalty cards.

⚠️ **Points Rounding**: Loyalty card points are rounded to integers for Hostex vouchers.

⚠️ **Idempotent**: Running multiple times is safe - existing vouchers are not duplicated.

## Workflow

### Complete Startup Flow

```
App Start
    ↓
1. Register Webhooks
    ↓
2. Cleanup Vouchers (delete non-greenlisted)
    ↓
3. Sync Loyalty Cards → Vouchers
    ↓
4. Display Loyalty Cards (info only)
    ↓
Server Ready
```

## Troubleshooting

### "No loyalty cards found in Odoo"

- Check that you have loyalty cards in your Odoo instance
- Verify Odoo connection settings in `.env`

### "Failed to create voucher"

- Check console for detailed error message
- Verify `thirdpartyAccountId` is correct
- Ensure `HOSTEX_SESSION_COOKIE` is valid

### Vouchers not being created

- Check that loyalty cards have valid codes and points
- Check console for "Skipping" messages
- Verify property configuration includes `loyaltyToVoucher`

### Duplicate vouchers

- Should not happen - system checks for existing vouchers
- If it does, check console logs for the logic flow

## Example Scenarios

### Scenario 1: Flat Discount (Currency)

**Odoo Loyalty Card:**

- Code: `WELCOME50`
- Points: 50

**Configuration:**

```typescript
loyaltyToVoucher: {
    discountType: 'flat',
    minimumStay: 1,
}
```

**Result:** Hostex voucher for €50 off, single use

### Scenario 2: Percentage Discount

**Odoo Loyalty Card:**

- Code: `VIP20`
- Points: 20

**Configuration:**

```typescript
loyaltyToVoucher: {
    discountType: 'percent',
    minimumStay: 2,
    numberOfRedemptions: 3,
}
```

**Result:** Hostex voucher for 20% off, minimum 2 nights, 3 uses allowed

### Scenario 3: Multiple Properties

**Setup:**

- Property A (ID: 123)
- Property B (ID: 456)
- 1 Loyalty Card: `THANKS`

**Result:**

- Voucher created in Property A's Hostex account
- Voucher created in Property B's Hostex account
- Both use same code but are separate vouchers

## Integration with Cleanup

The loyalty sync integrates seamlessly with voucher cleanup:

1. **Cleanup Phase**: Removes old/unwanted vouchers
2. **Sync Phase**: Creates fresh vouchers from Odoo
3. **Result**: Only current loyalty cards exist as vouchers

This ensures your Hostex vouchers always match your Odoo loyalty cards.

## Disabling Sync

To disable loyalty sync for a property, simply omit the `loyaltyToVoucher` configuration or set `thirdpartyAccountId` to empty.

## API Details

### Odoo API

- Endpoint: `loyalty.card` model
- Method: `search_read`
- Fields: `id`, `code`, `points`, `expiration_date`, `partner_id`

### Hostex API

- Endpoint: `/api/bs/promotion_code/create`
- Method: `POST`
- Authentication: Session cookie

## Future Enhancements

Potential improvements:

- Two-way sync (update Odoo when voucher is redeemed)
- Sync on schedule (not just startup)
- Delete vouchers when loyalty card is deleted
- Support for listing-specific loyalty vouchers
