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
    type CreateWebhookInput,
    type CreateWebhookResponse,
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

                console.log('response', response)
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
        }).pipe(
            Effect.catchAll(() =>
                Effect.die(
                    new HostexAuthError({
                        message: 'HOSTEX_ACCESS_TOKEN is required',
                    })
                )
            )
        )

        return {
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
                makeRequest<CreateReservationResponse>(
                    config,
                    '/reservations',
                    {
                        method: 'POST',
                        body: JSON.stringify(input),
                    }
                ),
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
                makeRequest<ListingCalendarResponse>(
                    config,
                    '/listings/calendar',
                    {
                        method: 'POST',
                        body: JSON.stringify(input),
                    }
                ),
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
                const query = new URLSearchParams({
                    page: String(page),
                    pageSize: String(pageSize),
                }).toString()

                return makeRequest<ConversationsResponse>(
                    config,
                    `/conversations?${query}`
                )
            },
            getConversationDetails: (conversationId) =>
                makeRequest<ConversationDetailsResponse>(
                    config,
                    `/conversations/${conversationId}`
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
                makeRequest<WebhooksResponse>(config, '/webhooks'),
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
            const query = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
            }).toString()

            return makeRequest<ConversationsResponse>(
                config,
                `/conversations?${query}`
            )
        },
        getConversationDetails: (conversationId) =>
            makeRequest<ConversationDetailsResponse>(
                config,
                `/conversations/${conversationId}`
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
        getWebhooks: () => makeRequest<WebhooksResponse>(config, '/webhooks'),
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
