import { Data } from 'effect'

/**
 * Hostex API Types
 *
 * Type definitions for the Hostex API v3.0.0 (Beta)
 * Documentation: https://hostex-openapi.readme.io/reference/overview
 */

// ============================================================================
// Error Types
// ============================================================================

export class HostexError extends Data.TaggedError('HostexError')<{
    readonly message: string
    readonly requestId?: string
    readonly errorCode?: string
}> {}

export class HostexAuthError extends Data.TaggedError('HostexAuthError')<{
    readonly message: string
}> {}

export class HostexNetworkError extends Data.TaggedError('HostexNetworkError')<{
    readonly message: string
    readonly cause?: unknown
}> {}

// ============================================================================
// Types - Properties
// ============================================================================

export interface Property {
    id: string
    name: string
    address?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
    timezone?: string
    currency?: string
    propertyType?: string
    bedrooms?: number
    bathrooms?: number
    maxGuests?: number
    checkInTime?: string
    checkOutTime?: string
}

export interface PropertiesResponse {
    data: Property[]
    requestId: string
}

// ============================================================================
// Types - Room Types
// ============================================================================

export interface RoomType {
    id: string
    name: string
    propertyId: string
    maxGuests?: number
    bedrooms?: number
    bathrooms?: number
}

export interface RoomTypesResponse {
    data: RoomType[]
    requestId: string
}

// ============================================================================
// Types - Reservations
// ============================================================================

export type ReservationStatus =
    | 'confirmed'
    | 'pending'
    | 'cancelled'
    | 'completed'

export interface Guest {
    name: string
    email?: string
    phone?: string
}

export interface Reservation {
    code: string
    propertyId: string
    roomTypeId?: string
    checkIn: string
    checkOut: string
    status: ReservationStatus
    guest: Guest
    adults: number
    children?: number
    nights: number
    price: number
    currency: string
    channel?: string
    lockCode?: string
    customFields?: Record<string, unknown>
    createdAt: string
    updatedAt: string
}

export interface ReservationsQueryParams {
    propertyId?: string
    status?: ReservationStatus
    checkInFrom?: string
    checkInTo?: string
    checkOutFrom?: string
    checkOutTo?: string
    updatedFrom?: string
    updatedTo?: string
    page?: number
    pageSize?: number
}

export interface ReservationsResponse {
    data: Reservation[]
    total: number
    page: number
    pageSize: number
    requestId: string
}

export interface CreateReservationInput {
    propertyId: string
    roomTypeId?: string
    checkIn: string
    checkOut: string
    guest: Guest
    adults: number
    children?: number
    price: number
    currency: string
    channel?: string
    customFields?: Record<string, unknown>
}

export interface CreateReservationResponse {
    data: {
        code: string
        reservation: Reservation
    }
    requestId: string
}

export interface UpdateLockCodeInput {
    code: string
    lockCode: string
}

export interface UpdateLockCodeResponse {
    data: {
        success: boolean
    }
    requestId: string
}

// ============================================================================
// Types - Availability
// ============================================================================

export interface PropertyAvailability {
    date: string
    available: boolean
    propertyId: string
    roomTypeId?: string
}

export interface AvailabilitiesQueryParams {
    propertyId: string
    roomTypeId?: string
    startDate: string
    endDate: string
}

export interface AvailabilitiesResponse {
    data: PropertyAvailability[]
    requestId: string
}

export interface UpdateAvailabilityInput {
    propertyId: string
    roomTypeId?: string
    startDate: string
    endDate: string
    available: boolean
}

export interface UpdateAvailabilitiesResponse {
    data: {
        success: boolean
        updated: number
    }
    requestId: string
}

// ============================================================================
// Types - Listing Calendar
// ============================================================================

export interface ListingCalendarDay {
    date: string
    available: boolean
    price?: number
    minStay?: number
    maxStay?: number
    closedToArrival?: boolean
    closedToDeparture?: boolean
}

export interface ListingCalendarQueryInput {
    listingIds: string[]
    startDate: string
    endDate: string
}

export interface ListingCalendarResponse {
    data: Record<string, ListingCalendarDay[]>
    requestId: string
}

export interface UpdateListingInventoryInput {
    listingId: string
    date: string
    available: boolean
}

export interface UpdateListingPriceInput {
    listingId: string
    date: string
    price: number
}

export interface UpdateListingRestrictionInput {
    listingId: string
    date: string
    minStay?: number
    maxStay?: number
    closedToArrival?: boolean
    closedToDeparture?: boolean
}

export interface ListingUpdateResponse {
    data: {
        success: boolean
        updated: number
    }
    requestId: string
}

// ============================================================================
// Types - Messages
// ============================================================================

export interface Conversation {
    id: string
    reservationCode?: string
    guestName: string
    propertyId: string
    channel?: string
    lastMessageAt: string
    unreadCount: number
}

export interface ConversationsResponse {
    data: Conversation[]
    total: number
    page: number
    pageSize: number
    requestId: string
}

export interface Message {
    id: string
    conversationId: string
    content: string
    sentBy: 'host' | 'guest'
    sentAt: string
    messageType: 'text' | 'image'
    imageUrl?: string
}

export interface ConversationDetailsResponse {
    data: {
        conversation: Conversation
        messages: Message[]
    }
    requestId: string
}

export interface SendMessageInput {
    conversationId: string
    content: string
    messageType?: 'text' | 'image'
    imageUrl?: string
}

export interface SendMessageResponse {
    data: {
        message: Message
    }
    requestId: string
}

// ============================================================================
// Types - Reviews
// ============================================================================

export interface Review {
    id: string
    reservationCode: string
    rating: number
    comment?: string
    reviewerName: string
    channel?: string
    createdAt: string
    reply?: {
        content: string
        repliedAt: string
    }
}

export interface ReviewsQueryParams {
    propertyId?: string
    rating?: number
    hasReply?: boolean
    page?: number
    pageSize?: number
}

export interface ReviewsResponse {
    data: Review[]
    total: number
    page: number
    pageSize: number
    requestId: string
}

export interface CreateReviewInput {
    reservationCode: string
    rating?: number
    reply: string
}

export interface CreateReviewResponse {
    data: {
        success: boolean
    }
    requestId: string
}

// ============================================================================
// Types - Webhooks
// ============================================================================

export type WebhookEvent =
    | 'reservation.created'
    | 'reservation.updated'
    | 'reservation.cancelled'
    | 'message.received'
    | 'review.created'

export interface Webhook {
    id: string
    url: string
    events: WebhookEvent[]
    active: boolean
    createdAt: string
}

export interface WebhooksResponse {
    data: Webhook[]
    requestId: string
}

export interface CreateWebhookInput {
    url: string
    events: WebhookEvent[]
}

export interface CreateWebhookResponse {
    data: {
        webhook: Webhook
    }
    requestId: string
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface HostexConfig {
    readonly accessToken: string
    readonly baseUrl?: string
    readonly timeout?: number
}
