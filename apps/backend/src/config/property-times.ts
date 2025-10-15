/**
 * Property-specific check-in and check-out times configuration
 */

export interface PropertyTimeConfig {
    checkInHour: number // 24-hour format
    checkInMinute: number
    checkOutHour: number
    checkOutMinute: number
}

/**
 * Configuration for check-in/check-out times per property ID
 * Default: Check-in at 4pm (16:00), Check-out at noon (12:00)
 */
export const PROPERTY_TIMES: Record<number, PropertyTimeConfig> = {
    // Add your property-specific configurations here
    // Example:
    // 123: {
    //     checkInHour: 15,
    //     checkInMinute: 0,
    //     checkOutHour: 11,
    //     checkOutMinute: 0,
    // },
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
    return PROPERTY_TIMES[propertyId] ?? DEFAULT_TIMES
}
