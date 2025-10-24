import { describe, expect, it } from 'vitest'

import {
    mockBlock,
    mockComment,
    mockDatabase,
    mockDatabaseProperty,
    mockDatabaseWithProperties,
    mockListBlockChildrenResponse,
    mockListCommentsResponse,
    mockListUsersResponse,
    mockPage,
    mockPageWithProperties,
    mockParent,
    mockPropertyValue,
    mockQueryDatabaseResponse,
    mockRichText,
    mockRichTextArray,
    mockSearchResponse,
    mockUser,
} from './mocks'

/**
 * Tests for Notion API mock generators
 */

describe('Notion Mocks', () => {
    describe('Common Types', () => {
        it('should generate a valid RichText', () => {
            const richText = mockRichText()

            expect(richText).toMatchObject({
                type: 'text',
                text: expect.objectContaining({
                    content: expect.any(String),
                }),
                annotations: expect.any(Object),
                plain_text: expect.any(String),
            })
        })

        it('should generate a RichText array', () => {
            const richTextArray = mockRichTextArray(3)

            expect(richTextArray).toHaveLength(3)
            richTextArray.forEach((rt) => {
                expect(rt).toHaveProperty('type', 'text')
                expect(rt).toHaveProperty('plain_text')
            })
        })

        it('should generate a valid User', () => {
            const user = mockUser()

            expect(user).toMatchObject({
                object: 'user',
                id: expect.any(String),
                name: expect.any(String),
            })
        })

        it('should generate a person User', () => {
            const user = mockUser({ type: 'person' })

            expect(user).toMatchObject({
                type: 'person',
                person: expect.objectContaining({
                    email: expect.any(String),
                }),
            })
        })

        it('should generate a bot User', () => {
            const user = mockUser({ type: 'bot' })

            expect(user).toMatchObject({
                type: 'bot',
                bot: expect.any(Object),
            })
        })

        it('should generate a valid Parent', () => {
            const parent = mockParent()

            expect(parent).toHaveProperty('type')
            expect([
                'database_id',
                'page_id',
                'workspace',
                'block_id',
            ]).toContain(parent.type)
        })
    })

    describe('Property Values', () => {
        it('should generate a title property', () => {
            const property = mockPropertyValue('title')

            expect(property).toMatchObject({
                type: 'title',
                title: expect.any(Array),
            })
        })

        it('should generate a rich_text property', () => {
            const property = mockPropertyValue('rich_text')

            expect(property).toMatchObject({
                type: 'rich_text',
                rich_text: expect.any(Array),
            })
        })

        it('should generate a number property', () => {
            const property = mockPropertyValue('number')

            expect(property).toMatchObject({
                type: 'number',
                number: expect.any(Number),
            })
        })

        it('should generate a select property', () => {
            const property = mockPropertyValue('select')

            expect(property).toMatchObject({
                type: 'select',
                select: expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                    color: expect.any(String),
                }),
            })
        })

        it('should generate a multi_select property', () => {
            const property = mockPropertyValue('multi_select')

            expect(property).toMatchObject({
                type: 'multi_select',
                multi_select: expect.any(Array),
            })
        })

        it('should generate a date property', () => {
            const property = mockPropertyValue('date')

            expect(property).toMatchObject({
                type: 'date',
                date: expect.objectContaining({
                    start: expect.any(String),
                }),
            })
        })

        it('should generate a checkbox property', () => {
            const property = mockPropertyValue('checkbox')

            expect(property).toMatchObject({
                type: 'checkbox',
                checkbox: expect.any(Boolean),
            })
        })

        it('should generate a url property', () => {
            const property = mockPropertyValue('url')

            expect(property).toMatchObject({
                type: 'url',
                url: expect.any(String),
            })
        })

        it('should generate an email property', () => {
            const property = mockPropertyValue('email')

            expect(property).toMatchObject({
                type: 'email',
                email: expect.any(String),
            })
        })

        it('should generate a phone_number property', () => {
            const property = mockPropertyValue('phone_number')

            expect(property).toMatchObject({
                type: 'phone_number',
                phone_number: expect.any(String),
            })
        })

        it('should generate a status property', () => {
            const property = mockPropertyValue('status')

            expect(property).toMatchObject({
                type: 'status',
                status: expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                }),
            })
        })
    })

    describe('Database', () => {
        it('should generate a valid Database', () => {
            const database = mockDatabase()

            expect(database).toMatchObject({
                object: 'database',
                id: expect.any(String),
                title: expect.any(Array),
                properties: expect.any(Object),
                archived: false,
            })
        })

        it('should generate a DatabaseProperty', () => {
            const property = mockDatabaseProperty('rich_text')

            expect(property).toMatchObject({
                id: expect.any(String),
                name: expect.any(String),
                type: 'rich_text',
            })
        })

        it('should generate a QueryDatabaseResponse', () => {
            const response = mockQueryDatabaseResponse(5)

            expect(response).toMatchObject({
                object: 'list',
                results: expect.any(Array),
                has_more: false,
                type: 'page_or_database',
            })
            expect(response.results).toHaveLength(5)
        })

        it('should generate a database with specific properties', () => {
            const customProps = {
                Title: mockDatabaseProperty('title'),
                Priority: mockDatabaseProperty('select'),
            }
            const database = mockDatabaseWithProperties(customProps)

            expect(database.properties).toEqual(customProps)
        })
    })

    describe('Page', () => {
        it('should generate a valid Page', () => {
            const page = mockPage()

            expect(page).toMatchObject({
                object: 'page',
                id: expect.any(String),
                properties: expect.any(Object),
                archived: false,
            })
        })

        it('should generate a page with specific properties', () => {
            const customProps = {
                Name: mockPropertyValue('title'),
                Status: mockPropertyValue('status'),
                Priority: mockPropertyValue('select'),
            }
            const page = mockPageWithProperties(customProps)

            expect(page.properties).toEqual(customProps)
        })

        it('should handle page with custom parent', () => {
            const page = mockPage({
                parent: { type: 'workspace', workspace: true },
            })

            expect(page.parent).toMatchObject({
                type: 'workspace',
                workspace: true,
            })
        })
    })

    describe('Block', () => {
        it('should generate a paragraph block', () => {
            const block = mockBlock('paragraph')

            expect(block).toMatchObject({
                object: 'block',
                type: 'paragraph',
                paragraph: expect.objectContaining({
                    rich_text: expect.any(Array),
                }),
            })
        })

        it('should generate heading blocks', () => {
            const h1 = mockBlock('heading_1')
            const h2 = mockBlock('heading_2')
            const h3 = mockBlock('heading_3')

            expect(h1.type).toBe('heading_1')
            expect(h2.type).toBe('heading_2')
            expect(h3.type).toBe('heading_3')
        })

        it('should generate a bulleted_list_item block', () => {
            const block = mockBlock('bulleted_list_item')

            expect(block).toMatchObject({
                type: 'bulleted_list_item',
                bulleted_list_item: expect.objectContaining({
                    rich_text: expect.any(Array),
                }),
            })
        })

        it('should generate a numbered_list_item block', () => {
            const block = mockBlock('numbered_list_item')

            expect(block).toMatchObject({
                type: 'numbered_list_item',
                numbered_list_item: expect.objectContaining({
                    rich_text: expect.any(Array),
                }),
            })
        })

        it('should generate a to_do block', () => {
            const block = mockBlock('to_do')

            expect(block).toMatchObject({
                type: 'to_do',
                to_do: expect.objectContaining({
                    rich_text: expect.any(Array),
                    checked: expect.any(Boolean),
                }),
            })
        })

        it('should generate a code block', () => {
            const block = mockBlock('code')

            expect(block).toMatchObject({
                type: 'code',
                code: expect.objectContaining({
                    rich_text: expect.any(Array),
                    language: expect.any(String),
                }),
            })
        })

        it('should generate a quote block', () => {
            const block = mockBlock('quote')

            expect(block).toMatchObject({
                type: 'quote',
                quote: expect.objectContaining({
                    rich_text: expect.any(Array),
                }),
            })
        })

        it('should generate a callout block', () => {
            const block = mockBlock('callout')

            expect(block).toMatchObject({
                type: 'callout',
                callout: expect.objectContaining({
                    rich_text: expect.any(Array),
                    icon: expect.any(Object),
                }),
            })
        })

        it('should generate a divider block', () => {
            const block = mockBlock('divider')

            expect(block).toMatchObject({
                type: 'divider',
                divider: {},
            })
        })

        it('should generate a ListBlockChildrenResponse', () => {
            const response = mockListBlockChildrenResponse(4)

            expect(response).toMatchObject({
                object: 'list',
                type: 'block',
                results: expect.any(Array),
                has_more: false,
            })
            expect(response.results).toHaveLength(4)
        })
    })

    describe('User', () => {
        it('should generate a ListUsersResponse', () => {
            const response = mockListUsersResponse(5)

            expect(response).toMatchObject({
                object: 'list',
                type: 'user',
                results: expect.any(Array),
                has_more: false,
            })
            expect(response.results).toHaveLength(5)
        })
    })

    describe('Search', () => {
        it('should generate a SearchResponse', () => {
            const response = mockSearchResponse(10)

            expect(response).toMatchObject({
                object: 'list',
                results: expect.any(Array),
                has_more: false,
            })
            expect(response.results).toHaveLength(10)
        })

        it('should include both pages and databases in search results', () => {
            const response = mockSearchResponse(20)

            const hasPages = response.results.some((r) => r.object === 'page')
            const hasDatabases = response.results.some(
                (r) => r.object === 'database'
            )

            // With 20 results, we should have both types (probabilistically)
            expect(hasPages || hasDatabases).toBe(true)
        })
    })

    describe('Comment', () => {
        it('should generate a valid Comment', () => {
            const comment = mockComment()

            expect(comment).toMatchObject({
                object: 'comment',
                id: expect.any(String),
                rich_text: expect.any(Array),
                created_time: expect.any(String),
            })
        })

        it('should generate a ListCommentsResponse', () => {
            const response = mockListCommentsResponse(3)

            expect(response).toMatchObject({
                object: 'list',
                results: expect.any(Array),
                has_more: false,
            })
            expect(response.results).toHaveLength(3)
        })
    })

    describe('Overrides', () => {
        it('should apply overrides to RichText', () => {
            const richText = mockRichText({
                plain_text: 'Custom text',
                annotations: {
                    bold: true,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'blue',
                },
            })

            expect(richText.plain_text).toBe('Custom text')
            expect(richText.annotations.bold).toBe(true)
            expect(richText.annotations.color).toBe('blue')
        })

        it('should apply overrides to Database', () => {
            const database = mockDatabase({
                archived: true,
                title: mockRichTextArray(1, { plain_text: 'My Database' }),
            })

            expect(database.archived).toBe(true)
            expect(database.title[0]?.plain_text).toBe('My Database')
        })

        it('should apply overrides to Page', () => {
            const page = mockPage({
                archived: true,
            })

            expect(page.archived).toBe(true)
        })
    })
})
