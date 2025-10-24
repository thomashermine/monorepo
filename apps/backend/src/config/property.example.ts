/**
 * Example Property Configuration
 *
 * Copy this file to property.ts and customize for your properties
 */

import type { PropertyConfig } from './property'

/**
 * Example configuration for property ID 123456
 */
export const PROPERTY_EXAMPLE: Record<number, PropertyConfig> = {
    123456: {
        times: {
            checkInHour: 16, // 4pm
            checkInMinute: 0,
            checkOutHour: 12, // noon
            checkOutMinute: 0,
        },
        // Voucher codes that should be kept. All other vouchers will be deleted on app startup.
        voucherGreenlist: [
            'SUMMER2024',
            'WELCOME10',
            'FRIENDS15',
            'REPEATGUEST20',
        ],
        // Your Hostex thirdparty_account_id (required for voucher management)
        thirdpartyAccountId: '422121',
        // How to convert Odoo loyalty card points to Hostex vouchers
        loyaltyToVoucher: {
            discountType: 'flat', // 'flat' = points as currency (e.g., 50 points = €50 off)
            // 'percent' = points as percentage (e.g., 20 points = 20% off)
            minimumStay: 1, // Minimum nights required to use voucher
            numberOfRedemptions: 1, // How many times the voucher can be used
        },
    },

    // Another property example with percentage-based loyalty vouchers
    789012: {
        times: {
            checkInHour: 15, // 3pm
            checkInMinute: 0,
            checkOutHour: 11, // 11am
            checkOutMinute: 0,
        },
        voucherGreenlist: ['EARLYBIRD10', 'WEEKEND25'],
        thirdpartyAccountId: '555555',
        loyaltyToVoucher: {
            discountType: 'percent', // Points as percentage discount
            minimumStay: 2,
            numberOfRedemptions: 3, // Allow 3 uses per voucher
        },
    },
}
