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
// Types - Vouchers (Private API)
// ============================================================================

export type VoucherDiscountType = 'percent' | 'flat'

export interface VoucherListing {
    id: number
    title: string
    alias: string
    host_id: number
    is_listed: number
    description: string
    instruction_of_stay: string
    type: string
    lodging_category: string
    bedroom: number
    bathroom: number
    max_number_of_guests: number
    beds: string[]
    place_id: string
    location_sharing_type: string
    location_description: string | null
    longitude: number
    latitude: number
    amenities: unknown[]
    inventory: number
    base_price: number
    weekend_price: number
    cleaning_fee: number
    pet_fee: number
    extra_guest_fee: number
    included_guest_count: number
    availability_window: number
    house_rules: {
        checkin_start: string
        checkin_end: string
        checkout_time: string
        rules: string[]
    }
    timezone_p: string | null
    timezone: string | null
    search_url: string | null
    show_airbnb_reviews: number
    standard_fees: unknown | null
    deleted_at: string | null
    created_at: string
    updated_at: string
    photos_count: number
    lodging_category_str: string
}

export interface Voucher {
    id: number
    host_id: number
    code: string
    discount: number
    discount_type: VoucherDiscountType
    expired_at: string | null
    stay_period: number
    earliest_check_in: string | null
    latest_check_out: string | null
    minimum_stay: number
    number_of_redemption: number | null
    status: number
    created_at: string
    updated_at: string
    redeemed_time: number
    listings?: VoucherListing[]
}

export interface CreateVoucherInput {
    thirdparty_account_id: string
    code: string
    discount_type: VoucherDiscountType
    discount: number
    expired_at?: string | null
    stay_period?: number
    earliest_check_in?: string | null
    latest_check_out?: string | null
    minimum_stay?: number
    number_of_redemption?: number | null
    listing_ids?: number[]
}

export interface CreateVoucherResponse {
    request_id: string
    error_code: number
    error_msg: string
    data: Voucher
}

export interface GetVouchersInput {
    thirdparty_account_id: string
    page?: number
    page_size?: number
}

export interface GetVouchersResponse {
    request_id: string
    error_code: number
    error_msg: string
    data: Voucher[]
}

export interface DeleteVoucherInput {
    thirdparty_account_id: string
    id: number
}

export interface DeleteVoucherResponse {
    request_id: string
    error_code: number
    error_msg: string
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface HostexConfig {
    readonly accessToken: string
    readonly baseUrl?: string
    readonly timeout?: number
    readonly sessionCookie?: string
    readonly privateApiBaseUrl?: string
}
