import { Config, Context, Effect, Layer } from 'effect'

import {
    type AppendBlockChildrenInput,
    type Block,
    type Comment,
    type CreateCommentInput,
    type CreateDatabaseInput,
    type CreatePageInput,
    type Database,
    type ListBlockChildrenResponse,
    type ListCommentsParams,
    type ListCommentsResponse,
    type ListUsersResponse,
    NotionAuthError,
    type NotionConfig,
    NotionError,
    NotionNetworkError,
    type Page,
    type QueryDatabaseParams,
    type QueryDatabaseResponse,
    type SearchParams,
    type SearchResponse,
    type UpdateDatabaseInput,
    type UpdatePageInput,
    type User,
} from './types'

/**
 * Notion API Service
 *
 * A comprehensive Effect-based service for interacting with the Notion API v2022-06-28
 * Documentation: https://developers.notion.com/reference/intro
 */

// Re-export all types
export * from './types'

export class NotionService extends Context.Tag('NotionService')<
    NotionService,
    {
        // Database operations
        readonly queryDatabase: (
            databaseId: string,
            params?: QueryDatabaseParams
        ) => Effect.Effect<
            QueryDatabaseResponse,
            NotionError | NotionNetworkError
        >
        readonly retrieveDatabase: (
            databaseId: string
        ) => Effect.Effect<Database, NotionError | NotionNetworkError>
        readonly createDatabase: (
            input: CreateDatabaseInput
        ) => Effect.Effect<Database, NotionError | NotionNetworkError>
        readonly updateDatabase: (
            databaseId: string,
            input: UpdateDatabaseInput
        ) => Effect.Effect<Database, NotionError | NotionNetworkError>

        // Page operations
        readonly retrievePage: (
            pageId: string
        ) => Effect.Effect<Page, NotionError | NotionNetworkError>
        readonly createPage: (
            input: CreatePageInput
        ) => Effect.Effect<Page, NotionError | NotionNetworkError>
        readonly updatePage: (
            pageId: string,
            input: UpdatePageInput
        ) => Effect.Effect<Page, NotionError | NotionNetworkError>
        readonly archivePage: (
            pageId: string
        ) => Effect.Effect<Page, NotionError | NotionNetworkError>

        // Block operations
        readonly retrieveBlock: (
            blockId: string
        ) => Effect.Effect<Block, NotionError | NotionNetworkError>
        readonly retrieveBlockChildren: (
            blockId: string,
            startCursor?: string,
            pageSize?: number
        ) => Effect.Effect<
            ListBlockChildrenResponse,
            NotionError | NotionNetworkError
        >
        readonly appendBlockChildren: (
            blockId: string,
            input: AppendBlockChildrenInput
        ) => Effect.Effect<
            ListBlockChildrenResponse,
            NotionError | NotionNetworkError
        >
        readonly deleteBlock: (
            blockId: string
        ) => Effect.Effect<Block, NotionError | NotionNetworkError>

        // User operations
        readonly retrieveUser: (
            userId: string
        ) => Effect.Effect<User, NotionError | NotionNetworkError>
        readonly listUsers: (
            startCursor?: string,
            pageSize?: number
        ) => Effect.Effect<ListUsersResponse, NotionError | NotionNetworkError>
        readonly retrieveBotUser: () => Effect.Effect<
            User,
            NotionError | NotionNetworkError
        >

        // Search
        readonly search: (
            params?: SearchParams
        ) => Effect.Effect<SearchResponse, NotionError | NotionNetworkError>

        // Comments
        readonly listComments: (
            params: ListCommentsParams
        ) => Effect.Effect<
            ListCommentsResponse,
            NotionError | NotionNetworkError
        >
        readonly createComment: (
            input: CreateCommentInput
        ) => Effect.Effect<Comment, NotionError | NotionNetworkError>
    }
>() {}

const makeRequest = <T>(
    config: NotionConfig,
    endpoint: string,
    options: RequestInit = {}
): Effect.Effect<T, NotionError | NotionNetworkError> => {
    const baseUrl = config.baseUrl ?? 'https://api.notion.com'
    const version = config.version ?? '2022-06-28'
    const url = `${baseUrl}${endpoint}`

    const headers = {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
        'Notion-Version': version,
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

                const data = (await response.json()) as
                    | (T & { object?: string; code?: string; message?: string })
                    | {
                          object: 'error'
                          status: number
                          code: string
                          message: string
                      }

                if (!response.ok) {
                    if ('object' in data && data.object === 'error') {
                        const errorData = data as {
                            object: 'error'
                            status: number
                            code: string
                            message: string
                        }
                        throw new NotionError({
                            message:
                                errorData.message ||
                                `HTTP ${response.status}: ${response.statusText}`,
                            code: errorData.code,
                            status: errorData.status,
                        })
                    }
                    throw new NotionError({
                        message: `HTTP ${response.status}: ${response.statusText}`,
                        status: response.status,
                    })
                }

                return data as T
            } catch (error) {
                clearTimeout(timeoutId)
                throw error
            }
        },
        catch: (error) => {
            if (error instanceof NotionError) {
                return error
            }
            return new NotionNetworkError({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Network request failed',
                cause: error,
            })
        },
    })
}

export const NotionServiceLive = Layer.effect(
    NotionService,
    Effect.gen(function* () {
        const config = yield* Config.all({
            token: Config.string('NOTION_TOKEN'),
            baseUrl: Config.string('NOTION_BASE_URL').pipe(
                Config.withDefault('https://api.notion.com')
            ),
            version: Config.string('NOTION_VERSION').pipe(
                Config.withDefault('2022-06-28')
            ),
            timeout: Config.number('NOTION_TIMEOUT').pipe(
                Config.withDefault(30000)
            ),
        }).pipe(
            Effect.catchAll(() =>
                Effect.die(
                    new NotionAuthError({
                        message: 'NOTION_TOKEN is required',
                    })
                )
            )
        )

        return makeNotionServiceImplementation(config)
    })
)

export const makeNotionServiceLayer = (
    config: NotionConfig
): Layer.Layer<NotionService> =>
    Layer.succeed(NotionService, makeNotionServiceImplementation(config))

const makeNotionServiceImplementation = (config: NotionConfig) => ({
    // Database operations
    queryDatabase: (databaseId: string, params?: QueryDatabaseParams) =>
        makeRequest<QueryDatabaseResponse>(
            config,
            `/v1/databases/${databaseId}/query`,
            {
                method: 'POST',
                body: JSON.stringify(params || {}),
            }
        ),
    retrieveDatabase: (databaseId: string) =>
        makeRequest<Database>(config, `/v1/databases/${databaseId}`),
    createDatabase: (input: CreateDatabaseInput) =>
        makeRequest<Database>(config, '/v1/databases', {
            method: 'POST',
            body: JSON.stringify(input),
        }),
    updateDatabase: (databaseId: string, input: UpdateDatabaseInput) =>
        makeRequest<Database>(config, `/v1/databases/${databaseId}`, {
            method: 'PATCH',
            body: JSON.stringify(input),
        }),

    // Page operations
    retrievePage: (pageId: string) =>
        makeRequest<Page>(config, `/v1/pages/${pageId}`),
    createPage: (input: CreatePageInput) =>
        makeRequest<Page>(config, '/v1/pages', {
            method: 'POST',
            body: JSON.stringify(input),
        }),
    updatePage: (pageId: string, input: UpdatePageInput) =>
        makeRequest<Page>(config, `/v1/pages/${pageId}`, {
            method: 'PATCH',
            body: JSON.stringify(input),
        }),
    archivePage: (pageId: string) =>
        makeRequest<Page>(config, `/v1/pages/${pageId}`, {
            method: 'PATCH',
            body: JSON.stringify({ archived: true }),
        }),

    // Block operations
    retrieveBlock: (blockId: string) =>
        makeRequest<Block>(config, `/v1/blocks/${blockId}`),
    retrieveBlockChildren: (
        blockId: string,
        startCursor?: string,
        pageSize?: number
    ) => {
        const params = new URLSearchParams()
        if (startCursor) params.set('start_cursor', startCursor)
        if (pageSize) params.set('page_size', String(pageSize))
        const query = params.toString() ? `?${params.toString()}` : ''

        return makeRequest<ListBlockChildrenResponse>(
            config,
            `/v1/blocks/${blockId}/children${query}`
        )
    },
    appendBlockChildren: (blockId: string, input: AppendBlockChildrenInput) =>
        makeRequest<ListBlockChildrenResponse>(
            config,
            `/v1/blocks/${blockId}/children`,
            {
                method: 'PATCH',
                body: JSON.stringify(input),
            }
        ),
    deleteBlock: (blockId: string) =>
        makeRequest<Block>(config, `/v1/blocks/${blockId}`, {
            method: 'DELETE',
        }),

    // User operations
    retrieveUser: (userId: string) =>
        makeRequest<User>(config, `/v1/users/${userId}`),
    listUsers: (startCursor?: string, pageSize?: number) => {
        const params = new URLSearchParams()
        if (startCursor) params.set('start_cursor', startCursor)
        if (pageSize) params.set('page_size', String(pageSize))
        const query = params.toString() ? `?${params.toString()}` : ''

        return makeRequest<ListUsersResponse>(config, `/v1/users${query}`)
    },
    retrieveBotUser: () => makeRequest<User>(config, '/v1/users/me'),

    // Search
    search: (params?: SearchParams) =>
        makeRequest<SearchResponse>(config, '/v1/search', {
            method: 'POST',
            body: JSON.stringify(params || {}),
        }),

    // Comments
    listComments: (params: ListCommentsParams) => {
        const urlParams = new URLSearchParams({
            block_id: params.block_id,
        })
        if (params.start_cursor)
            urlParams.set('start_cursor', params.start_cursor)
        if (params.page_size)
            urlParams.set('page_size', String(params.page_size))

        return makeRequest<ListCommentsResponse>(
            config,
            `/v1/comments?${urlParams.toString()}`
        )
    },
    createComment: (input: CreateCommentInput) =>
        makeRequest<Comment>(config, '/v1/comments', {
            method: 'POST',
            body: JSON.stringify(input),
        }),
})

export { generateRichText, generateSimpleRichText } from './helpers'
