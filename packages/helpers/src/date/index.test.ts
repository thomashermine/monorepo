import { describe, expect, it } from 'vitest'

import {
    addDays,
    formatDate,
    getDaysDifference,
    getEndOfDay,
    getStartOfDay,
    isValidDate,
    parseDate,
    subtractDays,
} from './index'

describe('Date Helper Functions', () => {
    describe('formatDate', () => {
        it('should format date to YYYY-MM-DD', () => {
            const date = new Date('2024-01-15T10:30:00')
            expect(formatDate(date)).toBe('2024-01-15')
        })

        it('should handle custom format', () => {
            const date = new Date('2024-01-15T10:30:00')
            expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/15/2024')
        })
    })

    describe('parseDate', () => {
        it('should parse date string', () => {
            const result = parseDate('2024-01-15')
            expect(result).toBeInstanceOf(Date)
            expect(result?.getFullYear()).toBe(2024)
            expect(result?.getMonth()).toBe(0)
            expect(result?.getDate()).toBe(15)
        })

        it('should return null for invalid date string', () => {
            expect(parseDate('invalid-date')).toBeNull()
        })
    })

    describe('addDays', () => {
        it('should add days to a date', () => {
            const date = new Date('2024-01-15')
            const result = addDays(date, 5)
            expect(result.getDate()).toBe(20)
        })

        it('should handle negative days', () => {
            const date = new Date('2024-01-15')
            const result = addDays(date, -5)
            expect(result.getDate()).toBe(10)
        })
    })

    describe('subtractDays', () => {
        it('should subtract days from a date', () => {
            const date = new Date('2024-01-15')
            const result = subtractDays(date, 5)
            expect(result.getDate()).toBe(10)
        })
    })

    describe('getDaysDifference', () => {
        it('should calculate difference between two dates', () => {
            const date1 = new Date('2024-01-15')
            const date2 = new Date('2024-01-20')
            expect(getDaysDifference(date1, date2)).toBe(5)
        })

        it('should return negative for reversed dates', () => {
            const date1 = new Date('2024-01-20')
            const date2 = new Date('2024-01-15')
            expect(getDaysDifference(date1, date2)).toBe(-5)
        })
    })

    describe('isValidDate', () => {
        it('should return true for valid date', () => {
            expect(isValidDate(new Date('2024-01-15'))).toBe(true)
        })

        it('should return false for invalid date', () => {
            expect(isValidDate(new Date('invalid'))).toBe(false)
        })

        it('should return false for non-date values', () => {
            expect(isValidDate('localhost' as unknown as Date)).toBe(false)
            expect(isValidDate(null as unknown as Date)).toBe(false)
        })
    })

    describe('getStartOfDay', () => {
        it('should return start of day', () => {
            const date = new Date('2024-01-15T15:30:45')
            const result = getStartOfDay(date)
            expect(result.getHours()).toBe(0)
            expect(result.getMinutes()).toBe(0)
            expect(result.getSeconds()).toBe(0)
            expect(result.getMilliseconds()).toBe(0)
        })
    })

    describe('getEndOfDay', () => {
        it('should return end of day', () => {
            const date = new Date('2024-01-15T10:30:00')
            const result = getEndOfDay(date)
            expect(result.getHours()).toBe(23)
            expect(result.getMinutes()).toBe(59)
            expect(result.getSeconds()).toBe(59)
            expect(result.getMilliseconds()).toBe(999)
        })
    })
})
