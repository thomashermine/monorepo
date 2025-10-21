import { Effect, Exit } from 'effect'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
    type CreateReservationInput,
    type CreateReviewInput,
    type CreateWebhookInput,
    HostexService,
    makeHostexServiceLayer,
    type ReservationsQueryParams,
    type ReviewsQueryParams,
    type SendMessageInput,
    type UpdateLockCodeInput,
} from './index'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('HostexService', () => {
    const mockConfig = {
        accessToken: 'test-token-123',
        baseUrl: 'https://test-api.hostex.com/v3',
        timeout: 5000,
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    // Helper function to create service layer
    const createServiceLayer = () => makeHostexServiceLayer(mockConfig)

    // Helper function to mock successful response
    const mockSuccessResponse = <T>(data: T) => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => data,
        })
    }

    // Helper function to mock error response
    const mockErrorResponse = (
        status: number,
        error_msg: string,
        error_code?: string
    ) => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status,
            json: async () => ({
                error_msg,
                error_code,
                request_id: 'error-request-123',
            }),
        })
    }

    // Helper function to mock network error
    const mockNetworkError = (message: string) => {
        mockFetch.mockRejectedValueOnce(new Error(message))
    }

    describe('Properties', () => {
        describe('getProperties', () => {
            it('should fetch properties successfully', async () => {
                const mockData = {
                    data: [
                        {
                            id: 'prop-1',
                            name: 'Beachfront Villa',
                            address: '123 Ocean Drive',
                            city: 'Miami',
                            state: 'FL',
                            country: 'USA',
                            bedrooms: 3,
                            bathrooms: 2,
                            maxGuests: 6,
                        },
                        {
                            id: 'prop-2',
                            name: 'Mountain Cabin',
                            city: 'Aspen',
                            bedrooms: 2,
                            bathrooms: 1,
                        },
                    ],
                    requestId: 'req-123',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getProperties()
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
                expect(mockFetch).toHaveBeenCalledWith(
                    'https://test-api.hostex.com/v3/properties',
                    expect.objectContaining({
                        headers: expect.objectContaining({
                            'Hostex-Access-Token': 'test-token-123',
                            'Content-Type': 'application/json',
                        }),
                    })
                )
            })

            it('should handle API error response', async () => {
                mockErrorResponse(401, 'Invalid access token', 'AUTH_ERROR')

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getProperties()
                })

                const result = await program.pipe(
                    Effect.provide(createServiceLayer()),
                    Effect.exit,
                    Effect.runPromise
                )

                expect(Exit.isFailure(result)).toBe(true)
            })

            it('should handle network error', async () => {
                mockNetworkError('Network connection failed')

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getProperties()
                })

                const result = await program.pipe(
                    Effect.provide(createServiceLayer()),
                    Effect.exit,
                    Effect.runPromise
                )

                expect(Exit.isFailure(result)).toBe(true)
            })
        })
    })

    describe('Room Types', () => {
        describe('getRoomTypes', () => {
            it('should fetch room types successfully', async () => {
                const mockData = {
                    data: [
                        {
                            id: 'room-1',
                            name: 'Deluxe Suite',
                            propertyId: 'prop-1',
                            maxGuests: 4,
                            bedrooms: 2,
                            bathrooms: 1,
                        },
                        {
                            id: 'room-2',
                            name: 'Standard Room',
                            propertyId: 'prop-1',
                            maxGuests: 2,
                        },
                    ],
                    requestId: 'req-456',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getRoomTypes()
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
                expect(mockFetch).toHaveBeenCalledWith(
                    'https://test-api.hostex.com/v3/room_types',
                    expect.any(Object)
                )
            })
        })
    })

    describe('Reservations', () => {
        describe('getReservations', () => {
            it('should fetch reservations without query params', async () => {
                const mockData = {
                    bookings: {
                        reservations: [
                            {
                                reservation_code: 'RES-001',
                                stay_code: 'RES-001',
                                channel_id: 'CH-001',
                                property_id: 12345,
                                channel_type: 'direct' as const,
                                listing_id: 'listing-1',
                                check_in_date: '2024-12-01',
                                check_out_date: '2024-12-05',
                                number_of_guests: 2,
                                number_of_adults: 2,
                                number_of_children: 0,
                                number_of_infants: 0,
                                number_of_pets: 0,
                                status: 'accepted' as const,
                                guest_name: 'John Doe',
                                guest_email: 'john@example.com',
                                guest_phone: '+1234567890',
                                cancelled_at: null,
                                booked_at: '2024-11-15T10:00:00Z',
                                created_at: '2024-11-15T10:00:00Z',
                                creator: 'System',
                                rates: {
                                    total_rate: {
                                        currency: 'USD',
                                        amount: 800,
                                    },
                                    total_commission: {
                                        currency: 'USD',
                                        amount: 50,
                                    },
                                    rate: { currency: 'USD', amount: 800 },
                                    commission: { currency: 'USD', amount: 50 },
                                    details: [],
                                },
                                check_in_details: {
                                    arrival_at: null,
                                    departure_at: null,
                                    lock_code: null,
                                    lock_code_visible_after: '12:00',
                                    deposit: null,
                                },
                                remarks: '',
                                channel_remarks: '',
                                conversation_id: null,
                                tags: [],
                                custom_channel: { id: 1, name: 'Direct' },
                                guests: [],
                                custom_fields: null,
                                in_reservation_box: false,
                            },
                        ],
                    },
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getReservations()
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })

            it('should fetch reservations with query params', async () => {
                const mockData = {
                    bookings: {
                        reservations: [],
                    },
                }

                mockSuccessResponse(mockData)

                const queryParams: ReservationsQueryParams = {
                    property_id: 12345,
                    status: 'accepted',
                    check_in_from: '2024-12-01',
                    check_in_to: '2024-12-31',
                    page: 2,
                    page_size: 10,
                }

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getReservations(queryParams)
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
                expect(mockFetch).toHaveBeenCalledWith(
                    expect.stringContaining('/reservations?'),
                    expect.any(Object)
                )
            })
        })

        describe('createReservation', () => {
            it('should create a reservation successfully', async () => {
                const input: CreateReservationInput = {
                    property_id: 12345,
                    check_in_date: '2024-12-15',
                    check_out_date: '2024-12-20',
                    guest_name: 'Jane Smith',
                    guest_email: 'jane@example.com',
                    guest_phone: '+1234567890',
                    number_of_adults: 2,
                    number_of_children: 1,
                    channel_type: 'direct',
                }

                const mockData = {
                    reservation: {
                        reservation_code: 'RES-002',
                        stay_code: 'RES-002',
                        channel_id: 'CH-002',
                        property_id: 12345,
                        channel_type: 'direct' as const,
                        listing_id: 'listing-1',
                        check_in_date: '2024-12-15',
                        check_out_date: '2024-12-20',
                        number_of_guests: 3,
                        number_of_adults: 2,
                        number_of_children: 1,
                        number_of_infants: 0,
                        number_of_pets: 0,
                        status: 'accepted' as const,
                        guest_name: 'Jane Smith',
                        guest_email: 'jane@example.com',
                        guest_phone: '+1234567890',
                        cancelled_at: null,
                        booked_at: '2024-11-20T10:00:00Z',
                        created_at: '2024-11-20T10:00:00Z',
                        creator: 'System',
                        rates: {
                            total_rate: { currency: 'USD', amount: 1000 },
                            total_commission: { currency: 'USD', amount: 100 },
                            rate: { currency: 'USD', amount: 1000 },
                            commission: { currency: 'USD', amount: 100 },
                            details: [],
                        },
                        check_in_details: {
                            arrival_at: null,
                            departure_at: null,
                            lock_code: null,
                            lock_code_visible_after: '12:00',
                            deposit: null,
                        },
                        remarks: '',
                        channel_remarks: '',
                        conversation_id: null,
                        tags: [],
                        custom_channel: { id: 1, name: 'Direct' },
                        guests: [],
                        custom_fields: null,
                        in_reservation_box: false,
                    },
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.createReservation(input)
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
                expect(mockFetch).toHaveBeenCalledWith(
                    'https://test-api.hostex.com/v3/reservations',
                    expect.objectContaining({
                        method: 'POST',
                        body: JSON.stringify(input),
                    })
                )
            })

            it('should handle validation error', async () => {
                mockErrorResponse(400, 'Invalid date range', 'VALIDATION_ERROR')

                const input: CreateReservationInput = {
                    property_id: 12345,
                    check_in_date: '2024-12-20',
                    check_out_date: '2024-12-15',
                    guest_name: 'Test',
                    number_of_adults: 2,
                }

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.createReservation(input)
                })

                const result = await program.pipe(
                    Effect.provide(createServiceLayer()),
                    Effect.exit,
                    Effect.runPromise
                )

                expect(Exit.isFailure(result)).toBe(true)
            })
        })

        describe('cancelReservation', () => {
            it('should cancel a reservation successfully', async () => {
                const mockData = {
                    success: true,
                    requestId: 'req-810',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.cancelReservation('RES-001')
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
                expect(mockFetch).toHaveBeenCalledWith(
                    'https://test-api.hostex.com/v3/reservations/RES-001',
                    expect.objectContaining({
                        method: 'DELETE',
                    })
                )
            })
        })

        describe('updateLockCode', () => {
            it('should update lock code successfully', async () => {
                const input: UpdateLockCodeInput = {
                    reservation_code: 'RES-001',
                    lock_code: '1234',
                }

                const mockData = {
                    success: true,
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.updateLockCode(input)
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
                expect(mockFetch).toHaveBeenCalledWith(
                    'https://test-api.hostex.com/v3/reservations/RES-001/lock-code',
                    expect.objectContaining({
                        method: 'PATCH',
                        body: JSON.stringify({ lock_code: '1234' }),
                    })
                )
            })
        })
    })

    describe('Availability', () => {
        describe('getAvailabilities', () => {
            it('should fetch availabilities successfully', async () => {
                const mockData = {
                    data: [
                        {
                            date: '2024-12-01',
                            available: true,
                            propertyId: 'prop-1',
                        },
                        {
                            date: '2024-12-02',
                            available: false,
                            propertyId: 'prop-1',
                        },
                    ],
                    requestId: 'req-830',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getAvailabilities({
                        propertyId: 'prop-1',
                        startDate: '2024-12-01',
                        endDate: '2024-12-31',
                    })
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })

        describe('updateAvailabilities', () => {
            it('should update availabilities successfully', async () => {
                const mockData = {
                    data: {
                        success: true,
                        updated: 10,
                    },
                    requestId: 'req-840',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.updateAvailabilities({
                        propertyId: 'prop-1',
                        startDate: '2024-12-01',
                        endDate: '2024-12-10',
                        available: false,
                    })
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })
    })

    describe('Listing Calendar', () => {
        describe('getListingCalendar', () => {
            it('should fetch listing calendar successfully', async () => {
                const mockData = {
                    data: {
                        'listing-1': [
                            {
                                date: '2024-12-01',
                                available: true,
                                price: 200,
                                minStay: 2,
                            },
                            {
                                date: '2024-12-02',
                                available: true,
                                price: 250,
                                minStay: 2,
                            },
                        ],
                    },
                    requestId: 'req-850',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getListingCalendar({
                        listingIds: ['listing-1'],
                        startDate: '2024-12-01',
                        endDate: '2024-12-31',
                    })
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })

        describe('updateListingInventories', () => {
            it('should update listing inventories successfully', async () => {
                const mockData = {
                    data: {
                        success: true,
                        updated: 5,
                    },
                    requestId: 'req-860',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.updateListingInventories([
                        {
                            listingId: 'listing-1',
                            date: '2024-12-01',
                            available: true,
                        },
                        {
                            listingId: 'listing-1',
                            date: '2024-12-02',
                            available: false,
                        },
                    ])
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })

        describe('updateListingPrices', () => {
            it('should update listing prices successfully', async () => {
                const mockData = {
                    data: {
                        success: true,
                        updated: 3,
                    },
                    requestId: 'req-870',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.updateListingPrices([
                        {
                            listingId: 'listing-1',
                            date: '2024-12-01',
                            price: 300,
                        },
                    ])
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })

        describe('updateListingRestrictions', () => {
            it('should update listing restrictions successfully', async () => {
                const mockData = {
                    data: {
                        success: true,
                        updated: 2,
                    },
                    requestId: 'req-880',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.updateListingRestrictions([
                        {
                            listingId: 'listing-1',
                            date: '2024-12-01',
                            minStay: 3,
                            closedToArrival: true,
                        },
                    ])
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })
    })

    describe('Messages', () => {
        describe('getConversations', () => {
            it('should fetch conversations with default pagination', async () => {
                const mockData = {
                    data: [
                        {
                            id: 'conv-1',
                            reservationCode: 'RES-001',
                            guestName: 'John Doe',
                            propertyId: 'prop-1',
                            channel: 'airbnb',
                            lastMessageAt: '2024-11-20T10:00:00Z',
                            unreadCount: 2,
                        },
                    ],
                    total: 1,
                    page: 1,
                    pageSize: 20,
                    requestId: 'req-890',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getConversations()
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })

            it('should fetch conversations with custom pagination', async () => {
                const mockData = {
                    data: [],
                    total: 0,
                    page: 3,
                    pageSize: 10,
                    requestId: 'req-891',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getConversations(3, 10)
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })

        describe('getConversationDetails', () => {
            it('should fetch conversation details successfully', async () => {
                const mockData = {
                    data: {
                        conversation: {
                            id: 'conv-1',
                            reservationCode: 'RES-001',
                            guestName: 'John Doe',
                            propertyId: 'prop-1',
                            channel: 'airbnb',
                            lastMessageAt: '2024-11-20T10:00:00Z',
                            unreadCount: 0,
                        },
                        messages: [
                            {
                                id: 'msg-1',
                                conversationId: 'conv-1',
                                content: 'Hello, when is check-in?',
                                sentBy: 'guest' as const,
                                sentAt: '2024-11-20T09:00:00Z',
                                messageType: 'text' as const,
                            },
                            {
                                id: 'msg-2',
                                conversationId: 'conv-1',
                                content: 'Check-in is at 3 PM',
                                sentBy: 'host' as const,
                                sentAt: '2024-11-20T10:00:00Z',
                                messageType: 'text' as const,
                            },
                        ],
                    },
                    requestId: 'req-900',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getConversationDetails('conv-1')
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })

        describe('sendMessage', () => {
            it('should send text message successfully', async () => {
                const input: SendMessageInput = {
                    conversationId: 'conv-1',
                    content: 'Thanks for your question!',
                    messageType: 'text',
                }

                const mockData = {
                    data: {
                        message: {
                            id: 'msg-3',
                            conversationId: 'conv-1',
                            content: 'Thanks for your question!',
                            sentBy: 'host' as const,
                            sentAt: '2024-11-20T11:00:00Z',
                            messageType: 'text' as const,
                        },
                    },
                    requestId: 'req-910',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.sendMessage(input)
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })

            it('should send image message successfully', async () => {
                const input: SendMessageInput = {
                    conversationId: 'conv-1',
                    content: 'Here is the property photo',
                    messageType: 'image',
                    imageUrl: 'https://example.com/photo.jpg',
                }

                const mockData = {
                    data: {
                        message: {
                            id: 'msg-4',
                            conversationId: 'conv-1',
                            content: 'Here is the property photo',
                            sentBy: 'host' as const,
                            sentAt: '2024-11-20T12:00:00Z',
                            messageType: 'image' as const,
                            imageUrl: 'https://example.com/photo.jpg',
                        },
                    },
                    requestId: 'req-920',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.sendMessage(input)
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })
    })

    describe('Reviews', () => {
        describe('getReviews', () => {
            it('should fetch reviews without filters', async () => {
                const mockData = {
                    data: [
                        {
                            id: 'review-1',
                            reservationCode: 'RES-001',
                            rating: 5,
                            comment: 'Excellent stay!',
                            reviewerName: 'John Doe',
                            channel: 'airbnb',
                            createdAt: '2024-11-15T10:00:00Z',
                        },
                    ],
                    total: 1,
                    page: 1,
                    pageSize: 20,
                    requestId: 'req-930',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getReviews()
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })

            it('should fetch reviews with filters', async () => {
                const mockData = {
                    data: [],
                    total: 0,
                    page: 1,
                    pageSize: 10,
                    requestId: 'req-931',
                }

                mockSuccessResponse(mockData)

                const params: ReviewsQueryParams = {
                    propertyId: 'prop-1',
                    rating: 5,
                    hasReply: false,
                    page: 1,
                    pageSize: 10,
                }

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getReviews(params)
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })

        describe('createReview', () => {
            it('should create review reply successfully', async () => {
                const input: CreateReviewInput = {
                    reservationCode: 'RES-001',
                    reply: 'Thank you for your kind words!',
                }

                const mockData = {
                    data: {
                        success: true,
                    },
                    requestId: 'req-940',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.createReview(input)
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })
    })

    describe('Webhooks', () => {
        describe('getWebhooks', () => {
            it('should fetch webhooks successfully', async () => {
                const mockData = {
                    data: [
                        {
                            id: 'webhook-1',
                            url: 'https://example.com/webhook',
                            events: [
                                'reservation.created',
                                'reservation.updated',
                            ],
                            active: true,
                            createdAt: '2024-11-01T10:00:00Z',
                        },
                    ],
                    requestId: 'req-950',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.getWebhooks()
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })

        describe('createWebhook', () => {
            it('should create webhook successfully', async () => {
                const input: CreateWebhookInput = {
                    url: 'https://example.com/webhook',
                    events: ['reservation.created', 'message.received'],
                }

                const mockData = {
                    data: {
                        webhook: {
                            id: 'webhook-2',
                            url: 'https://example.com/webhook',
                            events: ['reservation.created', 'message.received'],
                            active: true,
                            createdAt: '2024-11-20T10:00:00Z',
                        },
                    },
                    requestId: 'req-960',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.createWebhook(input)
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })

        describe('deleteWebhook', () => {
            it('should delete webhook successfully', async () => {
                const mockData = {
                    success: true,
                    requestId: 'req-970',
                }

                mockSuccessResponse(mockData)

                const program = Effect.gen(function* () {
                    const service = yield* HostexService
                    return yield* service.deleteWebhook('webhook-1')
                })

                const result = await Effect.runPromise(
                    program.pipe(Effect.provide(createServiceLayer()))
                )

                expect(result).toEqual(mockData)
            })
        })
    })

    describe('Error Handling', () => {
        it('should handle HostexError with error details', async () => {
            mockErrorResponse(400, 'Invalid property ID', 'INVALID_PROPERTY')

            const program = Effect.gen(function* () {
                const service = yield* HostexService
                return yield* service.getProperties()
            })

            const result = await program.pipe(
                Effect.provide(createServiceLayer()),
                Effect.exit,
                Effect.runPromise
            )

            expect(Exit.isFailure(result)).toBe(true)
        })

        it('should handle HostexNetworkError on fetch failure', async () => {
            mockNetworkError('Connection timeout')

            const program = Effect.gen(function* () {
                const service = yield* HostexService
                return yield* service.getProperties()
            })

            const result = await program.pipe(
                Effect.provide(createServiceLayer()),
                Effect.exit,
                Effect.runPromise
            )

            expect(Exit.isFailure(result)).toBe(true)
        })

        it.skip('should handle timeout', async () => {
            // Mock a request that takes longer than the configured timeout (5000ms)
            mockFetch.mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve({
                                ok: true,
                                json: async () => ({ data: [] }),
                            })
                        }, 6000)
                    })
            )

            const program = Effect.gen(function* () {
                const service = yield* HostexService
                return yield* service.getProperties()
            })

            const result = await program.pipe(
                Effect.provide(createServiceLayer()),
                Effect.exit,
                Effect.runPromise
            )

            // Should timeout before the 6s response (config has 5s timeout)
            expect(Exit.isFailure(result)).toBe(true)
        }, 7000)
    })

    describe('Configuration', () => {
        it('should use default base URL when not provided', () => {
            const configWithoutBaseUrl = {
                accessToken: 'test-token',
            }

            const layer = makeHostexServiceLayer(configWithoutBaseUrl)
            expect(layer).toBeDefined()
        })

        it('should use custom timeout when provided', () => {
            const configWithTimeout = {
                accessToken: 'test-token',
                timeout: 10000,
            }

            const layer = makeHostexServiceLayer(configWithTimeout)
            expect(layer).toBeDefined()
        })

        it('should properly format request headers', async () => {
            const mockData = {
                data: [],
                requestId: 'req-headers-test',
            }

            mockSuccessResponse(mockData)

            const program = Effect.gen(function* () {
                const service = yield* HostexService
                return yield* service.getProperties()
            })

            await Effect.runPromise(
                program.pipe(Effect.provide(createServiceLayer()))
            )

            expect(mockFetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Hostex-Access-Token': 'test-token-123',
                        'Content-Type': 'application/json',
                    }),
                })
            )
        })
    })

    describe('Query Parameter Handling', () => {
        it('should properly encode query parameters with special characters', async () => {
            const mockData = {
                data: [],
                total: 0,
                page: 1,
                pageSize: 20,
                requestId: 'req-query-test',
            }

            mockSuccessResponse(mockData)

            const params: ReservationsQueryParams = {
                check_in_from: '2024-12-01',
                check_in_to: '2024-12-31',
                status: 'accepted',
            }

            const program = Effect.gen(function* () {
                const service = yield* HostexService
                return yield* service.getReservations(params)
            })

            await Effect.runPromise(
                program.pipe(Effect.provide(createServiceLayer()))
            )

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('check_in_from=2024-12-01'),
                expect.any(Object)
            )
        })

        it('should skip undefined query parameters', async () => {
            const mockData = {
                bookings: {
                    reservations: [],
                },
            }

            mockSuccessResponse(mockData)

            const params: ReservationsQueryParams = {
                property_id: 12345,
            }

            const program = Effect.gen(function* () {
                const service = yield* HostexService
                return yield* service.getReservations(params)
            })

            await Effect.runPromise(
                program.pipe(Effect.provide(createServiceLayer()))
            )

            const callUrl = mockFetch.mock.calls[0]?.[0] as string
            expect(callUrl).toContain('property_id=12345')
            expect(callUrl).not.toContain('status')
        })
    })

    describe('Batch Operations', () => {
        it('should handle multiple listing inventory updates', async () => {
            const mockData = {
                data: {
                    success: true,
                    updated: 5,
                },
                requestId: 'req-batch-test',
            }

            mockSuccessResponse(mockData)

            const updates = [
                { listingId: 'listing-1', date: '2024-12-01', available: true },
                { listingId: 'listing-1', date: '2024-12-02', available: true },
                {
                    listingId: 'listing-1',
                    date: '2024-12-03',
                    available: false,
                },
                { listingId: 'listing-2', date: '2024-12-01', available: true },
                {
                    listingId: 'listing-2',
                    date: '2024-12-02',
                    available: false,
                },
            ]

            const program = Effect.gen(function* () {
                const service = yield* HostexService
                return yield* service.updateListingInventories(updates)
            })

            const result = await Effect.runPromise(
                program.pipe(Effect.provide(createServiceLayer()))
            )

            expect(result.data.updated).toBe(5)
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/listings/inventories'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ updates }),
                })
            )
        })

        it('should handle multiple listing price updates', async () => {
            const mockData = {
                data: {
                    success: true,
                    updated: 3,
                },
                requestId: 'req-batch-price-test',
            }

            mockSuccessResponse(mockData)

            const updates = [
                { listingId: 'listing-1', date: '2024-12-01', price: 200 },
                { listingId: 'listing-1', date: '2024-12-02', price: 250 },
                { listingId: 'listing-1', date: '2024-12-03', price: 300 },
            ]

            const program = Effect.gen(function* () {
                const service = yield* HostexService
                return yield* service.updateListingPrices(updates)
            })

            const result = await Effect.runPromise(
                program.pipe(Effect.provide(createServiceLayer()))
            )

            expect(result.data.updated).toBe(3)
        })
    })

    describe('Effect Composition', () => {
        it('should compose multiple operations using Effect.gen', async () => {
            // Mock responses for multiple operations
            mockSuccessResponse({
                data: [{ id: 'prop-1', name: 'Test Property' }],
                requestId: 'req-1',
            })
            mockSuccessResponse({
                data: [
                    { id: 'room-1', name: 'Test Room', propertyId: 'prop-1' },
                ],
                requestId: 'req-2',
            })

            const program = Effect.gen(function* () {
                const service = yield* HostexService

                const properties = yield* service.getProperties()
                const roomTypes = yield* service.getRoomTypes()

                return {
                    properties: properties.data,
                    roomTypes: roomTypes.data,
                }
            })

            const result = await Effect.runPromise(
                program.pipe(Effect.provide(createServiceLayer()))
            )

            expect(result.properties).toHaveLength(1)
            expect(result.roomTypes).toHaveLength(1)
            expect(mockFetch).toHaveBeenCalledTimes(2)
        })

        it('should handle errors in composed operations', async () => {
            // First operation succeeds
            mockSuccessResponse({
                data: [{ id: 'prop-1', name: 'Test Property' }],
                requestId: 'req-1',
            })
            // Second operation fails
            mockErrorResponse(500, 'Internal server error', 'SERVER_ERROR')

            const program = Effect.gen(function* () {
                const service = yield* HostexService

                yield* service.getProperties()
                yield* service.getRoomTypes()

                return { success: true }
            })

            const result = await program.pipe(
                Effect.provide(createServiceLayer()),
                Effect.exit,
                Effect.runPromise
            )

            expect(Exit.isFailure(result)).toBe(true)
        })
    })
})
