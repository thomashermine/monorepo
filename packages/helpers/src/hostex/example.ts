/**
 * Hostex API Service - Example Usage
 *
 * This file demonstrates how to use the Hostex API service with Effect.
 * These examples are for reference only and are not meant to be executed directly.
 */

import { Effect } from 'effect'

import { HostexService, makeHostexServiceLayer } from './index'

// ============================================================================
// Example 1: Basic Setup and Fetching Properties
// ============================================================================

export const example1_fetchProperties = () => {
    const hostexLayer = makeHostexServiceLayer({
        accessToken: 'your-access-token-here',
    })

    const program = Effect.gen(function* () {
        const service = yield* HostexService

        const properties = yield* service.getProperties()

        console.log(`Found ${properties.data.length} properties`)

        for (const property of properties.data) {
            console.log(`- ${property.name} (${property.city})`)
        }

        return properties
    })

    return program.pipe(Effect.provide(hostexLayer))
}

// ============================================================================
// Example 2: Query Reservations with Filters
// ============================================================================

export const example2_queryReservations = () => {
    const hostexLayer = makeHostexServiceLayer({
        accessToken: 'your-access-token-here',
    })

    const program = Effect.gen(function* () {
        const service = yield* HostexService

        const reservations = yield* service.getReservations({
            status: 'confirmed',
            checkInFrom: '2024-12-01',
            checkInTo: '2024-12-31',
            page: 1,
            pageSize: 50,
        })

        console.log(`Found ${reservations.total} reservations`)

        for (const reservation of reservations.data) {
            console.log(
                `${reservation.code}: ${reservation.guest.name} ` +
                    `(${reservation.checkIn} - ${reservation.checkOut})`
            )
        }

        return reservations
    })

    return program.pipe(Effect.provide(hostexLayer))
}

// ============================================================================
// Example 3: Create a New Reservation
// ============================================================================

export const example3_createReservation = () => {
    const hostexLayer = makeHostexServiceLayer({
        accessToken: 'your-access-token-here',
    })

    const program = Effect.gen(function* () {
        const service = yield* HostexService

        const newReservation = yield* service.createReservation({
            propertyId: 'prop-123',
            checkIn: '2024-12-15',
            checkOut: '2024-12-20',
            guest: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567890',
            },
            adults: 2,
            children: 1,
            price: 1000,
            currency: 'USD',
            channel: 'direct',
        })

        console.log(`Created reservation: ${newReservation.data.code}`)

        return newReservation
    })

    return program.pipe(Effect.provide(hostexLayer))
}

// ============================================================================
// Example 4: Update Property Availability
// ============================================================================

export const example4_updateAvailability = () => {
    const hostexLayer = makeHostexServiceLayer({
        accessToken: 'your-access-token-here',
    })

    const program = Effect.gen(function* () {
        const service = yield* HostexService

        // Block dates
        const result = yield* service.updateAvailabilities({
            propertyId: 'prop-123',
            startDate: '2024-12-15',
            endDate: '2024-12-20',
            available: false,
        })

        console.log(`Updated ${result.data.updated} days`)

        return result
    })

    return program.pipe(Effect.provide(hostexLayer))
}

// ============================================================================
// Example 5: Manage Listing Calendar (Prices & Restrictions)
// ============================================================================

export const example5_updateListingCalendar = () => {
    const hostexLayer = makeHostexServiceLayer({
        accessToken: 'your-access-token-here',
    })

    const program = Effect.gen(function* () {
        const service = yield* HostexService

        // Update prices for weekend
        yield* service.updateListingPrices([
            { listingId: 'listing-1', date: '2024-12-20', price: 250 },
            { listingId: 'listing-1', date: '2024-12-21', price: 300 },
            { listingId: 'listing-1', date: '2024-12-22', price: 300 },
        ])

        console.log('Updated weekend prices')

        // Set minimum stay for holidays
        yield* service.updateListingRestrictions([
            {
                listingId: 'listing-1',
                date: '2024-12-25',
                minStay: 3,
                closedToArrival: true,
            },
        ])

        console.log('Updated holiday restrictions')

        return { success: true }
    })

    return program.pipe(Effect.provide(hostexLayer))
}

// ============================================================================
// Example 6: Send Messages to Guests
// ============================================================================

export const example6_sendMessages = () => {
    const hostexLayer = makeHostexServiceLayer({
        accessToken: 'your-access-token-here',
    })

    const program = Effect.gen(function* () {
        const service = yield* HostexService

        // Get unread conversations
        const conversations = yield* service.getConversations(1, 20)

        const unreadConversations = conversations.data.filter(
            (conv) => conv.unreadCount > 0
        )

        console.log(`Found ${unreadConversations.length} unread conversations`)

        // Send a reply to the first unread conversation
        if (unreadConversations.length > 0) {
            const conversation = unreadConversations[0]!

            const message = yield* service.sendMessage({
                conversationId: conversation.id,
                content: 'Thank you for your message! We will respond shortly.',
                messageType: 'text',
            })

            console.log(`Sent message: ${message.data.message.id}`)
        }

        return { processed: unreadConversations.length }
    })

    return program.pipe(Effect.provide(hostexLayer))
}

// ============================================================================
// Example 7: Manage Webhooks
// ============================================================================

export const example7_manageWebhooks = () => {
    const hostexLayer = makeHostexServiceLayer({
        accessToken: 'your-access-token-here',
    })

    const program = Effect.gen(function* () {
        const service = yield* HostexService

        // List existing webhooks
        const existingWebhooks = yield* service.getWebhooks()
        console.log(`Found ${existingWebhooks.data.length} webhooks`)

        // Create a new webhook
        const newWebhook = yield* service.createWebhook({
            url: 'https://your-domain.com/webhooks/hostex',
            events: [
                'reservation.created',
                'reservation.updated',
                'message.received',
            ],
        })

        console.log(`Created webhook: ${newWebhook.data.webhook.id}`)

        return newWebhook
    })

    return program.pipe(Effect.provide(hostexLayer))
}

// ============================================================================
// Example 8: Error Handling
// ============================================================================

export const example8_errorHandling = () => {
    const hostexLayer = makeHostexServiceLayer({
        accessToken: 'your-access-token-here',
    })

    const program = Effect.gen(function* () {
        const service = yield* HostexService

        return yield* service.getProperties()
    }).pipe(
        Effect.catchTag('HostexError', (error) => {
            console.error('API Error:', error.message)
            console.error('Error Code:', error.errorCode)
            console.error('Request ID:', error.requestId)

            return Effect.succeed({ error: 'api_error', data: [] })
        }),
        Effect.catchTag('HostexNetworkError', (error) => {
            console.error('Network Error:', error.message)

            return Effect.succeed({ error: 'network_error', data: [] })
        })
    )

    return program.pipe(Effect.provide(hostexLayer))
}

// ============================================================================
// Example 9: Complex Workflow - Property Management
// ============================================================================

export const example9_propertyManagement = () => {
    const hostexLayer = makeHostexServiceLayer({
        accessToken: 'your-access-token-here',
    })

    const program = Effect.gen(function* () {
        const service = yield* HostexService

        // 1. Get all properties
        const properties = yield* service.getProperties()
        console.log(`Managing ${properties.data.length} properties`)

        // 2. For each property, get upcoming reservations
        const propertyReservations = []

        for (const property of properties.data) {
            const reservations = yield* service.getReservations({
                propertyId: property.id,
                status: 'confirmed',
                checkInFrom: new Date().toISOString().split('T')[0] as string,
            })

            propertyReservations.push({
                property,
                reservations: reservations.data,
            })
        }

        // 3. Update lock codes for upcoming check-ins
        const today = new Date().toISOString().split('T')[0]

        for (const { property, reservations } of propertyReservations) {
            for (const reservation of reservations) {
                if (reservation.checkIn === today && !reservation.lockCode) {
                    const lockCode = Math.floor(
                        1000 + Math.random() * 9000
                    ).toString()

                    yield* service.updateLockCode({
                        code: reservation.code,
                        lockCode,
                    })

                    console.log(
                        `Updated lock code for ${property.name}: ${reservation.code}`
                    )
                }
            }
        }

        // 4. Get unread messages and respond
        const conversations = yield* service.getConversations()
        const unreadCount = conversations.data.filter(
            (c) => c.unreadCount > 0
        ).length

        console.log(`${unreadCount} conversations need attention`)

        return {
            properties: properties.data.length,
            totalReservations: propertyReservations.reduce(
                (sum, pr) => sum + pr.reservations.length,
                0
            ),
            unreadMessages: unreadCount,
        }
    })

    return program.pipe(Effect.provide(hostexLayer))
}

// ============================================================================
// Example 10: Batch Operations with Effect.all
// ============================================================================

export const example10_batchOperations = () => {
    const hostexLayer = makeHostexServiceLayer({
        accessToken: 'your-access-token-here',
    })

    const program = Effect.gen(function* () {
        const service = yield* HostexService

        // Fetch multiple resources concurrently
        const [properties, roomTypes, reviews] = yield* Effect.all(
            [
                service.getProperties(),
                service.getRoomTypes(),
                service.getReviews({ hasReply: false }),
            ],
            { concurrency: 'unbounded' }
        )

        console.log('Fetched all data concurrently:')
        console.log(`- ${properties.data.length} properties`)
        console.log(`- ${roomTypes.data.length} room types`)
        console.log(`- ${reviews.data.length} reviews`)

        return {
            properties: properties.data,
            roomTypes: roomTypes.data,
            reviews: reviews.data,
        }
    })

    return program.pipe(Effect.provide(hostexLayer))
}

// ============================================================================
// Running Examples
// ============================================================================

// Uncomment to run any example:

// Effect.runPromise(example1_fetchProperties())
// Effect.runPromise(example2_queryReservations())
// Effect.runPromise(example3_createReservation())
// Effect.runPromise(example4_updateAvailability())
// Effect.runPromise(example5_updateListingCalendar())
// Effect.runPromise(example6_sendMessages())
// Effect.runPromise(example7_manageWebhooks())
// Effect.runPromise(example8_errorHandling())
// Effect.runPromise(example9_propertyManagement())
// Effect.runPromise(example10_batchOperations())
