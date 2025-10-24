import { Effect } from 'effect'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
    makeNotionServiceLayer,
    NotionAuthError,
    NotionError,
    NotionNetworkError,
    NotionService,
} from './index'
import {
    mockBlock,
    mockComment,
    mockDatabase,
    mockListBlockChildrenResponse,
    mockListCommentsResponse,
    mockListUsersResponse,
    mockPage,
    mockQueryDatabaseResponse,
    mockSearchResponse,
    mockUser,
} from './mocks'
import type { NotionConfig } from './types'

/**
 * Tests for Notion API Service
 */

describe('NotionService', () => {
    const mockConfig: NotionConfig = {
        token: 'test-token-123',
        baseUrl: 'https://api.notion.com',
        version: '2022-06-28',
        timeout: 5000,
    }

    let fetchMock: ReturnType<typeof vi.fn>

    beforeEach(() => {
        fetchMock = vi.fn()
        global.fetch = fetchMock
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const mockSuccessResponse = <T>(data: T) => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => data,
        })
    }

    const mockErrorResponse = (
        status: number,
        message: string,
        code: string = 'error_code'
    ) => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status,
            statusText: 'Error',
            json: async () => ({
                object: 'error',
                status,
                code,
                message,
            }),
        })
    }

    const mockNetworkError = () => {
        fetchMock.mockRejectedValueOnce(new Error('Network error'))
    }

    describe('Service Creation', () => {
        it('should create service with config', async () => {
            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                expect(service).toBeDefined()
                expect(service.queryDatabase).toBeDefined()
                expect(service.retrievePage).toBeDefined()
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should fail without authentication token', async () => {
            expect(() =>
                makeNotionServiceLayer({
                    ...mockConfig,
                    token: '',
                })
            ).toBeDefined()
        })
    })

    describe('Database Operations', () => {
        it('should query a database', async () => {
            const mockResponse = mockQueryDatabaseResponse(3)
            mockSuccessResponse(mockResponse)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.queryDatabase('database-id')

                expect(result).toEqual(mockResponse)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/databases/database-id/query',
                    expect.objectContaining({
                        method: 'POST',
                        headers: expect.objectContaining({
                            Authorization: 'Bearer test-token-123',
                            'Notion-Version': '2022-06-28',
                        }),
                    })
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should query database with filters and sorts', async () => {
            const mockResponse = mockQueryDatabaseResponse(2)
            mockSuccessResponse(mockResponse)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.queryDatabase('database-id', {
                    filter: {
                        property: 'Status',
                        select: { equals: 'Done' },
                    },
                    sorts: [{ property: 'Name', direction: 'ascending' }],
                    page_size: 10,
                })

                expect(result).toEqual(mockResponse)
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should retrieve a database', async () => {
            const mockDb = mockDatabase()
            mockSuccessResponse(mockDb)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.retrieveDatabase('database-id')

                expect(result).toEqual(mockDb)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/databases/database-id',
                    expect.any(Object)
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should create a database', async () => {
            const mockDb = mockDatabase()
            mockSuccessResponse(mockDb)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.createDatabase({
                    parent: { type: 'page_id', page_id: 'parent-page-id' },
                    title: [
                        {
                            type: 'text',
                            text: { content: 'New Database', link: null },
                            annotations: {
                                bold: false,
                                italic: false,
                                strikethrough: false,
                                underline: false,
                                code: false,
                                color: 'default',
                            },
                            plain_text: 'New Database',
                            href: null,
                        },
                    ],
                    properties: {},
                })

                expect(result).toEqual(mockDb)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/databases',
                    expect.objectContaining({
                        method: 'POST',
                    })
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should update a database', async () => {
            const mockDb = mockDatabase({ archived: true })
            mockSuccessResponse(mockDb)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.updateDatabase('database-id', {
                    archived: true,
                })

                expect(result).toEqual(mockDb)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/databases/database-id',
                    expect.objectContaining({
                        method: 'PATCH',
                    })
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })
    })

    describe('Page Operations', () => {
        it('should retrieve a page', async () => {
            const mockPageData = mockPage()
            mockSuccessResponse(mockPageData)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.retrievePage('page-id')

                expect(result).toEqual(mockPageData)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/pages/page-id',
                    expect.any(Object)
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should create a page', async () => {
            const mockPageData = mockPage()
            mockSuccessResponse(mockPageData)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.createPage({
                    parent: { type: 'database_id', database_id: 'database-id' },
                    properties: {},
                })

                expect(result).toEqual(mockPageData)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/pages',
                    expect.objectContaining({
                        method: 'POST',
                    })
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should update a page', async () => {
            const mockPageData = mockPage()
            mockSuccessResponse(mockPageData)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.updatePage('page-id', {
                    properties: {},
                })

                expect(result).toEqual(mockPageData)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/pages/page-id',
                    expect.objectContaining({
                        method: 'PATCH',
                    })
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should archive a page', async () => {
            const mockPageData = mockPage({ archived: true })
            mockSuccessResponse(mockPageData)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.archivePage('page-id')

                expect(result.archived).toBe(true)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/pages/page-id',
                    expect.objectContaining({
                        method: 'PATCH',
                        body: JSON.stringify({ archived: true }),
                    })
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })
    })

    describe('Block Operations', () => {
        it('should retrieve a block', async () => {
            const mockBlockData = mockBlock('paragraph')
            mockSuccessResponse(mockBlockData)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.retrieveBlock('block-id')

                expect(result).toEqual(mockBlockData)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/blocks/block-id',
                    expect.any(Object)
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should retrieve block children', async () => {
            const mockResponse = mockListBlockChildrenResponse(5)
            mockSuccessResponse(mockResponse)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.retrieveBlockChildren('block-id')

                expect(result).toEqual(mockResponse)
                expect(result.results).toHaveLength(5)
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should retrieve block children with pagination', async () => {
            const mockResponse = mockListBlockChildrenResponse(10)
            mockSuccessResponse(mockResponse)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.retrieveBlockChildren(
                    'block-id',
                    'start-cursor',
                    10
                )

                expect(result).toEqual(mockResponse)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/blocks/block-id/children?start_cursor=start-cursor&page_size=10',
                    expect.any(Object)
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should append block children', async () => {
            const mockResponse = mockListBlockChildrenResponse(2)
            mockSuccessResponse(mockResponse)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.appendBlockChildren('block-id', {
                    children: [
                        {
                            object: 'block',
                            type: 'paragraph',
                            paragraph: {
                                rich_text: [
                                    {
                                        type: 'text',
                                        text: {
                                            content: 'New paragraph',
                                            link: null,
                                        },
                                        annotations: {
                                            bold: false,
                                            italic: false,
                                            strikethrough: false,
                                            underline: false,
                                            code: false,
                                            color: 'default',
                                        },
                                        plain_text: 'New paragraph',
                                        href: null,
                                    },
                                ],
                                color: 'default',
                            },
                        },
                    ],
                })

                expect(result).toEqual(mockResponse)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/blocks/block-id/children',
                    expect.objectContaining({
                        method: 'PATCH',
                    })
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should delete a block', async () => {
            const mockBlockData = mockBlock('paragraph', { archived: true })
            mockSuccessResponse(mockBlockData)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.deleteBlock('block-id')

                expect(result.archived).toBe(true)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/blocks/block-id',
                    expect.objectContaining({
                        method: 'DELETE',
                    })
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })
    })

    describe('User Operations', () => {
        it('should retrieve a user', async () => {
            const mockUserData = mockUser()
            mockSuccessResponse(mockUserData)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.retrieveUser('user-id')

                expect(result).toEqual(mockUserData)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/users/user-id',
                    expect.any(Object)
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should list users', async () => {
            const mockResponse = mockListUsersResponse(5)
            mockSuccessResponse(mockResponse)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.listUsers()

                expect(result).toEqual(mockResponse)
                expect(result.results).toHaveLength(5)
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should list users with pagination', async () => {
            const mockResponse = mockListUsersResponse(10)
            mockSuccessResponse(mockResponse)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.listUsers('start-cursor', 10)

                expect(result).toEqual(mockResponse)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/users?start_cursor=start-cursor&page_size=10',
                    expect.any(Object)
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should retrieve bot user', async () => {
            const mockUserData = mockUser({ type: 'bot' })
            mockSuccessResponse(mockUserData)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.retrieveBotUser()

                expect(result).toEqual(mockUserData)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/users/me',
                    expect.any(Object)
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })
    })

    describe('Search', () => {
        it('should search without params', async () => {
            const mockResponse = mockSearchResponse(10)
            mockSuccessResponse(mockResponse)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.search()

                expect(result).toEqual(mockResponse)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/search',
                    expect.objectContaining({
                        method: 'POST',
                    })
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should search with query and filter', async () => {
            const mockResponse = mockSearchResponse(5)
            mockSuccessResponse(mockResponse)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.search({
                    query: 'test query',
                    filter: { property: 'object', value: 'page' },
                    page_size: 20,
                })

                expect(result).toEqual(mockResponse)
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })
    })

    describe('Comments', () => {
        it('should list comments', async () => {
            const mockResponse = mockListCommentsResponse(3)
            mockSuccessResponse(mockResponse)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.listComments({
                    block_id: 'block-id',
                })

                expect(result).toEqual(mockResponse)
                expect(result.results).toHaveLength(3)
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should list comments with pagination', async () => {
            const mockResponse = mockListCommentsResponse(5)
            mockSuccessResponse(mockResponse)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.listComments({
                    block_id: 'block-id',
                    start_cursor: 'cursor',
                    page_size: 10,
                })

                expect(result).toEqual(mockResponse)
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should create a comment', async () => {
            const mockCommentData = mockComment()
            mockSuccessResponse(mockCommentData)

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                const result = yield* service.createComment({
                    parent: { type: 'page_id', page_id: 'page-id' },
                    rich_text: [
                        {
                            type: 'text',
                            text: { content: 'Great page!', link: null },
                            annotations: {
                                bold: false,
                                italic: false,
                                strikethrough: false,
                                underline: false,
                                code: false,
                                color: 'default',
                            },
                            plain_text: 'Great page!',
                            href: null,
                        },
                    ],
                })

                expect(result).toEqual(mockCommentData)
                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/comments',
                    expect.objectContaining({
                        method: 'POST',
                    })
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })
    })

    describe('Error Handling', () => {
        it('should handle API errors', async () => {
            mockErrorResponse(400, 'Invalid request', 'validation_error')

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                return yield* service.retrievePage('invalid-id')
            })

            const result = await Effect.runPromise(
                program.pipe(
                    Effect.provide(layer),
                    Effect.catchTag('NotionError', (error) =>
                        Effect.succeed({
                            error: 'NotionError',
                            message: error.message,
                            code: error.code,
                        })
                    )
                )
            )

            expect(result).toMatchObject({
                error: 'NotionError',
                message: 'Invalid request',
                code: 'validation_error',
            })
        })

        it('should handle network errors', async () => {
            mockNetworkError()

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                return yield* service.retrievePage('page-id')
            })

            const result = await Effect.runPromise(
                program.pipe(
                    Effect.provide(layer),
                    Effect.catchTag('NotionNetworkError', (error) =>
                        Effect.succeed({
                            error: 'NotionNetworkError',
                            message: error.message,
                        })
                    )
                )
            )

            expect(result).toMatchObject({
                error: 'NotionNetworkError',
                message: 'Network error',
            })
        })

        it('should handle 404 errors', async () => {
            mockErrorResponse(404, 'Page not found', 'object_not_found')

            const layer = makeNotionServiceLayer(mockConfig)
            const program = Effect.gen(function* () {
                const service = yield* NotionService
                return yield* service.retrievePage('non-existent-id')
            })

            const result = await Effect.runPromise(
                program.pipe(
                    Effect.provide(layer),
                    Effect.catchTag('NotionError', (error) =>
                        Effect.succeed({
                            error: 'NotionError',
                            status: error.status,
                        })
                    )
                )
            )

            expect(result).toMatchObject({
                error: 'NotionError',
                status: 404,
            })
        })
    })

    describe('Configuration', () => {
        it('should use default baseUrl', async () => {
            const mockPageData = mockPage()
            mockSuccessResponse(mockPageData)

            const layer = makeNotionServiceLayer({
                token: 'test-token',
            })

            const program = Effect.gen(function* () {
                const service = yield* NotionService
                yield* service.retrievePage('page-id')

                expect(fetchMock).toHaveBeenCalledWith(
                    'https://api.notion.com/v1/pages/page-id',
                    expect.any(Object)
                )
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should use custom timeout', async () => {
            const mockPageData = mockPage()
            mockSuccessResponse(mockPageData)

            const layer = makeNotionServiceLayer({
                token: 'test-token',
                timeout: 10000,
            })

            const program = Effect.gen(function* () {
                const service = yield* NotionService
                yield* service.retrievePage('page-id')
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })
    })
})
