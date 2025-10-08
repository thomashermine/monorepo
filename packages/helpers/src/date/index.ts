/**
 * Generate a future date from now
 */
export const futureDate = (days: number = 30): string => {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]!
}

/**
 * Generate a date in ISO string format
 */
export const isoDate = (): string => {
    return new Date().toISOString()
}

/**
 * Parse a date string into a Date object
 */
export const parseDate = (date: string): Date | null => {
    const parsed = new Date(date)
    return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

/**
 * Subtract days from a date
 */
export const subtractDays = (date: Date, days: number): Date => {
    return new Date(date.getTime() - days * 24 * 60 * 60 * 1000)
}

/**
 * Get the start of a day
 */
export const getStartOfDay = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * Get the end of a day
 */
export const getEndOfDay = (date: Date): Date => {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999
    )
}

/**
 * Check if a date is valid
 */
export const isValidDate = (date: Date): boolean => {
    if (!date) return false
    if (typeof date !== 'object') return false
    return !isNaN(date.getTime())
}

/**
 * Get the days difference between two dates
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
    return Math.floor(
        (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
    )
}

/**
 * Format a date string into a readable string
 */
export const formatDate = (
    date: Date,
    format: string = 'YYYY-MM-DD'
): string => {
    return format
        .replace('YYYY', date.getFullYear().toString())
        .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
        .replace('DD', date.getDate().toString().padStart(2, '0'))
}

/**
 * Calculate the number of nights between check-in and check-out dates
 */
export const calculateNights = (checkIn: string, checkOut: string): number => {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const diffTime = checkOutDate.getTime() - checkInDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Convert date string with time to ICS datetime array format
 * @returns [year, month, day, hour, minute]
 */
export const parseICSDateTime = (
    dateString: string,
    hour: number,
    minute: number
): [number, number, number, number, number] => {
    const date = new Date(dateString)
    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        hour,
        minute,
    ]
}
