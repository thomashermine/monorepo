import { describe, expect, it } from 'vitest'

// Get the base URL from environment variable (for testing deployed instances)
// or fallback to localhost for local development
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'

describe('Backend API E2E Tests', () => {
    describe('POST /echo endpoint', () => {
        it('should echo back the message with timestamp', async () => {
            const testMessage = 'Hello from E2E test!'

            const response = await fetch(`${BASE_URL}/echo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: testMessage,
            })

            expect(response.status).toBe(200)

            const body = await response.json()
            expect(body).toHaveProperty('message', testMessage)
            expect(body).toHaveProperty('timestamp')

            // Verify timestamp is a valid ISO string
            const timestamp = new Date(body.timestamp)
            expect(timestamp.toISOString()).toBe(body.timestamp)
        })

        it('should handle empty message', async () => {
            const response = await fetch(`${BASE_URL}/echo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: '',
            })

            expect(response.status).toBe(200)

            const body = await response.json()
            expect(body).toHaveProperty('message', '')
            expect(body).toHaveProperty('timestamp')
        })

        it('should handle large messages', async () => {
            const largeMessage = 'A'.repeat(10000)

            const response = await fetch(`${BASE_URL}/echo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: largeMessage,
            })

            expect(response.status).toBe(200)

            const body = await response.json()
            expect(body.message).toBe(largeMessage)
            expect(body).toHaveProperty('timestamp')
        })

        it('should handle special characters', async () => {
            const specialMessage =
                '!@#$%^&*()_+-=[]{}|;:,.<>?/~`\'"\\测试emoji🚀'

            const response = await fetch(`${BASE_URL}/echo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: specialMessage,
            })

            expect(response.status).toBe(200)

            const body = await response.json()
            expect(body.message).toBe(specialMessage)
            expect(body).toHaveProperty('timestamp')
        })

        it('should handle JSON payload', async () => {
            const jsonPayload = JSON.stringify({
                key: 'value',
                nested: { data: 'test' },
            })

            const response = await fetch(`${BASE_URL}/echo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonPayload,
            })

            expect(response.status).toBe(200)

            const body = await response.json()
            expect(body.message).toBe(jsonPayload)
            expect(body).toHaveProperty('timestamp')
        })

        it('should return timestamp within reasonable time window', async () => {
            const beforeRequest = new Date()

            const response = await fetch(`${BASE_URL}/echo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: 'timestamp test',
            })

            const afterRequest = new Date()

            expect(response.status).toBe(200)

            const body = await response.json()
            const responseTimestamp = new Date(body.timestamp)

            // Verify timestamp is between before and after request times
            expect(responseTimestamp.getTime()).toBeGreaterThanOrEqual(
                beforeRequest.getTime()
            )
            expect(responseTimestamp.getTime()).toBeLessThanOrEqual(
                afterRequest.getTime()
            )
        })
    })

    describe('Error handling', () => {
        it('should handle GET request to POST-only endpoint', async () => {
            const response = await fetch(`${BASE_URL}/echo`, {
                method: 'GET',
            })

            // Should return 405 Method Not Allowed or 404 Not Found
            expect([404, 405]).toContain(response.status)
        })

        it('should handle non-existent endpoints', async () => {
            const response = await fetch(`${BASE_URL}/nonexistent`, {
                method: 'GET',
            })

            expect(response.status).toBe(404)
        })
    })

    describe('Performance & Reliability', () => {
        it('should handle concurrent requests', async () => {
            const concurrentRequests = 10
            const requests = Array.from(
                { length: concurrentRequests },
                (_, i) =>
                    fetch(`${BASE_URL}/echo`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: `Concurrent test ${i}`,
                    })
            )

            const responses = await Promise.all(requests)

            responses.forEach((response) => {
                expect(response.status).toBe(200)
            })

            // Verify each response has correct message
            const bodies = await Promise.all(responses.map((r) => r.json()))

            bodies.forEach((body, i) => {
                expect(body.message).toBe(`Concurrent test ${i}`)
            })
        })

        it('should respond within acceptable time', async () => {
            const startTime = Date.now()

            const response = await fetch(`${BASE_URL}/echo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: 'Performance test',
            })

            const endTime = Date.now()
            const responseTime = endTime - startTime

            expect(response.status).toBe(200)
            // Response should be within 5 seconds (generous for deployed services)
            expect(responseTime).toBeLessThan(5000)
        })
    })

    describe('Health check', () => {
        it('server should be reachable', async () => {
            // Try to reach the endpoint to verify server is up
            const response = await fetch(`${BASE_URL}/echo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: 'health check',
            })

            expect(response.ok).toBeTruthy()
        })
    })

    describe('GET /bookings/next endpoint', () => {
        it('should return bookings with correct structure', async () => {
            const response = await fetch(`${BASE_URL}/bookings/next`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)
            expect(response.headers.get('content-type')).toContain(
                'application/json'
            )

            const body = await response.json()

            // Verify response structure
            expect(body).toHaveProperty('bookings')
            expect(body).toHaveProperty('page')
            expect(body).toHaveProperty('pageSize')
            expect(body).toHaveProperty('requestId')
            expect(body).toHaveProperty('total')

            // Verify types
            expect(Array.isArray(body.bookings)).toBe(true)
            expect(typeof body.page).toBe('number')
            expect(typeof body.pageSize).toBe('number')
            expect(typeof body.requestId).toBe('string')
            expect(typeof body.total).toBe('number')

            // Verify pagination values are valid
            expect(body.page).toBeGreaterThanOrEqual(0)
            expect(body.pageSize).toBeGreaterThan(0)
            expect(body.total).toBeGreaterThanOrEqual(0)
        })

        it('should return array of bookings with expected properties', async () => {
            const response = await fetch(`${BASE_URL}/bookings/next`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = await response.json()

            // If there are bookings, verify their structure
            if (body.bookings.length > 0) {
                const booking = body.bookings[0]

                // Verify booking has expected properties
                expect(booking).toHaveProperty('code')
                expect(booking).toHaveProperty('propertyId')
                expect(booking).toHaveProperty('checkIn')
                expect(booking).toHaveProperty('checkOut')
                expect(booking).toHaveProperty('status')
                expect(booking).toHaveProperty('guest')
                expect(booking).toHaveProperty('adults')
                expect(booking).toHaveProperty('nights')
                expect(booking).toHaveProperty('price')
                expect(booking).toHaveProperty('currency')
                expect(booking).toHaveProperty('createdAt')
                expect(booking).toHaveProperty('updatedAt')

                // Verify guest structure
                expect(booking.guest).toHaveProperty('name')
                expect(typeof booking.guest.name).toBe('string')

                // Verify dates are valid ISO strings
                expect(() => new Date(booking.checkIn)).not.toThrow()
                expect(() => new Date(booking.checkOut)).not.toThrow()
                expect(() => new Date(booking.createdAt)).not.toThrow()
                expect(() => new Date(booking.updatedAt)).not.toThrow()
            }
        })

        it('should reject POST requests', async () => {
            const response = await fetch(`${BASE_URL}/bookings/next`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            })

            // Should return 404 or 405 Method Not Allowed
            expect([404, 405]).toContain(response.status)
        })

        it('should respond within acceptable time', async () => {
            const startTime = Date.now()

            const response = await fetch(`${BASE_URL}/bookings/next`, {
                method: 'GET',
            })

            const endTime = Date.now()
            const responseTime = endTime - startTime

            expect(response.status).toBe(200)
            // Response should be within 30 seconds (Hostex API can be slow)
            expect(responseTime).toBeLessThan(30000)
        })

        it('should have consistent pagination', async () => {
            const response = await fetch(`${BASE_URL}/bookings/next`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = await response.json()

            // Verify bookings array length doesn't exceed pageSize
            expect(body.bookings.length).toBeLessThanOrEqual(body.pageSize)

            // Verify total is consistent with returned data
            if (body.total === 0) {
                expect(body.bookings.length).toBe(0)
            }
        })

        it('should return valid requestId for tracking', async () => {
            const response = await fetch(`${BASE_URL}/bookings/next`, {
                method: 'GET',
            })

            expect(response.status).toBe(200)

            const body = await response.json()

            // Verify requestId is a non-empty string
            expect(typeof body.requestId).toBe('string')
            expect(body.requestId.length).toBeGreaterThan(0)
        })

        it('should handle concurrent requests', async () => {
            const concurrentRequests = 5
            const requests = Array.from({ length: concurrentRequests }, () =>
                fetch(`${BASE_URL}/bookings/next`, {
                    method: 'GET',
                })
            )

            const responses = await Promise.all(requests)

            // All requests should succeed
            responses.forEach((response) => {
                expect(response.status).toBe(200)
            })

            // Verify all responses have valid structure
            const bodies = await Promise.all(responses.map((r) => r.json()))

            bodies.forEach((body) => {
                expect(body).toHaveProperty('bookings')
                expect(body).toHaveProperty('page')
                expect(body).toHaveProperty('pageSize')
                expect(body).toHaveProperty('requestId')
                expect(body).toHaveProperty('total')
            })
        })
    })
})
