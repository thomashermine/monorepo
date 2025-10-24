# Property Configuration

This directory contains configuration for property-specific settings including check-in/check-out times and voucher management.

## Configuration File

Edit `property.ts` to configure your properties. You can use `property.example.ts` as a reference.

## Property Configuration Structure

```typescript
export const PROPERTY: Record<number, PropertyConfig> = {
    [propertyId]: {
        times: {
            checkInHour: 16, // Check-in hour (24-hour format)
            checkInMinute: 0, // Check-in minute
            checkOutHour: 12, // Check-out hour (24-hour format)
            checkOutMinute: 0, // Check-out minute
        },
        voucherGreenlist: [
            // Voucher codes to keep
            'SUMMER2024',
            'WELCOME10',
        ],
        thirdpartyAccountId: '422121', // Hostex account ID
    },
}
```

## Voucher Greenlist

The `voucherGreenlist` array contains voucher codes that should be **kept** in Hostex. Any voucher codes not in this list will be **deleted** when the app starts.

### How It Works

1. On app startup, the system fetches all vouchers from Hostex for each configured property
2. It compares each voucher's code against the greenlist (case-insensitive)
3. Vouchers **not** in the greenlist are automatically deleted
4. Vouchers **in** the greenlist are kept

### Example Scenario

If your greenlist is:

```typescript
voucherGreenlist: ['SUMMER2024', 'WELCOME10', 'FRIENDS15']
```

And Hostex has these vouchers:

- `SUMMER2024` ✅ Kept (in greenlist)
- `WELCOME10` ✅ Kept (in greenlist)
- `OLDCODE` ❌ Deleted (not in greenlist)
- `TESTCODE` ❌ Deleted (not in greenlist)
- `FRIENDS15` ✅ Kept (in greenlist)

### Important Notes

- **Case-insensitive**: `SUMMER2024`, `summer2024`, and `Summer2024` are treated as the same
- **Automatic deletion**: Vouchers are deleted automatically on startup
- **No undo**: Once deleted, vouchers must be recreated
- **Empty greenlist**: If `voucherGreenlist: []`, **all** vouchers will be deleted!

## Required Environment Variables

For voucher management to work, you need:

```bash
HOSTEX_SESSION_COOKIE=your-session-cookie
```

You can get this from your browser's cookies after logging into Hostex.

## Functions Available

- `getPropertyTimes(propertyId)` - Get check-in/check-out times
- `getPropertyVoucherGreenlist(propertyId)` - Get voucher greenlist
- `getPropertyThirdpartyAccountId(propertyId)` - Get Hostex account ID
- `getAllPropertyIds()` - Get all configured property IDs

## Default Values

If a property is not configured:

- Check-in: 4:00 PM (16:00)
- Check-out: 12:00 PM (12:00)
- Voucher greenlist: Empty (no vouchers will be kept)
- Thirdparty account ID: undefined (voucher cleanup skipped)
