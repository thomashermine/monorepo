# Voucher Management System

This document describes the automatic voucher management system that was implemented.

## Overview

The system automatically manages Hostex vouchers (promotion codes) on application startup by:

1. Listing all vouchers from Hostex for each configured property
2. Comparing them against a configured greenlist
3. Deleting any vouchers that are NOT in the greenlist

## Configuration

### 1. Required Environment Variables

The session cookie must be configured as an environment variable:

```bash
# .env file
HOSTEX_ACCESS_TOKEN=your-access-token-here
HOSTEX_SESSION_COOKIE=your-session-cookie-here  # Required for voucher management
```

You can get the session cookie from your browser after logging into Hostex:

1. Open Developer Tools (F12)
2. Go to Application/Storage → Cookies → https://hostex.io
3. Copy the value of `hostex_session`

### 2. Update `src/config/property.ts`

The configuration has been renamed from `property-times.ts` to `property.ts` and now includes voucher management:

```typescript
export const PROPERTY: Record<number, PropertyConfig> = {
    123456: {
        times: {
            checkInHour: 16,
            checkInMinute: 0,
            checkOutHour: 12,
            checkOutMinute: 0,
        },
        voucherGreenlist: ['SUMMER2024', 'WELCOME10', 'FRIENDS15'],
        thirdpartyAccountId: '422121',
    },
}
```

## How It Works

### Startup Sequence

When the app starts, it performs these steps:

1. **Load Configuration**: Reads property configuration from `src/config/property.ts`
2. **Fetch Vouchers**: For each configured property with a `thirdpartyAccountId`, fetches all vouchers from Hostex
3. **Compare with Greenlist**: Checks each voucher code against the configured `voucherGreenlist` (case-insensitive)
4. **Delete Non-Greenlisted**: Automatically deletes any voucher not in the greenlist
5. **Log Results**: Displays detailed information about what was kept and deleted

### Console Output Example

```
🎫 Checking vouchers for cleanup...
   🔍 Property 123456: Checking vouchers (Account: 422121)
      📋 Found 8 voucher(s), greenlist has 3 code(s)
      ✅ Keeping voucher: SUMMER2024 (ID: 100550) - in greenlist
      ✅ Keeping voucher: WELCOME10 (ID: 100551) - in greenlist
      🗑️  Deleting voucher: OLDCODE (ID: 100545)
      🗑️  Deleting voucher: TEST123 (ID: 100546)
      ✅ Keeping voucher: FRIENDS15 (ID: 100552) - in greenlist
      🗑️  Deleting voucher: TESTCODE (ID: 100547)
   ✅ Voucher cleanup complete: Checked 8, deleted 3
```

## Files Modified/Created

### Created

- `src/config/property.ts` - Main configuration file
- `src/config/property.example.ts` - Example configuration
- `src/config/README.md` - Configuration documentation
- `src/server/voucher-cleanup.ts` - Voucher cleanup logic
- `VOUCHER_MANAGEMENT.md` - This file

### Modified

- `src/main.ts` - Added voucher cleanup on startup
- `src/server/calendar-checkinout-json.ts` - Updated import path
- `src/server/calendar-checkinout-ics.ts` - Updated import path

### Deleted

- `src/config/property-times.ts` - Replaced by `property.ts`

## Safety Features

1. **Error Handling**: If voucher cleanup fails, the app continues to start normally
2. **Detailed Logging**: Every action is logged for auditing
3. **Graceful Degradation**: If a property has no `thirdpartyAccountId`, it's skipped
4. **Case-Insensitive**: Voucher code comparison is case-insensitive

## Important Warnings

⚠️ **Empty Greenlist**: If `voucherGreenlist: []`, ALL vouchers will be deleted!

⚠️ **No Undo**: Once a voucher is deleted, it must be recreated manually in Hostex

⚠️ **Session Cookie**: The session cookie may expire. If you see authentication errors, get a fresh cookie

## Testing

To test the voucher system without affecting production:

1. Create a test property configuration with a small greenlist
2. Create some test vouchers in Hostex
3. Start the app and check the console output
4. Verify that only greenlisted vouchers remain in Hostex

## Troubleshooting

### "No properties configured - skipping voucher cleanup"

- You need to add at least one property to the `PROPERTY` object in `src/config/property.ts`

### "No thirdparty_account_id configured - skipping"

- Add the `thirdpartyAccountId` field to your property configuration

### Authentication Errors

- Your session cookie may have expired
- Get a fresh cookie from your browser and update your `.env` file

### Vouchers Not Being Deleted

- Check that the voucher codes in your greenlist match exactly (ignoring case)
- Check the console output for error messages

## API Details

The system uses these Hostex private API endpoints:

- `GET /api/bs/promotion_code/list` - List all vouchers
- `POST /api/bs/promotion_code/delete` - Delete a voucher

These are authenticated using the `hostex_session` cookie.

## Future Enhancements

Potential improvements:

- Add a dry-run mode to preview what would be deleted
- Support for creating vouchers from configuration
- Scheduled cleanup (not just on startup)
- Webhook integration for real-time voucher management
