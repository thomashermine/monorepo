import { faker } from '@faker-js/faker'

import { futureDate, isoDate } from '../date'
import type {
    AvailabilitiesResponse,
    Conversation,
    ConversationDetailsResponse,
    ConversationsResponse,
    CreateReservationResponse,
    CreateReviewResponse,
    CreateWebhookResponse,
    ListingCalendarDay,
    ListingCalendarResponse,
    ListingUpdateResponse,
    Message,
    PropertiesResponse,
    Property,
    PropertyAvailability,
    Reservation,
    ReservationsResponse,
    ReservationStatus,
    Review,
    ReviewsResponse,
    RoomType,
    RoomTypesResponse,
    SendMessageResponse,
    UpdateAvailabilitiesResponse,
    UpdateLockCodeResponse,
    Webhook,
    WebhookEvent,
    WebhooksResponse,
} from './types'

/**
 * Hostex API Mocks Generator
 *
 * Utilities to generate mock data for the Hostex API using faker-js
 */

const mockRequestId = (): string => `req-${faker.string.alphanumeric(12)}`

// ============================================================================
// Mock Generators - Properties
// ============================================================================

/**
 * Generate a mock Property
 */

export const mockProperty = (overrides?: Partial<Property>): Property => {
    return {
        id: faker.string.uuid(),
        name: faker.company.name() + ' ' + faker.word.noun(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        zipCode: faker.location.zipCode(),
        timezone: faker.location.timeZone(),
        currency: faker.finance.currencyCode(),
        propertyType: faker.helpers.arrayElement([
            'apartment',
            'house',
            'villa',
            'cabin',
            'condo',
        ]),
        bedrooms: faker.number.int({ min: 1, max: 6 }),
        bathrooms: faker.number.int({ min: 1, max: 4 }),
        maxGuests: faker.number.int({ min: 2, max: 12 }),
        checkInTime: '15:00',
        checkOutTime: '11:00',
        ...overrides,
    }
}

/**
 * Generate a mock PropertiesResponse
 */
export const mockPropertiesResponse = (
    count: number = 3,
    overrides?: Partial<PropertiesResponse>
): PropertiesResponse => {
    return {
        data: Array.from({ length: count }, () => mockProperty()),
        requestId: mockRequestId(),
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Room Types
// ============================================================================

/**
 * Generate a mock RoomType
 */
export const mockRoomType = (overrides?: Partial<RoomType>): RoomType => {
    return {
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement([
            'Deluxe Suite',
            'Standard Room',
            'Executive Suite',
            'Family Room',
        ]),
        propertyId: faker.string.uuid(),
        maxGuests: faker.number.int({ min: 2, max: 8 }),
        bedrooms: faker.number.int({ min: 1, max: 4 }),
        bathrooms: faker.number.int({ min: 1, max: 3 }),
        ...overrides,
    }
}

/**
 * Generate a mock RoomTypesResponse
 */
export const mockRoomTypesResponse = (
    count: number = 3,
    overrides?: Partial<RoomTypesResponse>
): RoomTypesResponse => {
    return {
        data: Array.from({ length: count }, () => mockRoomType()),
        requestId: mockRequestId(),
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Reservations
// ============================================================================

/**
 * Generate a mock Reservation
 */
export const mockReservation = (
    overrides?: Partial<Reservation>
): Reservation => {
    const checkIn = futureDate(30)
    const nights = faker.number.int({ min: 1, max: 14 })
    const checkOutDate = new Date(checkIn)
    checkOutDate.setDate(checkOutDate.getDate() + nights)
    const checkOut = checkOutDate.toISOString().split('T')[0]!

    return {
        code: `RES-${faker.string.alphanumeric(8).toUpperCase()}`,
        propertyId: faker.string.uuid(),
        roomTypeId: faker.string.uuid(),
        checkIn,
        checkOut,
        status: faker.helpers.arrayElement<ReservationStatus>([
            'confirmed',
            'pending',
            'cancelled',
            'completed',
        ]),
        guest: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
        },
        adults: faker.number.int({ min: 1, max: 4 }),
        children: faker.number.int({ min: 0, max: 3 }),
        nights,
        price: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
        currency: faker.finance.currencyCode(),
        channel: faker.helpers.arrayElement([
            'airbnb',
            'booking.com',
            'direct',
            'vrbo',
        ]),
        lockCode: faker.string.numeric(4),
        customFields: {},
        createdAt: isoDate(),
        updatedAt: isoDate(),
        ...overrides,
    }
}

/**
 * Generate a mock ReservationsResponse
 */
export const mockReservationsResponse = (
    count: number = 5,
    page: number = 1,
    pageSize: number = 20,
    overrides?: Partial<ReservationsResponse>
): ReservationsResponse => {
    const reservations = Array.from({ length: count }, () => mockReservation())

    return {
        data: reservations,
        total: count,
        page,
        pageSize,
        requestId: mockRequestId(),
        ...overrides,
    }
}

/**
 * Generate a mock CreateReservationResponse
 */
export const mockCreateReservationResponse = (
    overrides?: Partial<CreateReservationResponse>
): CreateReservationResponse => {
    const reservation = mockReservation()

    return {
        data: {
            code: reservation.code,
            reservation,
        },
        requestId: mockRequestId(),
        ...overrides,
    }
}

/**
 * Generate a mock UpdateLockCodeResponse
 */
export const mockUpdateLockCodeResponse = (
    overrides?: Partial<UpdateLockCodeResponse>
): UpdateLockCodeResponse => {
    return {
        data: {
            success: true,
        },
        requestId: mockRequestId(),
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Availability
// ============================================================================

/**
 * Generate a mock PropertyAvailability
 */
export const mockPropertyAvailability = (
    overrides?: Partial<PropertyAvailability>
): PropertyAvailability => {
    return {
        date: futureDate(60),
        available: faker.datatype.boolean(),
        propertyId: faker.string.uuid(),
        roomTypeId: faker.string.uuid(),
        ...overrides,
    }
}

/**
 * Generate a mock AvailabilitiesResponse
 */
export const mockAvailabilitiesResponse = (
    count: number = 30,
    overrides?: Partial<AvailabilitiesResponse>
): AvailabilitiesResponse => {
    return {
        data: Array.from({ length: count }, () => mockPropertyAvailability()),
        requestId: mockRequestId(),
        ...overrides,
    }
}

/**
 * Generate a mock UpdateAvailabilitiesResponse
 */
export const mockUpdateAvailabilitiesResponse = (
    updated: number = 10,
    overrides?: Partial<UpdateAvailabilitiesResponse>
): UpdateAvailabilitiesResponse => {
    return {
        data: {
            success: true,
            updated,
        },
        requestId: mockRequestId(),
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Listing Calendar
// ============================================================================

/**
 * Generate a mock ListingCalendarDay
 */
export const mockListingCalendarDay = (
    overrides?: Partial<ListingCalendarDay>
): ListingCalendarDay => {
    return {
        date: futureDate(60),
        available: faker.datatype.boolean(),
        price: faker.number.float({ min: 100, max: 500, fractionDigits: 2 }),
        minStay: faker.number.int({ min: 1, max: 7 }),
        maxStay: faker.number.int({ min: 7, max: 30 }),
        closedToArrival: faker.datatype.boolean(),
        closedToDeparture: faker.datatype.boolean(),
        ...overrides,
    }
}

/**
 * Generate a mock ListingCalendarResponse
 */
export const mockListingCalendarResponse = (
    listingIds: string[] = [faker.string.uuid()],
    daysPerListing: number = 30,
    overrides?: Partial<ListingCalendarResponse>
): ListingCalendarResponse => {
    const data: Record<string, ListingCalendarDay[]> = {}

    for (const listingId of listingIds) {
        data[listingId] = Array.from({ length: daysPerListing }, () =>
            mockListingCalendarDay()
        )
    }

    return {
        data,
        requestId: mockRequestId(),
        ...overrides,
    }
}

/**
 * Generate a mock ListingUpdateResponse
 */
export const mockListingUpdateResponse = (
    updated: number = 5,
    overrides?: Partial<ListingUpdateResponse>
): ListingUpdateResponse => {
    return {
        data: {
            success: true,
            updated,
        },
        requestId: mockRequestId(),
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Messages
// ============================================================================

/**
 * Generate a mock Conversation
 */
export const mockConversation = (
    overrides?: Partial<Conversation>
): Conversation => {
    return {
        id: faker.string.uuid(),
        reservationCode: `RES-${faker.string.alphanumeric(8).toUpperCase()}`,
        guestName: faker.person.fullName(),
        propertyId: faker.string.uuid(),
        channel: faker.helpers.arrayElement([
            'airbnb',
            'booking.com',
            'direct',
        ]),
        lastMessageAt: isoDate(),
        unreadCount: faker.number.int({ min: 0, max: 10 }),
        ...overrides,
    }
}

/**
 * Generate a mock ConversationsResponse
 */
export const mockConversationsResponse = (
    count: number = 10,
    page: number = 1,
    pageSize: number = 20,
    overrides?: Partial<ConversationsResponse>
): ConversationsResponse => {
    return {
        data: Array.from({ length: count }, () => mockConversation()),
        total: count,
        page,
        pageSize,
        requestId: mockRequestId(),
        ...overrides,
    }
}

/**
 * Generate a mock Message
 */
export const mockMessage = (overrides?: Partial<Message>): Message => {
    return {
        id: faker.string.uuid(),
        conversationId: faker.string.uuid(),
        content: faker.lorem.sentence(),
        sentBy: faker.helpers.arrayElement(['host', 'guest']),
        sentAt: isoDate(),
        messageType: faker.helpers.arrayElement(['text', 'image']),
        imageUrl: faker.image.url(),
        ...overrides,
    }
}

/**
 * Generate a mock ConversationDetailsResponse
 */
export const mockConversationDetailsResponse = (
    messageCount: number = 5,
    overrides?: Partial<ConversationDetailsResponse>
): ConversationDetailsResponse => {
    const conversation = mockConversation()

    return {
        data: {
            conversation,
            messages: Array.from({ length: messageCount }, () =>
                mockMessage({ conversationId: conversation.id })
            ),
        },
        requestId: mockRequestId(),
        ...overrides,
    }
}

/**
 * Generate a mock SendMessageResponse
 */
export const mockSendMessageResponse = (
    overrides?: Partial<SendMessageResponse>
): SendMessageResponse => {
    return {
        data: {
            message: mockMessage(),
        },
        requestId: mockRequestId(),
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Reviews
// ============================================================================

/**
 * Generate a mock Review
 */
export const mockReview = (overrides?: Partial<Review>): Review => {
    const hasReply = faker.datatype.boolean()

    return {
        id: faker.string.uuid(),
        reservationCode: `RES-${faker.string.alphanumeric(8).toUpperCase()}`,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
        reviewerName: faker.person.fullName(),
        channel: faker.helpers.arrayElement(['airbnb', 'booking.com']),
        createdAt: isoDate(),
        reply: hasReply
            ? {
                  content: faker.lorem.paragraph(),
                  repliedAt: isoDate(),
              }
            : undefined,
        ...overrides,
    }
}

/**
 * Generate a mock ReviewsResponse
 */
export const mockReviewsResponse = (
    count: number = 10,
    page: number = 1,
    pageSize: number = 20,
    overrides?: Partial<ReviewsResponse>
): ReviewsResponse => {
    return {
        data: Array.from({ length: count }, () => mockReview()),
        total: count,
        page,
        pageSize,
        requestId: mockRequestId(),
        ...overrides,
    }
}

/**
 * Generate a mock CreateReviewResponse
 */
export const mockCreateReviewResponse = (
    overrides?: Partial<CreateReviewResponse>
): CreateReviewResponse => {
    return {
        data: {
            success: true,
        },
        requestId: mockRequestId(),
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Webhooks
// ============================================================================

/**
 * Generate a mock Webhook
 */
export const mockWebhook = (overrides?: Partial<Webhook>): Webhook => {
    return {
        id: faker.string.uuid(),
        url: faker.internet.url(),
        events: faker.helpers.arrayElements<WebhookEvent>(
            [
                'reservation.created',
                'reservation.updated',
                'reservation.cancelled',
                'message.received',
                'review.created',
            ],
            { min: 1, max: 5 }
        ),
        active: faker.datatype.boolean(),
        createdAt: isoDate(),
        ...overrides,
    }
}

/**
 * Generate a mock WebhooksResponse
 */
export const mockWebhooksResponse = (
    count: number = 3,
    overrides?: Partial<WebhooksResponse>
): WebhooksResponse => {
    return {
        data: Array.from({ length: count }, () => mockWebhook()),
        requestId: mockRequestId(),
        ...overrides,
    }
}

/**
 * Generate a mock CreateWebhookResponse
 */
export const mockCreateWebhookResponse = (
    overrides?: Partial<CreateWebhookResponse>
): CreateWebhookResponse => {
    return {
        data: {
            webhook: mockWebhook(),
        },
        requestId: mockRequestId(),
        ...overrides,
    }
}

// ============================================================================
// Batch Mock Generators
// ============================================================================

/**
 * Generate a complete set of mock data for testing
 */
export const mockCompleteDataset = () => {
    return {
        properties: mockPropertiesResponse(5),
        roomTypes: mockRoomTypesResponse(8),
        reservations: mockReservationsResponse(20),
        availabilities: mockAvailabilitiesResponse(30),
        conversations: mockConversationsResponse(15),
        reviews: mockReviewsResponse(25),
        webhooks: mockWebhooksResponse(3),
    }
}

/**
 * Generate mock data with relationships (property -> reservations -> conversations)
 */
export const mockRelatedDataset = () => {
    const property = mockProperty()
    const reservations = Array.from({ length: 5 }, () =>
        mockReservation({ propertyId: property.id })
    )
    const conversations = reservations.map((reservation) =>
        mockConversation({
            reservationCode: reservation.code,
            propertyId: property.id,
            guestName: reservation.guest.name,
        })
    )

    return {
        property,
        reservations,
        conversations,
    }
}
