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
    | 'accepted'
    | 'pending'
    | 'cancelled'
    | 'completed'

export type ChannelType =
    | 'airbnb'
    | 'booking.com'
    | 'booking_site'
    | 'hostex_direct'
    | 'vrbo'
    | 'direct'

export interface MoneyAmount {
    currency: string
    amount: number
}

export type RateDetailType =
    | 'ACCOMMODATION'
    | 'HOST_SERVICE_FEE'
    | 'CLEANING_FEE'
    | 'EXTRA_GUEST_FEE'
    | 'PET_FEE'
    | 'TAX'
    | 'OTHER'

export interface RateDetail {
    type: RateDetailType
    description: string
    currency: string
    amount: number
}

export interface Rates {
    total_rate: MoneyAmount
    total_commission: MoneyAmount | null
    rate: MoneyAmount
    commission: MoneyAmount | null
    details: RateDetail[]
}

export interface CheckInDetails {
    arrival_at: string | null
    departure_at: string | null
    lock_code: string | null
    lock_code_visible_after: string
    deposit: number | null
}

export interface CustomChannel {
    id: number
    name: string
}

export interface ReservationGuest {
    id: number
    name: string
    phone: string
    email: string
    id_type: string | null
    id_number: string | null
    gender: string | null
    country: string | null
    is_booker: boolean
}

export interface Reservation {
    reservation_code: string
    stay_code: string
    channel_id: string
    property_id: number
    channel_type: ChannelType
    listing_id: string
    check_in_date: string
    check_out_date: string
    number_of_guests: number
    number_of_adults: number
    number_of_children: number
    number_of_infants: number
    number_of_pets: number
    status: ReservationStatus
    guest_name: string
    guest_phone: string
    guest_email: string
    cancelled_at: string | null
    booked_at: string
    created_at: string
    creator: string
    rates: Rates
    check_in_details: CheckInDetails
    remarks: string
    channel_remarks: string
    conversation_id: string | null
    tags: string[]
    custom_channel: CustomChannel
    guests: ReservationGuest[]
    custom_fields: Record<string, unknown> | null
    in_reservation_box: boolean
}

export interface ReservationsQueryParams {
    property_id?: number
    status?: ReservationStatus
    check_in_from?: string
    check_in_to?: string
    check_out_from?: string
    check_out_to?: string
    updated_from?: string
    updated_to?: string
    page?: number
    page_size?: number
}

export interface ReservationsResponse {
    data: {
        reservations: Reservation[]
    }
}

export interface CreateReservationInput {
    property_id: number
    listing_id?: string
    check_in_date: string
    check_out_date: string
    guest_name: string
    guest_phone?: string
    guest_email?: string
    number_of_adults: number
    number_of_children?: number
    number_of_infants?: number
    number_of_pets?: number
    channel_type?: ChannelType
    custom_fields?: Record<string, unknown>
}

export interface CreateReservationResponse {
    reservation: Reservation
}

export interface UpdateLockCodeInput {
    reservation_code: string
    lock_code: string
}

export interface UpdateLockCodeResponse {
    success: boolean
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
    reply?:
        | {
              content: string
              repliedAt: string
          }
        | undefined
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
