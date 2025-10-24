import { Config, Context, Effect, Layer } from 'effect'

import {
    type AvailabilitiesQueryParams,
    type AvailabilitiesResponse,
    type ConversationDetailsResponse,
    type ConversationsResponse,
    type CreateReservationInput,
    type CreateReservationResponse,
    type CreateReviewInput,
    type CreateReviewResponse,
    type CreateVoucherInput,
    type CreateVoucherResponse,
    type CreateWebhookInput,
    type CreateWebhookResponse,
    type DeleteVoucherInput,
    type DeleteVoucherResponse,
    type GetVouchersInput,
    type GetVouchersResponse,
    HostexAuthError,
    type HostexConfig,
    HostexError,
    HostexNetworkError,
    type ListingCalendarQueryInput,
    type ListingCalendarResponse,
    type ListingUpdateResponse,
    type PropertiesResponse,
    type Reservation,
    type ReservationsQueryParams,
    type ReservationsResponse,
    type ReviewsQueryParams,
    type ReviewsResponse,
    type RoomTypesResponse,
    type SendMessageInput,
    type SendMessageResponse,
    type UpdateAvailabilitiesResponse,
    type UpdateAvailabilityInput,
    type UpdateListingInventoryInput,
    type UpdateListingPriceInput,
    type UpdateListingRestrictionInput,
    type UpdateLockCodeInput,
    type UpdateLockCodeResponse,
    type Voucher,
    type Webhook,
    type WebhooksResponse,
} from './types'

/**
 * Hostex API Service
 *
 * A comprehensive Effect-based service for interacting with the Hostex API v3.0.0 (Beta)
 * Documentation: https://hostex-openapi.readme.io/reference/overview
 */

// Re-export all types
export * from './types'

export class HostexService extends Context.Tag('HostexService')<
    HostexService,
    {
        readonly getProperties: () => Effect.Effect<
            PropertiesResponse,
            HostexError | HostexNetworkError
        >
        readonly getRoomTypes: () => Effect.Effect<
            RoomTypesResponse,
            HostexError | HostexNetworkError
        >
        readonly getReservations: (
            params?: ReservationsQueryParams
        ) => Effect.Effect<Reservation[], HostexError | HostexNetworkError>
        readonly createReservation: (
            input: CreateReservationInput
        ) => Effect.Effect<
            CreateReservationResponse,
            HostexError | HostexNetworkError
        >
        readonly cancelReservation: (
            code: string
        ) => Effect.Effect<
            { success: boolean; requestId: string },
            HostexError | HostexNetworkError
        >
        readonly updateLockCode: (
            input: UpdateLockCodeInput
        ) => Effect.Effect<
            UpdateLockCodeResponse,
            HostexError | HostexNetworkError
        >
        readonly getAvailabilities: (
            params: AvailabilitiesQueryParams
        ) => Effect.Effect<
            AvailabilitiesResponse,
            HostexError | HostexNetworkError
        >
        readonly updateAvailabilities: (
            input: UpdateAvailabilityInput
        ) => Effect.Effect<
            UpdateAvailabilitiesResponse,
            HostexError | HostexNetworkError
        >
        readonly getListingCalendar: (
            input: ListingCalendarQueryInput
        ) => Effect.Effect<
            ListingCalendarResponse,
            HostexError | HostexNetworkError
        >
        readonly updateListingInventories: (
            inputs: UpdateListingInventoryInput[]
        ) => Effect.Effect<
            ListingUpdateResponse,
            HostexError | HostexNetworkError
        >
        readonly updateListingPrices: (
            inputs: UpdateListingPriceInput[]
        ) => Effect.Effect<
            ListingUpdateResponse,
            HostexError | HostexNetworkError
        >
        readonly updateListingRestrictions: (
            inputs: UpdateListingRestrictionInput[]
        ) => Effect.Effect<
            ListingUpdateResponse,
            HostexError | HostexNetworkError
        >
        readonly getConversations: (
            page?: number,
            pageSize?: number
        ) => Effect.Effect<
            ConversationsResponse,
            HostexError | HostexNetworkError
        >
        readonly getConversationDetails: (
            conversationId: string
        ) => Effect.Effect<
            ConversationDetailsResponse,
            HostexError | HostexNetworkError
        >
        readonly sendMessage: (
            input: SendMessageInput
        ) => Effect.Effect<
            SendMessageResponse,
            HostexError | HostexNetworkError
        >
        readonly getReviews: (
            params?: ReviewsQueryParams
        ) => Effect.Effect<ReviewsResponse, HostexError | HostexNetworkError>
        readonly createReview: (
            input: CreateReviewInput
        ) => Effect.Effect<
            CreateReviewResponse,
            HostexError | HostexNetworkError
        >
        readonly getWebhooks: () => Effect.Effect<
            WebhooksResponse,
            HostexError | HostexNetworkError
        >
        readonly createWebhook: (
            input: CreateWebhookInput
        ) => Effect.Effect<
            CreateWebhookResponse,
            HostexError | HostexNetworkError
        >
        readonly deleteWebhook: (
            webhookId: string
        ) => Effect.Effect<
            { success: boolean; requestId: string },
            HostexError | HostexNetworkError
        >
        readonly registerWebhook: (
            webhookUrl: string,
            events: readonly string[]
        ) => Effect.Effect<Webhook, HostexError | HostexNetworkError>
        readonly getVouchers: (
            input: GetVouchersInput
        ) => Effect.Effect<
            GetVouchersResponse,
            HostexError | HostexNetworkError
        >
        readonly createVoucher: (
            input: CreateVoucherInput
        ) => Effect.Effect<
            CreateVoucherResponse,
            HostexError | HostexNetworkError
        >
        readonly deleteVoucher: (
            input: DeleteVoucherInput
        ) => Effect.Effect<
            DeleteVoucherResponse,
            HostexError | HostexNetworkError
        >
    }
>() {}

const makeRequest = <T>(
    config: HostexConfig,
    endpoint: string,
    options: RequestInit = {}
): Effect.Effect<T, HostexError | HostexNetworkError> => {
    const baseUrl = config.baseUrl ?? 'https://open-api.hostex.com/v3'
    const url = `${baseUrl}${endpoint}`

    const headers = {
        'Hostex-Access-Token': config.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
    }

    return Effect.tryPromise({
        try: async () => {
            const controller = new AbortController()
            const timeout = config.timeout ?? 30000
            const timeoutId = setTimeout(() => controller.abort(), timeout)

            try {
                const response = await fetch(url, {
                    ...options,
                    headers,
                    signal: controller.signal,
                })

                clearTimeout(timeoutId)

                const data = (await response.json()) as {
                    error_msg?: string
                    request_id?: string
                    error_code?: string
                } & T

                if (!response.ok) {
                    throw new HostexError({
                        message:
                            data.error_msg ??
                            `HTTP ${response.status}: ${response.statusText}`,
                        requestId: data.request_id ?? 'Unknown requestId',
                        errorCode: data.error_code ?? 'Unknown errorCode',
                    })
                }

                return data as T
            } catch (error) {
                clearTimeout(timeoutId)
                throw error
            }
        },
        catch: (error) => {
            if (error instanceof HostexError) {
                return error
            }
            return new HostexNetworkError({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Network request failed',
                cause: error,
            })
        },
    })
}

/**
 * Helper function for making requests to Hostex Private API
 * Uses session cookie authentication instead of access token
 */
const makePrivateRequest = <T>(
    config: HostexConfig,
    endpoint: string,
    options: RequestInit = {}
): Effect.Effect<T, HostexError | HostexNetworkError> => {
    const baseUrl = config.privateApiBaseUrl ?? 'https://hostex.io/api/bs'
    const url = `${baseUrl}${endpoint}`

    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        ...(config.sessionCookie
            ? { Cookie: `hostex_session=${config.sessionCookie};` }
            : {}),
        ...options.headers,
    }

    return Effect.tryPromise({
        try: async () => {
            const controller = new AbortController()
            const timeout = config.timeout ?? 30000
            const timeoutId = setTimeout(() => controller.abort(), timeout)

            try {
                const response = await fetch(url, {
                    ...options,
                    headers,
                    signal: controller.signal,
                })

                clearTimeout(timeoutId)

                const data = (await response.json()) as {
                    error_msg?: string
                    request_id?: string
                    error_code?: number
                } & T

                if (
                    !response.ok ||
                    (data.error_code && data.error_code !== 0)
                ) {
                    throw new HostexError({
                        message:
                            data.error_msg ??
                            `HTTP ${response.status}: ${response.statusText}`,
                        requestId: data.request_id ?? 'Unknown requestId',
                        errorCode:
                            data.error_code?.toString() ?? 'Unknown errorCode',
                    })
                }

                return data as T
            } catch (error) {
                clearTimeout(timeoutId)
                throw error
            }
        },
        catch: (error) => {
            if (error instanceof HostexError) {
                return error
            }
            return new HostexNetworkError({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Network request failed',
                cause: error,
            })
        },
    })
}

export const HostexServiceLive = Layer.effect(
    HostexService,
    Effect.gen(function* () {
        const config = yield* Config.all({
            accessToken: Config.string('HOSTEX_ACCESS_TOKEN'),
            baseUrl: Config.string('HOSTEX_BASE_URL').pipe(
                Config.withDefault('https://api.hostex.io/v3/')
            ),
            timeout: Config.number('HOSTEX_TIMEOUT').pipe(
                Config.withDefault(30000)
            ),
            sessionCookie: Config.string('HOSTEX_SESSION_COOKIE').pipe(
                Config.option
            ),
            privateApiBaseUrl: Config.string(
                'HOSTEX_PRIVATE_API_BASE_URL'
            ).pipe(Config.withDefault('https://hostex.io/api/bs')),
        }).pipe(
            Effect.catchAll(() =>
                Effect.die(
                    new HostexAuthError({
                        message: 'HOSTEX_ACCESS_TOKEN is required',
                    })
                )
            )
        )

        // Extract optional sessionCookie from Option
        const sessionCookie =
            config.sessionCookie._tag === 'Some'
                ? config.sessionCookie.value
                : undefined

        // Create final config with extracted sessionCookie
        const finalConfig: HostexConfig = {
            accessToken: config.accessToken,
            baseUrl: config.baseUrl,
            timeout: config.timeout,
            sessionCookie,
            privateApiBaseUrl: config.privateApiBaseUrl,
        }

        return {
            getProperties: () =>
                makeRequest<PropertiesResponse>(finalConfig, '/properties'),
            getRoomTypes: () =>
                makeRequest<RoomTypesResponse>(finalConfig, '/room_types'),
            getReservations: (params) => {
                const query = params
                    ? `?${new URLSearchParams(
                          Object.entries(params).reduce(
                              (acc, [key, value]) => {
                                  if (value !== undefined) {
                                      acc[key] = String(value)
                                  }
                                  return acc
                              },
                              {} as Record<string, string>
                          )
                      ).toString()}`
                    : ''

                return makeRequest<ReservationsResponse>(
                    finalConfig,
                    `/reservations${query}`
                ).pipe(Effect.map((response) => response.data.reservations))
            },
            createReservation: (input) =>
                makeRequest<CreateReservationResponse>(
                    finalConfig,
                    '/reservations',
                    {
                        method: 'POST',
                        body: JSON.stringify(input),
                    }
                ),
            cancelReservation: (code) =>
                makeRequest<{ success: boolean; requestId: string }>(
                    finalConfig,
                    `/reservations/${code}`,
                    { method: 'DELETE' }
                ),
            updateLockCode: (input) =>
                makeRequest<UpdateLockCodeResponse>(
                    finalConfig,
                    `/reservations/${input.reservation_code}/lock-code`,
                    {
                        method: 'PATCH',
                        body: JSON.stringify({ lock_code: input.lock_code }),
                    }
                ),
            getAvailabilities: (params) => {
                const query = new URLSearchParams(
                    Object.entries(params).reduce(
                        (acc, [key, value]) => {
                            if (value !== undefined) {
                                acc[key] = String(value)
                            }
                            return acc
                        },
                        {} as Record<string, string>
                    )
                ).toString()

                return makeRequest<AvailabilitiesResponse>(
                    finalConfig,
                    `/availabilities?${query}`
                )
            },
            updateAvailabilities: (input) =>
                makeRequest<UpdateAvailabilitiesResponse>(
                    finalConfig,
                    '/availabilities',
                    {
                        method: 'POST',
                        body: JSON.stringify(input),
                    }
                ),
            getListingCalendar: (input) =>
                makeRequest<ListingCalendarResponse>(
                    finalConfig,
                    '/listings/calendar',
                    {
                        method: 'POST',
                        body: JSON.stringify(input),
                    }
                ),
            updateListingInventories: (inputs) =>
                makeRequest<ListingUpdateResponse>(
                    finalConfig,
                    '/listings/inventories',
                    {
                        method: 'POST',
                        body: JSON.stringify({ updates: inputs }),
                    }
                ),
            updateListingPrices: (inputs) =>
                makeRequest<ListingUpdateResponse>(
                    finalConfig,
                    '/listings/prices',
                    {
                        method: 'POST',
                        body: JSON.stringify({ updates: inputs }),
                    }
                ),
            updateListingRestrictions: (inputs) =>
                makeRequest<ListingUpdateResponse>(
                    finalConfig,
                    '/listings/restrictions',
                    {
                        method: 'POST',
                        body: JSON.stringify({ updates: inputs }),
                    }
                ),
            getConversations: (page = 1, pageSize = 20) => {
                const offset = (page - 1) * pageSize
                const query = new URLSearchParams({
                    offset: String(offset),
                    limit: String(pageSize),
                }).toString()

                return makeRequest<{
                    request_id: string
                    error_code: number
                    error_msg: string
                    data: {
                        conversations: Array<{
                            id: string
                            channel_type: string
                            last_message_at: string
                            guest: {
                                name: string
                                phone: string | null
                                email: string
                            }
                            property_title: string
                            check_in_date: string
                            check_out_date: string
                        }>
                        total?: number
                    }
                }>(finalConfig, `/conversations?${query}`).pipe(
                    Effect.map((response) => ({
                        data: response.data.conversations.map((conv) => ({
                            id: conv.id,
                            reservationCode: undefined,
                            guestName: conv.guest.name,
                            propertyId: conv.property_title,
                            channel: conv.channel_type,
                            lastMessageAt: conv.last_message_at,
                            unreadCount: 0,
                        })),
                        total:
                            response.data.total ||
                            response.data.conversations.length,
                        page,
                        pageSize,
                        requestId: response.request_id,
                    }))
                )
            },
            getConversationDetails: (conversationId) =>
                makeRequest<{
                    request_id: string
                    error_code: number
                    error_msg: string
                    data?: {
                        id: string
                        channel_type: string
                        last_message_at?: string
                        guest: {
                            name: string
                            phone: string | null
                            email: string
                        }
                        property_title?: string
                        check_in_date?: string
                        check_out_date?: string
                        messages: Array<{
                            id: string
                            sender_role: 'host' | 'guest'
                            display_type: string
                            content: string
                            attachment: string | null
                            created_at: string
                        }>
                    }
                }>(finalConfig, `/conversations/${conversationId}`).pipe(
                    Effect.flatMap((response) => {
                        if (!response.data || !response.data.messages) {
                            return Effect.fail(
                                new HostexError({
                                    message: `Invalid response structure for conversation ${conversationId}`,
                                    requestId: response.request_id,
                                    errorCode: String(response.error_code),
                                })
                            )
                        }
                        const conv = response.data
                        const msgs = response.data.messages
                        return Effect.succeed({
                            data: {
                                conversation: {
                                    id: conv.id,
                                    reservationCode: undefined,
                                    guestName: conv.guest.name,
                                    propertyId: conv.property_title || '',
                                    channel: conv.channel_type,
                                    lastMessageAt:
                                        conv.last_message_at ||
                                        new Date().toISOString(),
                                    unreadCount: 0,
                                },
                                messages: msgs.map((msg) => ({
                                    id: msg.id,
                                    conversationId: conv.id,
                                    content: msg.content,
                                    sentBy: msg.sender_role,
                                    sentAt: msg.created_at,
                                    messageType:
                                        msg.display_type === 'Text'
                                            ? ('text' as const)
                                            : ('image' as const),
                                    imageUrl: msg.attachment || undefined,
                                })),
                            },
                            requestId: response.request_id,
                        })
                    })
                ),
            sendMessage: (input) =>
                makeRequest<SendMessageResponse>(
                    finalConfig,
                    `/conversations/${input.conversationId}`,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            content: input.content,
                            messageType: input.messageType ?? 'text',
                            imageUrl: input.imageUrl,
                        }),
                    }
                ),
            getReviews: (params) => {
                const query = params
                    ? `?${new URLSearchParams(
                          Object.entries(params).reduce(
                              (acc, [key, value]) => {
                                  if (value !== undefined) {
                                      acc[key] = String(value)
                                  }
                                  return acc
                              },
                              {} as Record<string, string>
                          )
                      ).toString()}`
                    : ''

                return makeRequest<ReviewsResponse>(
                    finalConfig,
                    `/reviews${query}`
                )
            },
            createReview: (input) =>
                makeRequest<CreateReviewResponse>(
                    finalConfig,
                    `/reviews/${input.reservationCode}`,
                    {
                        method: 'POST',
                        body: JSON.stringify(input),
                    }
                ),
            getWebhooks: () =>
                makeRequest<{
                    data: { webhooks: Webhook[] }
                    request_id: string
                }>(finalConfig, '/webhooks').pipe(
                    Effect.map((response) => ({
                        data: response.data.webhooks,
                        requestId: response.request_id,
                    }))
                ),
            createWebhook: (input) =>
                makeRequest<CreateWebhookResponse>(finalConfig, '/webhooks', {
                    method: 'POST',
                    body: JSON.stringify(input),
                }),
            deleteWebhook: (webhookId) =>
                makeRequest<{ success: boolean; requestId: string }>(
                    finalConfig,
                    `/webhooks/${webhookId}`,
                    { method: 'DELETE' }
                ),
            registerWebhook: (webhookUrl, events) =>
                Effect.gen(function* () {
                    // Helper to get webhooks list
                    const getWebhooksList = () =>
                        makeRequest<{
                            data: { webhooks: Webhook[] }
                            request_id: string
                        }>(finalConfig, '/webhooks').pipe(
                            Effect.map((res) => res.data.webhooks)
                        )

                    // Check if webhook already exists
                    const webhooks = yield* getWebhooksList()
                    const existing = webhooks.find(
                        (wh) => wh.url === webhookUrl && wh.active
                    )

                    if (existing) {
                        yield* Effect.logDebug('Found existing webhook').pipe(
                            Effect.annotateLogs(
                                'webhook',
                                JSON.stringify(existing)
                            )
                        )
                        return existing
                    }

                    // Try to create new webhook, handling "already exists" gracefully
                    return yield* makeRequest<CreateWebhookResponse>(
                        finalConfig,
                        '/webhooks',
                        {
                            method: 'POST',
                            body: JSON.stringify({ url: webhookUrl, events }),
                        }
                    ).pipe(
                        Effect.flatMap((response) => {
                            if (response.data?.webhook) {
                                return Effect.succeed(response.data.webhook)
                            }
                            // Handle error response from API
                            const errorResponse = response as unknown as {
                                error_msg?: string
                                error_code?: number
                                request_id?: string
                            }
                            return Effect.fail(
                                new HostexError({
                                    message:
                                        errorResponse.error_msg ??
                                        'Failed to create webhook',
                                    requestId:
                                        errorResponse.request_id ?? 'unknown',
                                    errorCode: String(
                                        errorResponse.error_code ??
                                            'WEBHOOK_CREATE_FAILED'
                                    ),
                                })
                            )
                        }),
                        Effect.catchAll((error) =>
                            // If already exists, refetch and return
                            error instanceof HostexError &&
                            error.message.includes('already exists')
                                ? getWebhooksList().pipe(
                                      Effect.flatMap((webhooks) => {
                                          const existing = webhooks.find(
                                              (wh) => wh.url === webhookUrl
                                          )
                                          return existing
                                              ? Effect.logDebug(
                                                    'Found webhook after "already exists" error'
                                                ).pipe(
                                                    Effect.annotateLogs(
                                                        'webhook',
                                                        JSON.stringify(existing)
                                                    ),
                                                    Effect.flatMap(() =>
                                                        Effect.succeed(existing)
                                                    )
                                                )
                                              : Effect.fail(error)
                                      })
                                  )
                                : Effect.fail(error)
                        )
                    )
                }),
            getVouchers: (input) => {
                const query = new URLSearchParams(
                    Object.entries({
                        thirdparty_account_id: input.thirdparty_account_id,
                        page: String(input.page ?? 1),
                        page_size: String(input.page_size ?? 1000),
                        opid: '117892',
                        opclient: 'Web-Mac-Chrome',
                    })
                ).toString()

                return makePrivateRequest<GetVouchersResponse>(
                    finalConfig,
                    `/promotion_code/list?${query}`
                )
            },
            createVoucher: (input) =>
                makePrivateRequest<CreateVoucherResponse>(
                    finalConfig,
                    '/promotion_code/create?opid=117892&opclient=Web-Mac-Chrome',
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            ...input,
                            // Odoo will define as "false", but Hostex only allows null or ISO string
                            expired_at: input.expired_at
                                ? new Date(input.expired_at).toISOString()
                                : null,
                        }),
                    }
                ),
            deleteVoucher: (input) =>
                makePrivateRequest<DeleteVoucherResponse>(
                    finalConfig,
                    '/promotion_code/delete?opid=117892&opclient=Web-Mac-Chrome',
                    {
                        method: 'POST',
                        body: JSON.stringify(input),
                    }
                ),
        }
    })
)

export const makeHostexServiceLayer = (
    config: HostexConfig
): Layer.Layer<HostexService> =>
    Layer.succeed(HostexService, {
        getProperties: () =>
            makeRequest<PropertiesResponse>(config, '/properties'),
        getRoomTypes: () =>
            makeRequest<RoomTypesResponse>(config, '/room_types'),
        getReservations: (params) => {
            const query = params
                ? `?${new URLSearchParams(
                      Object.entries(params).reduce(
                          (acc, [key, value]) => {
                              if (value !== undefined) {
                                  acc[key] = String(value)
                              }
                              return acc
                          },
                          {} as Record<string, string>
                      )
                  ).toString()}`
                : ''

            return makeRequest<ReservationsResponse>(
                config,
                `/reservations${query}`
            ).pipe(Effect.map((response) => response.data.reservations))
        },
        createReservation: (input) =>
            makeRequest<CreateReservationResponse>(config, '/reservations', {
                method: 'POST',
                body: JSON.stringify(input),
            }),
        cancelReservation: (code) =>
            makeRequest<{ success: boolean; requestId: string }>(
                config,
                `/reservations/${code}`,
                { method: 'DELETE' }
            ),
        updateLockCode: (input) =>
            makeRequest<UpdateLockCodeResponse>(
                config,
                `/reservations/${input.reservation_code}/lock-code`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ lock_code: input.lock_code }),
                }
            ),
        getAvailabilities: (params) => {
            const query = new URLSearchParams(
                Object.entries(params).reduce(
                    (acc, [key, value]) => {
                        if (value !== undefined) {
                            acc[key] = String(value)
                        }
                        return acc
                    },
                    {} as Record<string, string>
                )
            ).toString()

            return makeRequest<AvailabilitiesResponse>(
                config,
                `/availabilities?${query}`
            )
        },
        updateAvailabilities: (input) =>
            makeRequest<UpdateAvailabilitiesResponse>(
                config,
                '/availabilities',
                {
                    method: 'POST',
                    body: JSON.stringify(input),
                }
            ),
        getListingCalendar: (input) =>
            makeRequest<ListingCalendarResponse>(config, '/listings/calendar', {
                method: 'POST',
                body: JSON.stringify(input),
            }),
        updateListingInventories: (inputs) =>
            makeRequest<ListingUpdateResponse>(
                config,
                '/listings/inventories',
                {
                    method: 'POST',
                    body: JSON.stringify({ updates: inputs }),
                }
            ),
        updateListingPrices: (inputs) =>
            makeRequest<ListingUpdateResponse>(config, '/listings/prices', {
                method: 'POST',
                body: JSON.stringify({ updates: inputs }),
            }),
        updateListingRestrictions: (inputs) =>
            makeRequest<ListingUpdateResponse>(
                config,
                '/listings/restrictions',
                {
                    method: 'POST',
                    body: JSON.stringify({ updates: inputs }),
                }
            ),
        getConversations: (page = 1, pageSize = 20) => {
            const offset = (page - 1) * pageSize
            const query = new URLSearchParams({
                offset: String(offset),
                limit: String(pageSize),
            }).toString()

            return makeRequest<{
                request_id: string
                error_code: number
                error_msg: string
                data: {
                    conversations: Array<{
                        id: string
                        channel_type: string
                        last_message_at: string
                        guest: {
                            name: string
                            phone: string | null
                            email: string
                        }
                        property_title: string
                        check_in_date: string
                        check_out_date: string
                    }>
                    total?: number
                }
            }>(config, `/conversations?${query}`).pipe(
                Effect.map((response) => ({
                    data: response.data.conversations.map((conv) => ({
                        id: conv.id,
                        reservationCode: undefined,
                        guestName: conv.guest.name,
                        propertyId: conv.property_title,
                        channel: conv.channel_type,
                        lastMessageAt: conv.last_message_at,
                        unreadCount: 0,
                    })),
                    total:
                        response.data.total ||
                        response.data.conversations.length,
                    page,
                    pageSize,
                    requestId: response.request_id,
                }))
            )
        },
        getConversationDetails: (conversationId) =>
            makeRequest<{
                request_id: string
                error_code: number
                error_msg: string
                data?: {
                    id: string
                    channel_type: string
                    last_message_at?: string
                    guest: {
                        name: string
                        phone: string | null
                        email: string
                    }
                    property_title?: string
                    check_in_date?: string
                    check_out_date?: string
                    messages: Array<{
                        id: string
                        sender_role: 'host' | 'guest'
                        display_type: string
                        content: string
                        attachment: string | null
                        created_at: string
                    }>
                }
            }>(config, `/conversations/${conversationId}`).pipe(
                Effect.flatMap((response) => {
                    if (!response.data || !response.data.messages) {
                        return Effect.fail(
                            new HostexError({
                                message: `Invalid response structure for conversation ${conversationId}`,
                                requestId: response.request_id,
                                errorCode: String(response.error_code),
                            })
                        )
                    }
                    const conv = response.data
                    const msgs = response.data.messages
                    return Effect.succeed({
                        data: {
                            conversation: {
                                id: conv.id,
                                reservationCode: undefined,
                                guestName: conv.guest.name,
                                propertyId: conv.property_title || '',
                                channel: conv.channel_type,
                                lastMessageAt:
                                    conv.last_message_at ||
                                    new Date().toISOString(),
                                unreadCount: 0,
                            },
                            messages: msgs.map((msg) => ({
                                id: msg.id,
                                conversationId: conv.id,
                                content: msg.content,
                                sentBy: msg.sender_role,
                                sentAt: msg.created_at,
                                messageType:
                                    msg.display_type === 'Text'
                                        ? ('text' as const)
                                        : ('image' as const),
                                imageUrl: msg.attachment || undefined,
                            })),
                        },
                        requestId: response.request_id,
                    })
                })
            ),
        sendMessage: (input) =>
            makeRequest<SendMessageResponse>(
                config,
                `/conversations/${input.conversationId}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        content: input.content,
                        messageType: input.messageType ?? 'text',
                        imageUrl: input.imageUrl,
                    }),
                }
            ),
        getReviews: (params) => {
            const query = params
                ? `?${new URLSearchParams(
                      Object.entries(params).reduce(
                          (acc, [key, value]) => {
                              if (value !== undefined) {
                                  acc[key] = String(value)
                              }
                              return acc
                          },
                          {} as Record<string, string>
                      )
                  ).toString()}`
                : ''

            return makeRequest<ReviewsResponse>(config, `/reviews${query}`)
        },
        createReview: (input) =>
            makeRequest<CreateReviewResponse>(
                config,
                `/reviews/${input.reservationCode}`,
                {
                    method: 'POST',
                    body: JSON.stringify(input),
                }
            ),
        getWebhooks: () =>
            makeRequest<{ data: { webhooks: Webhook[] }; request_id: string }>(
                config,
                '/webhooks'
            ).pipe(
                Effect.map((response) => ({
                    data: response.data.webhooks,
                    requestId: response.request_id,
                }))
            ),
        createWebhook: (input) =>
            makeRequest<CreateWebhookResponse>(config, '/webhooks', {
                method: 'POST',
                body: JSON.stringify(input),
            }),
        deleteWebhook: (webhookId) =>
            makeRequest<{ success: boolean; requestId: string }>(
                config,
                `/webhooks/${webhookId}`,
                { method: 'DELETE' }
            ),
        registerWebhook: (webhookUrl, events) =>
            Effect.gen(function* () {
                // Helper to get webhooks list
                const getWebhooksList = () =>
                    makeRequest<{
                        data: { webhooks: Webhook[] }
                        request_id: string
                    }>(config, '/webhooks').pipe(
                        Effect.map((res) => res.data.webhooks)
                    )

                // Check if webhook already exists
                const webhooks = yield* getWebhooksList()
                const existing = webhooks.find(
                    (wh) => wh.url === webhookUrl && wh.active
                )

                if (existing) {
                    yield* Effect.logDebug('Found existing webhook').pipe(
                        Effect.annotateLogs('webhook', JSON.stringify(existing))
                    )
                    return existing
                }

                // Try to create new webhook, handling "already exists" gracefully
                return yield* makeRequest<CreateWebhookResponse>(
                    config,
                    '/webhooks',
                    {
                        method: 'POST',
                        body: JSON.stringify({ url: webhookUrl, events }),
                    }
                ).pipe(
                    Effect.flatMap((response) => {
                        if (response.data?.webhook) {
                            return Effect.succeed(response.data.webhook)
                        }
                        // Handle error response from API
                        const errorResponse = response as unknown as {
                            error_msg?: string
                            error_code?: number
                            request_id?: string
                        }
                        return Effect.fail(
                            new HostexError({
                                message:
                                    errorResponse.error_msg ??
                                    'Failed to create webhook',
                                requestId:
                                    errorResponse.request_id ?? 'unknown',
                                errorCode: String(
                                    errorResponse.error_code ??
                                        'WEBHOOK_CREATE_FAILED'
                                ),
                            })
                        )
                    }),
                    Effect.catchAll((error) =>
                        // If already exists, refetch and return
                        error instanceof HostexError &&
                        error.message.includes('already exists')
                            ? getWebhooksList().pipe(
                                  Effect.flatMap((webhooks) => {
                                      const existing = webhooks.find(
                                          (wh) => wh.url === webhookUrl
                                      )
                                      return existing
                                          ? Effect.logDebug(
                                                'Found webhook after "already exists" error'
                                            ).pipe(
                                                Effect.annotateLogs(
                                                    'webhook',
                                                    JSON.stringify(existing)
                                                ),
                                                Effect.flatMap(() =>
                                                    Effect.succeed(existing)
                                                )
                                            )
                                          : Effect.fail(error)
                                  })
                              )
                            : Effect.fail(error)
                    )
                )
            }),
        getVouchers: (input) => {
            const query = new URLSearchParams(
                Object.entries({
                    thirdparty_account_id: input.thirdparty_account_id,
                    page: String(input.page ?? 1),
                    page_size: String(input.page_size ?? 1000),
                    opid: '117892',
                    opclient: 'Web-Mac-Chrome',
                })
            ).toString()

            return makePrivateRequest<GetVouchersResponse>(
                config,
                `/promotion_code/list?${query}`
            )
        },
        createVoucher: (input) =>
            makePrivateRequest<CreateVoucherResponse>(
                config,
                '/promotion_code/create?opid=117892&opclient=Web-Mac-Chrome',
                {
                    method: 'POST',
                    body: JSON.stringify(input),
                }
            ),
        deleteVoucher: (input) =>
            makePrivateRequest<DeleteVoucherResponse>(
                config,
                '/promotion_code/delete?opid=117892&opclient=Web-Mac-Chrome',
                {
                    method: 'POST',
                    body: JSON.stringify(input),
                }
            ),
    })

export {
    generateCheckInOutEvents,
    generateDescriptionForReservation,
    generateFullDayEvents,
    generateGuestEmojis,
    generateTitleForReservation,
    type PropertyTimeConfig,
    ReservationProcessingError,
} from './helpers'
