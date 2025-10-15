import { describe, expect, it } from 'vitest'

import {
    mockAvailabilitiesResponse,
    mockCompleteDataset,
    mockConversation,
    mockConversationDetailsResponse,
    mockConversationsResponse,
    mockCreateReservationResponse,
    mockCreateReviewResponse,
    mockCreateWebhookResponse,
    mockListingCalendarDay,
    mockListingCalendarResponse,
    mockListingUpdateResponse,
    mockMessage,
    mockPropertiesResponse,
    mockProperty,
    mockPropertyAvailability,
    mockRelatedDataset,
    mockReservation,
    mockReservationsResponse,
    mockReview,
    mockReviewsResponse,
    mockRoomType,
    mockRoomTypesResponse,
    mockSendMessageResponse,
    mockUpdateAvailabilitiesResponse,
    mockUpdateLockCodeResponse,
    mockWebhook,
    mockWebhooksResponse,
} from './mocks'

describe('Hostex Mocks', () => {
    describe('Properties', () => {
        it('should generate a valid Property', () => {
            const property = mockProperty()

            expect(property).toBeDefined()
            expect(property.id).toBeTypeOf('string')
            expect(property.name).toBeTypeOf('string')
            expect(property.bedrooms).toBeTypeOf('number')
            expect(property.bathrooms).toBeTypeOf('number')
        })

        it('should apply overrides to Property', () => {
            const property = mockProperty({
                id: 'custom-id',
                name: 'Custom Property',
                bedrooms: 10,
            })

            expect(property.id).toBe('custom-id')
            expect(property.name).toBe('Custom Property')
            expect(property.bedrooms).toBe(10)
        })

        it('should generate a valid PropertiesResponse', () => {
            const response = mockPropertiesResponse(5)

            expect(response).toBeDefined()
            expect(response.data).toHaveLength(5)
            expect(response.requestId).toBeTypeOf('string')
            expect(response.requestId).toMatch(/^req-/)
        })

        it('should generate PropertiesResponse with custom count', () => {
            const response = mockPropertiesResponse(3)

            expect(response.data).toHaveLength(3)
        })
    })

    describe('Room Types', () => {
        it('should generate a valid RoomType', () => {
            const roomType = mockRoomType()

            expect(roomType).toBeDefined()
            expect(roomType.id).toBeTypeOf('string')
            expect(roomType.name).toBeTypeOf('string')
            expect(roomType.propertyId).toBeTypeOf('string')
            expect(roomType.maxGuests).toBeTypeOf('number')
        })

        it('should apply overrides to RoomType', () => {
            const roomType = mockRoomType({
                id: 'room-1',
                propertyId: 'prop-1',
                name: 'Presidential Suite',
            })

            expect(roomType.id).toBe('room-1')
            expect(roomType.propertyId).toBe('prop-1')
            expect(roomType.name).toBe('Presidential Suite')
        })

        it('should generate a valid RoomTypesResponse', () => {
            const response = mockRoomTypesResponse(3)

            expect(response.data).toHaveLength(3)
            expect(response.requestId).toBeTypeOf('string')
        })
    })

    describe('Reservations', () => {
        it('should generate a valid Reservation', () => {
            const reservation = mockReservation()

            expect(reservation).toBeDefined()
            expect(reservation.reservation_code).toBeTypeOf('string')
            expect(reservation.property_id).toBeTypeOf('number')
            expect(reservation.check_in_date).toBeTypeOf('string')
            expect(reservation.check_out_date).toBeTypeOf('string')
            expect(reservation.guest_name).toBeTypeOf('string')
            expect(reservation.number_of_adults).toBeTypeOf('number')
            expect(reservation.number_of_guests).toBeTypeOf('number')
            expect(['accepted', 'pending', 'cancelled', 'completed']).toContain(
                reservation.status
            )
            expect(reservation.rates).toBeDefined()
            expect(reservation.check_in_details).toBeDefined()
            expect(reservation.custom_channel).toBeDefined()
            expect(Array.isArray(reservation.guests)).toBe(true)
        })

        it('should generate checkOut date after checkIn', () => {
            const reservation = mockReservation()
            const checkIn = new Date(reservation.check_in_date)
            const checkOut = new Date(reservation.check_out_date)

            expect(checkOut.getTime()).toBeGreaterThan(checkIn.getTime())
        })

        it('should apply overrides to Reservation', () => {
            const reservation = mockReservation({
                reservation_code: 'TEST-123',
                status: 'accepted',
                number_of_adults: 4,
            })

            expect(reservation.reservation_code).toBe('TEST-123')
            expect(reservation.status).toBe('accepted')
            expect(reservation.number_of_adults).toBe(4)
        })

        it('should generate a valid ReservationsResponse', () => {
            const response = mockReservationsResponse(10)

            expect(response.data.reservations).toHaveLength(10)
        })

        it('should generate a valid CreateReservationResponse', () => {
            const response = mockCreateReservationResponse()

            expect(response.reservation).toBeDefined()
            expect(response.reservation.reservation_code).toBeTypeOf('string')
        })

        it('should generate a valid UpdateLockCodeResponse', () => {
            const response = mockUpdateLockCodeResponse()

            expect(response.success).toBe(true)
        })

        it('should generate rates with correct structure', () => {
            const reservation = mockReservation()

            expect(reservation.rates.total_rate).toBeDefined()
            expect(reservation.rates.total_rate.currency).toBeTypeOf('string')
            expect(reservation.rates.total_rate.amount).toBeTypeOf('number')
            expect(reservation.rates.rate).toBeDefined()
            expect(Array.isArray(reservation.rates.details)).toBe(true)
            expect(reservation.rates.details.length).toBeGreaterThan(0)
        })

        it('should generate guests array with at least one guest', () => {
            const reservation = mockReservation()

            expect(reservation.guests.length).toBeGreaterThanOrEqual(1)
            const guest = reservation.guests[0]
            expect(guest).toBeDefined()
            expect(guest!.id).toBeTypeOf('number')
            expect(guest!.name).toBe(reservation.guest_name)
            expect(guest!.is_booker).toBe(true)
        })
    })

    describe('Availability', () => {
        it('should generate a valid PropertyAvailability', () => {
            const availability = mockPropertyAvailability()

            expect(availability).toBeDefined()
            expect(availability.date).toBeTypeOf('string')
            expect(availability.available).toBeTypeOf('boolean')
            expect(availability.propertyId).toBeTypeOf('string')
        })

        it('should apply overrides to PropertyAvailability', () => {
            const availability = mockPropertyAvailability({
                date: '2024-12-25',
                available: false,
            })

            expect(availability.date).toBe('2024-12-25')
            expect(availability.available).toBe(false)
        })

        it('should generate a valid AvailabilitiesResponse', () => {
            const response = mockAvailabilitiesResponse(30)

            expect(response.data).toHaveLength(30)
            expect(response.requestId).toBeTypeOf('string')
        })

        it('should generate a valid UpdateAvailabilitiesResponse', () => {
            const response = mockUpdateAvailabilitiesResponse(15)

            expect(response.data.success).toBe(true)
            expect(response.data.updated).toBe(15)
            expect(response.requestId).toBeTypeOf('string')
        })
    })

    describe('Listing Calendar', () => {
        it('should generate a valid ListingCalendarDay', () => {
            const day = mockListingCalendarDay()

            expect(day).toBeDefined()
            expect(day.date).toBeTypeOf('string')
            expect(day.available).toBeTypeOf('boolean')
            expect(day.price).toBeTypeOf('number')
            expect(day.minStay).toBeTypeOf('number')
            expect(day.maxStay).toBeTypeOf('number')
        })

        it('should apply overrides to ListingCalendarDay', () => {
            const day = mockListingCalendarDay({
                date: '2024-12-01',
                price: 500,
                minStay: 3,
            })

            expect(day.date).toBe('2024-12-01')
            expect(day.price).toBe(500)
            expect(day.minStay).toBe(3)
        })

        it('should generate a valid ListingCalendarResponse', () => {
            const listingIds = ['listing-1', 'listing-2']
            const response = mockListingCalendarResponse(listingIds, 10)

            expect(Object.keys(response.data)).toHaveLength(2)
            expect(response.data['listing-1']).toHaveLength(10)
            expect(response.data['listing-2']).toHaveLength(10)
            expect(response.requestId).toBeTypeOf('string')
        })

        it('should generate a valid ListingUpdateResponse', () => {
            const response = mockListingUpdateResponse(7)

            expect(response.data.success).toBe(true)
            expect(response.data.updated).toBe(7)
            expect(response.requestId).toBeTypeOf('string')
        })
    })

    describe('Messages', () => {
        it('should generate a valid Conversation', () => {
            const conversation = mockConversation()

            expect(conversation).toBeDefined()
            expect(conversation.id).toBeTypeOf('string')
            expect(conversation.guestName).toBeTypeOf('string')
            expect(conversation.propertyId).toBeTypeOf('string')
            expect(conversation.lastMessageAt).toBeTypeOf('string')
            expect(conversation.unreadCount).toBeTypeOf('number')
        })

        it('should apply overrides to Conversation', () => {
            const conversation = mockConversation({
                id: 'conv-1',
                guestName: 'John Doe',
                unreadCount: 5,
            })

            expect(conversation.id).toBe('conv-1')
            expect(conversation.guestName).toBe('John Doe')
            expect(conversation.unreadCount).toBe(5)
        })

        it('should generate a valid ConversationsResponse', () => {
            const response = mockConversationsResponse(15, 2, 10)

            expect(response.data).toHaveLength(15)
            expect(response.total).toBe(15)
            expect(response.page).toBe(2)
            expect(response.pageSize).toBe(10)
        })

        it('should generate a valid Message', () => {
            const message = mockMessage()

            expect(message).toBeDefined()
            expect(message.id).toBeTypeOf('string')
            expect(message.conversationId).toBeTypeOf('string')
            expect(message.content).toBeTypeOf('string')
            expect(['host', 'guest']).toContain(message.sentBy)
            expect(['text', 'image']).toContain(message.messageType)
        })

        it('should apply overrides to Message', () => {
            const message = mockMessage({
                id: 'msg-1',
                content: 'Hello!',
                sentBy: 'host',
            })

            expect(message.id).toBe('msg-1')
            expect(message.content).toBe('Hello!')
            expect(message.sentBy).toBe('host')
        })

        it('should generate a valid ConversationDetailsResponse', () => {
            const response = mockConversationDetailsResponse(10)

            expect(response.data.conversation).toBeDefined()
            expect(response.data.messages).toHaveLength(10)
            expect(response.requestId).toBeTypeOf('string')

            // All messages should have the same conversationId
            const conversationId = response.data.conversation.id
            response.data.messages.forEach((msg) => {
                expect(msg.conversationId).toBe(conversationId)
            })
        })

        it('should generate a valid SendMessageResponse', () => {
            const response = mockSendMessageResponse()

            expect(response.data.message).toBeDefined()
            expect(response.data.message.id).toBeTypeOf('string')
            expect(response.requestId).toBeTypeOf('string')
        })
    })

    describe('Reviews', () => {
        it('should generate a valid Review', () => {
            const review = mockReview()

            expect(review).toBeDefined()
            expect(review.id).toBeTypeOf('string')
            expect(review.reservationCode).toMatch(/^RES-/)
            expect(review.rating).toBeGreaterThanOrEqual(1)
            expect(review.rating).toBeLessThanOrEqual(5)
            expect(review.reviewerName).toBeTypeOf('string')
        })

        it('should apply overrides to Review', () => {
            const review = mockReview({
                id: 'review-1',
                rating: 5,
                reviewerName: 'Jane Smith',
            })

            expect(review.id).toBe('review-1')
            expect(review.rating).toBe(5)
            expect(review.reviewerName).toBe('Jane Smith')
        })

        it('should generate a valid ReviewsResponse', () => {
            const response = mockReviewsResponse(25, 3, 10)

            expect(response.data).toHaveLength(25)
            expect(response.total).toBe(25)
            expect(response.page).toBe(3)
            expect(response.pageSize).toBe(10)
        })

        it('should generate a valid CreateReviewResponse', () => {
            const response = mockCreateReviewResponse()

            expect(response.data.success).toBe(true)
            expect(response.requestId).toBeTypeOf('string')
        })

        it('should sometimes generate reviews with replies', () => {
            // Generate multiple reviews to test randomness
            const reviews = Array.from({ length: 10 }, () => mockReview())

            // At least some should have replies (this is probabilistic)
            const withReplies = reviews.filter((r) => r.reply !== undefined)
            expect(withReplies.length).toBeGreaterThan(0)
        })
    })

    describe('Webhooks', () => {
        it('should generate a valid Webhook', () => {
            const webhook = mockWebhook()

            expect(webhook).toBeDefined()
            expect(webhook.id).toBeTypeOf('string')
            expect(webhook.url).toBeTypeOf('string')
            expect(Array.isArray(webhook.events)).toBe(true)
            expect(webhook.events.length).toBeGreaterThan(0)
            expect(webhook.active).toBeTypeOf('boolean')
        })

        it('should generate valid webhook events', () => {
            const webhook = mockWebhook()
            const validEvents = [
                'reservation.created',
                'reservation.updated',
                'reservation.cancelled',
                'message.received',
                'review.created',
            ]

            webhook.events.forEach((event) => {
                expect(validEvents).toContain(event)
            })
        })

        it('should apply overrides to Webhook', () => {
            const webhook = mockWebhook({
                id: 'webhook-1',
                events: ['reservation.created'],
                active: true,
            })

            expect(webhook.id).toBe('webhook-1')
            expect(webhook.events).toEqual(['reservation.created'])
            expect(webhook.active).toBe(true)
        })

        it('should generate a valid WebhooksResponse', () => {
            const response = mockWebhooksResponse(5)

            expect(response.data).toHaveLength(5)
            expect(response.requestId).toBeTypeOf('string')
        })

        it('should generate a valid CreateWebhookResponse', () => {
            const response = mockCreateWebhookResponse()

            expect(response.data.webhook).toBeDefined()
            expect(response.data.webhook.id).toBeTypeOf('string')
            expect(response.requestId).toBeTypeOf('string')
        })
    })

    describe('Batch Generators', () => {
        it('should generate a complete dataset', () => {
            const dataset = mockCompleteDataset()

            expect(dataset.properties).toBeDefined()
            expect(dataset.properties.data).toHaveLength(5)
            expect(dataset.roomTypes.data).toHaveLength(8)
            expect(dataset.reservations.data.reservations).toHaveLength(20)
            expect(dataset.availabilities.data).toHaveLength(30)
            expect(dataset.conversations.data).toHaveLength(15)
            expect(dataset.reviews.data).toHaveLength(25)
            expect(dataset.webhooks.data).toHaveLength(3)
        })

        it('should generate related dataset with consistent IDs', () => {
            const dataset = mockRelatedDataset()

            expect(dataset.property).toBeDefined()
            expect(dataset.reservations).toHaveLength(5)
            expect(dataset.conversations).toHaveLength(5)

            // All reservations should have the same property_id
            dataset.reservations.forEach((reservation) => {
                expect(reservation.property_id).toBe(
                    parseInt(dataset.property.id)
                )
            })

            // All conversations should match their reservation codes
            dataset.conversations.forEach((conversation, index) => {
                const reservation = dataset.reservations[index]
                expect(conversation.reservationCode).toBe(
                    reservation?.reservation_code
                )
                expect(conversation.propertyId).toBe(dataset.property.id)
                expect(conversation.guestName).toBe(reservation?.guest_name)
            })
        })
    })

    describe('Data Types and Formats', () => {
        it('should generate valid date formats', () => {
            const reservation = mockReservation()

            // Dates should be in YYYY-MM-DD format
            expect(reservation.check_in_date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
            expect(reservation.check_out_date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        })

        it('should generate valid ISO datetime strings', () => {
            const conversation = mockConversation()

            // ISO datetime format
            expect(conversation.lastMessageAt).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            )
        })

        it('should generate valid request IDs', () => {
            const response = mockPropertiesResponse()

            expect(response.requestId).toMatch(/^req-[a-zA-Z0-9]{12}$/)
        })

        it('should generate valid reservation codes', () => {
            const reservation = mockReservation()

            expect(reservation.reservation_code).toBeTypeOf('string')
            expect(reservation.stay_code).toBeTypeOf('string')
        })

        it('should generate valid currency codes', () => {
            const reservation = mockReservation()

            expect(reservation.rates.total_rate.currency).toBeTypeOf('string')
            expect(reservation.rates.total_rate.currency.length).toBe(3)
        })

        it('should generate realistic numeric values', () => {
            const property = mockProperty()

            expect(property.bedrooms).toBeGreaterThanOrEqual(1)
            expect(property.bedrooms).toBeLessThanOrEqual(6)
            expect(property.bathrooms).toBeGreaterThanOrEqual(1)
            expect(property.bathrooms).toBeLessThanOrEqual(4)
            expect(property.maxGuests).toBeGreaterThanOrEqual(2)
            expect(property.maxGuests).toBeLessThanOrEqual(12)
        })

        it('should generate valid email addresses', () => {
            const reservation = mockReservation()

            if (reservation.guest_email) {
                expect(reservation.guest_email).toMatch(/@/)
            }
        })

        it('should generate valid channel types', () => {
            const reservation = mockReservation()

            expect([
                'airbnb',
                'booking.com',
                'booking_site',
                'hostex_direct',
                'vrbo',
            ]).toContain(reservation.channel_type)
        })

        it('should generate check_in_details with correct structure', () => {
            const reservation = mockReservation()

            expect(reservation.check_in_details).toBeDefined()
            expect(reservation.check_in_details.lock_code_visible_after).toBe(
                '12:00'
            )
        })
    })

    describe('Consistency', () => {
        it('should generate different data on each call', () => {
            const property1 = mockProperty()
            const property2 = mockProperty()

            // IDs should be different
            expect(property1.id).not.toBe(property2.id)
        })

        it('should respect overrides consistently', () => {
            const overrides = {
                id: 'consistent-id',
                name: 'Consistent Property',
            }

            const property1 = mockProperty(overrides)
            const property2 = mockProperty(overrides)

            expect(property1.id).toBe('consistent-id')
            expect(property2.id).toBe('consistent-id')
            expect(property1.name).toBe('Consistent Property')
            expect(property2.name).toBe('Consistent Property')
        })
    })
})
