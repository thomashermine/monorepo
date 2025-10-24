/**
 * Property-specific configuration
 */

export interface PropertyTimeConfig {
    checkInHour: number // 24-hour format
    checkInMinute: number
    checkOutHour: number
    checkOutMinute: number
}

export interface LoyaltyToVoucherConfig {
    /** How to interpret loyalty card points as voucher discounts */
    discountType: 'percent' | 'flat'
    /** Minimum stay requirement for loyalty vouchers (in nights) */
    minimumStay?: number
    /** Maximum number of redemptions per loyalty voucher */
    numberOfRedemptions?: number
}

export interface PropertyConfig {
    times: PropertyTimeConfig
    /** Greenlist of voucher codes that should be kept. All other vouchers will be deleted on app startup. */
    voucherGreenlist: string[]
    /** Hostex thirdparty_account_id for this property */
    thirdpartyAccountId: string
    /** Configuration for converting Odoo loyalty cards to Hostex vouchers */
    loyaltyToVoucher?: LoyaltyToVoucherConfig
}

/**
 * Configuration per property ID
 * Default: Check-in at 4pm (16:00), Check-out at noon (12:00)
 */
export const PROPERTY: Record<number, PropertyConfig> = {
    123: {
        thirdpartyAccountId: '422121',
        times: {
            checkInHour: 16,
            checkInMinute: 0,
            checkOutHour: 12,
            checkOutMinute: 0,
        },
        voucherGreenlist: ['FRIENDSOFTHEVIEW', 'SINDYMAENHOUT'],
    },
}

/**
 * Default check-in and check-out times if property not configured
 */
export const DEFAULT_TIMES: PropertyTimeConfig = {
    checkInHour: 16, // 4pm
    checkInMinute: 0,
    checkOutHour: 12, // noon
    checkOutMinute: 0,
}

/**
 * Get check-in/check-out times for a specific property
 */
export function getPropertyTimes(propertyId: number): PropertyTimeConfig {
    return PROPERTY[propertyId]?.times ?? DEFAULT_TIMES
}

/**
 * Get voucher greenlist for a specific property
 */
export function getPropertyVoucherGreenlist(propertyId: number): string[] {
    return PROPERTY[propertyId]?.voucherGreenlist ?? []
}

/**
 * Get thirdparty account ID for a specific property
 */
export function getPropertyThirdpartyAccountId(
    propertyId: number
): string | undefined {
    return PROPERTY[propertyId]?.thirdpartyAccountId
}

/**
 * Get all configured property IDs
 */
export function getAllPropertyIds(): number[] {
    return Object.keys(PROPERTY).map(Number)
}

/**
 * Get loyalty to voucher configuration for a specific property
 */
export function getPropertyLoyaltyToVoucherConfig(
    propertyId: number
): LoyaltyToVoucherConfig | undefined {
    return PROPERTY[propertyId]?.loyaltyToVoucher
}
