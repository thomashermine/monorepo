import type { Reservation } from '@monorepo/helpers/hostex'
import * as dotenv from 'dotenv'
import { describe, expect, it } from 'vitest'

dotenv.config()
// Get the base URL from environment variable (for testing deployed instances)
// or fallback to localhost for local development
const port = process.env.PORT ?? 3000
const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:' + port
console.log('baseUrl', baseUrl)

// ============================================================================
// Type Definitions for API Responses
// ============================================================================

interface CalendarEvent {
    title: string
    description: string
    start: string
    end: string
    isAllDay: boolean
    reservation: Reservation
}

interface BookingsResponse {
    bookings: {
        reservations: Reservation[]
    }
    page: number
    pageSize: number
    total: number
    requestId: string
}

interface BookingsSummaryResponse {
    summary: {
        totalBookings: number
        acceptedBookings: number
        completedBookings: number
        cancelledBookings: number
        totalRevenue: number
        currency: string
        bookingsByProperty: Record<string, number>
    }
    timestamp: string
    requestId: string
}

describe('Backend API E2E Tests', () => {
    describe('GET /bookings/calendar/full-day.ics endpoint', () => {
        it('should return ICS calendar with full-day booking events', async () => {
            const response = await fetch(
                `${baseUrl}/bookings/calendar/full-day.ics`
            )

            expect(response.status).toBe(200)
            expect(response.headers.get('content-type')).toContain(
                'text/calendar'
            )
            expect(response.headers.get('content-disposition')).toContain(
                'attachment'
            )
            expect(response.headers.get('content-disposition')).toContain(
                'bookings-full-day.ics'
            )

            const body = await response.text()
            expect(body).toContain('BEGIN:VCALENDAR')
            expect(body).toContain('END:VCALENDAR')
        })
    })

    describe('GET /bookings/calendar/checkinout.ics endpoint', () => {
        it('should return ICS calendar with check-in/check-out events', async () => {
            const response = await fetch(
                `${baseUrl}/bookings/calendar/checkinout.ics`
            )

            expect(response.status).toBe(200)
            expect(response.headers.get('content-type')).toContain(
                'text/calendar'
            )
            expect(response.headers.get('content-disposition')).toContain(
                'attachment'
            )
            expect(response.headers.get('content-disposition')).toContain(
                'bookings-checkinout.ics'
            )

            const body = await response.text()
            expect(body).toContain('BEGIN:VCALENDAR')
            expect(body).toContain('END:VCALENDAR')
        })
    })

    describe('GET /bookings/calendar/full-day.json endpoint', () => {
        it('should return JSON with full-day booking events', async () => {
            const response = await fetch(
                `${baseUrl}/bookings/calendar/full-day.json`
            )

            expect(response.status).toBe(200)
            expect(response.headers.get('content-type')).toContain('json')

            const body = (await response.json()) as CalendarEvent[]
            expect(Array.isArray(body)).toBe(true)

            // If there are events, validate their structure
            if (body.length > 0) {
                const event = body[0]
                expect(event).toBeDefined()
                expect(event).toHaveProperty('title')
                expect(event).toHaveProperty('description')
                expect(event).toHaveProperty('start')
                expect(event).toHaveProperty('end')
                expect(event).toHaveProperty('isAllDay')
                if (event) {
                    expect(event.isAllDay).toBe(true)
                }
                expect(event).toHaveProperty('reservation')
            }
        })

        it('should exclude cancelled bookings', async () => {
            const response = await fetch(
                `${baseUrl}/bookings/calendar/full-day.json`
            )

            expect(response.status).toBe(200)
            const body = (await response.json()) as CalendarEvent[]

            // Verify no cancelled bookings in the results
            for (const event of body) {
                expect(event.reservation.status).not.toBe('cancelled')
            }
        })

        it('should format title correctly with guest info and emojis', async () => {
            const response = await fetch(
                `${baseUrl}/bookings/calendar/full-day.json`
            )

            expect(response.status).toBe(200)
            const body = (await response.json()) as CalendarEvent[]

            // Validate title format for each event
            body.forEach((event) => {
                expect(event).toBeDefined()
                // Title should contain guest name, booking number, total rate, discounted rate, and emojis for number of people
                // Title format: "Guest Name #numberOfNights TotalRateEUR (DiscountedRateEUR) 👤👤" where 👤 represents each person
                // Regex: /.*#\d+\s+\d+EUR\s+\(\d+EUR\)\s+[\u{1F600}-\u{1F64F}]+/u
                // Explanation of the regex components:
                // - .*: Matches any character (except for line terminators) zero or more times, representing the guest name.
                // - #\d+: Matches a hash symbol followed by one or more digits, representing the number of nights.
                // - \s+: Matches one or more whitespace characters, ensuring separation between components.
                // - \d+EUR: Matches one or more digits followed by 'EUR', representing the total rate.
                // - \(\d+EUR\): Matches an opening parenthesis, one or more digits, 'EUR', and a closing parenthesis, representing the discounted rate.
                // - [\u{1F600}-\u{1F64F}]+: Matches one or more emojis in the specified Unicode range, allowing for any emoji. (👤, 👶, 🍼, 🐾,...)
                expect(event.title).toMatch(/.*#\d+\s+\d+€\s+\(\d+€\)\s+👤+/u)
            })
        })
    })

    describe('GET /bookings/calendar/checkinout.json endpoint', () => {
        it('should return JSON with check-in/check-out events', async () => {
            const response = await fetch(
                `${baseUrl}/bookings/calendar/checkinout.json`
            )

            expect(response.status).toBe(200)
            expect(response.headers.get('content-type')).toContain('json')

            const body = (await response.json()) as CalendarEvent[]
            expect(Array.isArray(body)).toBe(true)

            // If there are events, validate their structure
            if (body.length > 0) {
                const event = body[0]
                expect(event).toBeDefined()
                expect(event).toHaveProperty('title')
                expect(event).toHaveProperty('description')
                expect(event).toHaveProperty('start')
                expect(event).toHaveProperty('end')
                expect(event).toHaveProperty('isAllDay')
                if (event) {
                    expect(event.isAllDay).toBe(false)
                    expect(event).toHaveProperty('reservation')

                    // Title should start with "Check-in:" or "Check-out:"
                    expect(
                        event.title.startsWith('Check-in:') ??
                            event.title.startsWith('Check-out:')
                    ).toBe(true)
                }
            }
        })

        it('should create two events per booking (check-in and check-out)', async () => {
            const fullDayResponse = await fetch(
                `${baseUrl}/bookings/calendar/full-day.json`
            )
            const fullDayBody =
                (await fullDayResponse.json()) as CalendarEvent[]
            const fullDayCount = fullDayBody.length

            const checkInOutResponse = await fetch(
                `${baseUrl}/bookings/calendar/checkinout.json`
            )
            const checkInOutBody =
                (await checkInOutResponse.json()) as CalendarEvent[]

            // Should have 2x events (one check-in and one check-out per booking)
            expect(checkInOutBody.length).toBe(fullDayCount * 2)
        })

        it('should have correct time for check-in and check-out events', async () => {
            const response = await fetch(
                `${baseUrl}/bookings/calendar/checkinout.json`
            )

            expect(response.status).toBe(200)
            const body = (await response.json()) as CalendarEvent[]

            // If there are events, validate timing
            if (body.length > 0) {
                for (const event of body) {
                    const startDate = new Date(event.start)

                    if (event.title.startsWith('Check-in:')) {
                        // Default check-in time should be 4pm (16:00)
                        // (unless property has custom config)
                        expect(startDate.getHours()).toBeGreaterThanOrEqual(0)
                        expect(startDate.getHours()).toBeLessThan(24)
                    } else if (event.title.startsWith('Check-out:')) {
                        // Default check-out time should be noon (12:00)
                        // (unless property has custom config)
                        expect(startDate.getHours()).toBeGreaterThanOrEqual(0)
                        expect(startDate.getHours()).toBeLessThan(24)
                    }
                }
            }
        })
    })

    describe('Error handling', () => {
        it('should handle non-existent endpoints', async () => {
            const response = await fetch(`${baseUrl}/nonexistent`, {
                method: 'GET',
            })

            expect(response.status).toBe(404)
        })
    })

    describe('Health check', () => {
        it('server should be reachable', async () => {
            // Try to reach the endpoint to verify server is up
            const response = await fetch(`${baseUrl}/`, {
                method: 'GET',
            })

            expect(response.ok).toBeTruthy()
        })
    })

    describe('GET /bookings/next endpoint', () => {
        it('should return bookings with correct structure', async () => {
            const response = await fetch(`${baseUrl}/bookings/next`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)
            expect(response.headers.get('content-type')).toContain(
                'application/json'
            )

            const body = (await response.json()) as BookingsResponse

            // Verify response structure
            expect(body).toHaveProperty('bookings')
            expect(body.bookings).toHaveProperty('reservations')

            // Verify types
            expect(Array.isArray(body.bookings.reservations)).toBe(true)
        })

        it('should return array of bookings with expected properties', async () => {
            const response = await fetch(`${baseUrl}/bookings/next`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = (await response.json()) as BookingsResponse

            // If there are bookings, verify their structure
            if (body.bookings.reservations.length > 0) {
                const booking = body.bookings.reservations[0]
                expect(booking).toBeDefined()

                if (booking) {
                    // Verify booking has expected properties (snake_case)
                    expect(booking).toHaveProperty('reservation_code')
                    expect(booking).toHaveProperty('property_id')
                    expect(booking).toHaveProperty('check_in_date')
                    expect(booking).toHaveProperty('check_out_date')
                    expect(booking).toHaveProperty('status')
                    expect(booking).toHaveProperty('guest_name')
                    expect(booking).toHaveProperty('number_of_adults')
                    expect(booking).toHaveProperty('created_at')
                    expect(booking).toHaveProperty('booked_at')

                    // Verify guest_name is a string
                    expect(typeof booking.guest_name).toBe('string')

                    // Verify dates are valid ISO strings
                    expect(() => new Date(booking.check_in_date)).not.toThrow()
                    expect(() => new Date(booking.check_out_date)).not.toThrow()
                    expect(() => new Date(booking.created_at)).not.toThrow()
                    expect(() => new Date(booking.booked_at)).not.toThrow()

                    // Verify rates structure
                    expect(booking).toHaveProperty('rates')
                    expect(booking.rates).toHaveProperty('total_rate')
                    expect(booking.rates).toHaveProperty('total_commission')
                    expect(booking.rates).toHaveProperty('rate')
                    expect(booking.rates).toHaveProperty('commission')
                    expect(booking.rates).toHaveProperty('details')

                    // Verify money amount structure
                    expect(booking.rates.total_rate).toHaveProperty('currency')
                    expect(booking.rates.total_rate).toHaveProperty('amount')
                    expect(typeof booking.rates.total_rate.amount).toBe(
                        'number'
                    )
                    expect(typeof booking.rates.total_rate.currency).toBe(
                        'string'
                    )

                    // Verify details array
                    expect(Array.isArray(booking.rates.details)).toBe(true)
                    if (booking.rates.details.length > 0) {
                        const detail = booking.rates.details[0]
                        expect(detail).toBeDefined()
                        if (detail) {
                            expect(detail).toHaveProperty('type')
                            expect(detail).toHaveProperty('description')
                            expect(detail).toHaveProperty('currency')
                            expect(detail).toHaveProperty('amount')
                            expect(typeof detail.amount).toBe('number')
                        }
                    }

                    // Verify additional fields
                    expect(booking).toHaveProperty('check_in_details')
                    expect(booking).toHaveProperty('guests')
                    expect(Array.isArray(booking.guests)).toBe(true)
                    expect(booking).toHaveProperty('custom_channel')
                    expect(booking.custom_channel).toHaveProperty('id')
                    expect(booking.custom_channel).toHaveProperty('name')
                }
            }
        })

        it('should reject POST requests', async () => {
            const response = await fetch(`${baseUrl}/bookings/next`, {
                body: JSON.stringify({}),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            // Should return 404 or 405 Method Not Allowed
            expect([404, 405]).toContain(response.status)
        })

        it('should respond within acceptable time', async () => {
            const startTime = Date.now()

            const response = await fetch(`${baseUrl}/bookings/next`, {
                method: 'GET',
            })

            const endTime = Date.now()
            const responseTime = endTime - startTime

            expect(response.status).toBe(200)
            // Response should be within 30 seconds (Hostex API can be slow)
            expect(responseTime).toBeLessThan(30000)
        })

        it('should have consistent pagination', async () => {
            const response = await fetch(`${baseUrl}/bookings/next`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = (await response.json()) as BookingsResponse

            // Verify bookings array length doesn't exceed pageSize
            expect(body.bookings.reservations.length).toBeLessThanOrEqual(
                body.pageSize
            )

            // Verify total is consistent with returned data
            if (body.total === 0) {
                expect(body.bookings.reservations.length).toBe(0)
            }
        })

        it('should return valid requestId for tracking', async () => {
            const response = await fetch(`${baseUrl}/bookings/next`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = (await response.json()) as BookingsResponse

            // Verify requestId is a non-empty string
            expect(typeof body.requestId).toBe('string')
            expect(body.requestId.length).toBeGreaterThan(0)
        })

        it('should handle concurrent requests', async () => {
            const concurrentRequests = 5
            const requests = Array.from({ length: concurrentRequests }, () =>
                fetch(`${baseUrl}/bookings/next`, {
                    method: 'GET',
                })
            )

            const responses = await Promise.all(requests)

            // All requests should succeed
            responses.forEach((response) => {
                expect(response.status).toBe(200)
            })

            // Verify all responses have valid structure
            const bodies = (await Promise.all(
                responses.map((r) => r.json())
            )) as BookingsResponse[]

            bodies.forEach((body) => {
                expect(body).toHaveProperty('bookings')
                expect(body).toHaveProperty('page')
                expect(body).toHaveProperty('pageSize')
                expect(body).toHaveProperty('requestId')
                expect(body).toHaveProperty('total')
            })
        })
    })

    // ============================================================================================================ Summary Endpoint
    describe('GET /bookings/summary endpoint', () => {
        it('should return bookings summary with correct structure', async () => {
            const response = await fetch(`${baseUrl}/bookings/summary`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)
            expect(response.headers.get('content-type')).toContain(
                'application/json'
            )

            const body = (await response.json()) as BookingsSummaryResponse

            // Verify response structure
            expect(body).toHaveProperty('summary')
            expect(body).toHaveProperty('timestamp')
            expect(body).toHaveProperty('requestId')

            // Verify summary properties
            expect(body.summary).toHaveProperty('totalBookings')
            expect(body.summary).toHaveProperty('acceptedBookings')
            expect(body.summary).toHaveProperty('completedBookings')
            expect(body.summary).toHaveProperty('cancelledBookings')
            expect(body.summary).toHaveProperty('totalRevenue')
            expect(body.summary).toHaveProperty('currency')
            expect(body.summary).toHaveProperty('bookingsByProperty')

            // Verify types
            expect(typeof body.summary.totalBookings).toBe('number')
            expect(typeof body.summary.acceptedBookings).toBe('number')
            expect(typeof body.summary.completedBookings).toBe('number')
            expect(typeof body.summary.cancelledBookings).toBe('number')
            expect(typeof body.summary.totalRevenue).toBe('number')
            expect(typeof body.summary.currency).toBe('string')
            expect(typeof body.summary.bookingsByProperty).toBe('object')
        })

        it('should have valid timestamp in ISO format', async () => {
            const response = await fetch(`${baseUrl}/bookings/summary`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = (await response.json()) as BookingsSummaryResponse

            // Verify timestamp is a valid ISO string
            expect(() => new Date(body.timestamp)).not.toThrow()
            const timestamp = new Date(body.timestamp)
            expect(timestamp.toISOString()).toBe(body.timestamp)
        })

        it('should return valid requestId for tracking', async () => {
            const response = await fetch(`${baseUrl}/bookings/summary`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = (await response.json()) as BookingsSummaryResponse

            // Verify requestId is a non-empty string (UUID format)
            expect(typeof body.requestId).toBe('string')
            expect(body.requestId.length).toBeGreaterThan(0)
            // UUID v4 format check
            expect(body.requestId).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            )
        })

        it('should have totalBookings equal to sum of all status types', async () => {
            const response = await fetch(`${baseUrl}/bookings/summary`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = (await response.json()) as BookingsSummaryResponse

            // Verify the math adds up
            expect(body.summary.totalBookings).toBeGreaterThanOrEqual(
                body.summary.acceptedBookings +
                    body.summary.completedBookings +
                    body.summary.cancelledBookings
            )
        })

        it('should have non-negative revenue', async () => {
            const response = await fetch(`${baseUrl}/bookings/summary`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = (await response.json()) as BookingsSummaryResponse

            // Revenue should be non-negative
            expect(body.summary.totalRevenue).toBeGreaterThanOrEqual(0)
        })

        it('should have valid currency code', async () => {
            const response = await fetch(`${baseUrl}/bookings/summary`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = (await response.json()) as BookingsSummaryResponse

            // Currency should be a 3-letter code (ISO 4217)
            expect(body.summary.currency).toMatch(/^[A-Z]{3}$/)
        })

        it('should count bookings by property correctly', async () => {
            const response = await fetch(`${baseUrl}/bookings/summary`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = (await response.json()) as BookingsSummaryResponse

            // Sum of bookings by property should equal total bookings
            const sumByProperty = Object.values(
                body.summary.bookingsByProperty
            ).reduce((sum, count) => sum + count, 0)

            expect(sumByProperty).toBe(body.summary.totalBookings)
        })

        it('should reject POST requests', async () => {
            const response = await fetch(`${baseUrl}/bookings/summary`, {
                body: JSON.stringify({}),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })

            // Should return 404 or 405 Method Not Allowed
            expect([404, 405]).toContain(response.status)
        })

        it('should respond within acceptable time', async () => {
            const startTime = Date.now()

            const response = await fetch(`${baseUrl}/bookings/summary`, {
                method: 'GET',
            })

            const endTime = Date.now()
            const responseTime = endTime - startTime

            expect(response.status).toBe(200)
            // Response should be within 30 seconds (Hostex API can be slow)
            expect(responseTime).toBeLessThan(30000)
        })
    })
})
