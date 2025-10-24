import { faker } from '@faker-js/faker'

import type {
    Block,
    Comment,
    Database,
    DatabaseProperty,
    ListBlockChildrenResponse,
    ListCommentsResponse,
    ListUsersResponse,
    NotionColor,
    Page,
    Parent,
    PropertyValue,
    QueryDatabaseResponse,
    RichText,
    SearchResponse,
    User,
} from './types'

/**
 * Notion API Mocks Generator
 *
 * Utilities to generate mock data for the Notion API using faker-js
 */

// ============================================================================
// Helper Functions
// ============================================================================

const mockId = (): string => faker.string.uuid()

const mockColors: NotionColor[] = [
    'default',
    'gray',
    'brown',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'red',
]

const randomColor = (): NotionColor => faker.helpers.arrayElement(mockColors)

// ============================================================================
// Mock Generators - Common Types
// ============================================================================

/**
 * Generate a mock RichText object
 */
export const mockRichText = (overrides?: Partial<RichText>): RichText => {
    const content = overrides?.plain_text ?? faker.lorem.sentence()
    return {
        type: 'text',
        text: {
            content,
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
        plain_text: content,
        href: null,
        ...overrides,
    }
}

/**
 * Generate an array of mock RichText objects
 */
export const mockRichTextArray = (
    count: number = 1,
    overrides?: Partial<RichText>
): RichText[] => {
    return Array.from({ length: count }, () => mockRichText(overrides))
}

/**
 * Generate a mock User
 */
export const mockUser = (overrides?: Partial<User>): User => {
    const type =
        overrides?.type ??
        faker.helpers.arrayElement(['person', 'bot'] as const)
    return {
        object: 'user',
        id: mockId(),
        type,
        name: faker.person.fullName(),
        avatar_url: faker.image.avatar(),
        person:
            type === 'person' ? { email: faker.internet.email() } : undefined,
        bot:
            type === 'bot'
                ? { owner: { type: 'workspace', workspace: true } }
                : undefined,
        ...overrides,
    }
}

/**
 * Generate a mock Parent
 */
export const mockParent = (overrides?: Partial<Parent>): Parent => {
    const type =
        overrides?.type ??
        faker.helpers.arrayElement([
            'database_id',
            'page_id',
            'workspace',
        ] as const)

    const parent: Parent = { type }

    switch (type) {
        case 'database_id':
            parent.database_id = mockId()
            break
        case 'page_id':
            parent.page_id = mockId()
            break
        case 'workspace':
            parent.workspace = true
            break
    }

    return { ...parent, ...overrides }
}

// ============================================================================
// Mock Generators - Property Values
// ============================================================================

/**
 * Generate a mock PropertyValue
 */
export const mockPropertyValue = (
    type: PropertyValue['type'] = 'rich_text',
    overrides?: Partial<PropertyValue>
): PropertyValue => {
    const baseProperty = {
        id: faker.string.alphanumeric(4),
        type,
    }

    switch (type) {
        case 'title':
            return {
                ...baseProperty,
                type: 'title',
                title: mockRichTextArray(1),
                ...overrides,
            } as PropertyValue

        case 'rich_text':
            return {
                ...baseProperty,
                type: 'rich_text',
                rich_text: mockRichTextArray(1),
                ...overrides,
            } as PropertyValue

        case 'number':
            return {
                ...baseProperty,
                type: 'number',
                number: faker.number.int({ min: 0, max: 1000 }),
                ...overrides,
            } as PropertyValue

        case 'select':
            return {
                ...baseProperty,
                type: 'select',
                select: {
                    id: mockId(),
                    name: faker.word.noun(),
                    color: randomColor(),
                },
                ...overrides,
            } as PropertyValue

        case 'multi_select':
            return {
                ...baseProperty,
                type: 'multi_select',
                multi_select: Array.from({ length: 2 }, () => ({
                    id: mockId(),
                    name: faker.word.noun(),
                    color: randomColor(),
                })),
                ...overrides,
            } as PropertyValue

        case 'date':
            return {
                ...baseProperty,
                type: 'date',
                date: {
                    start: faker.date.future().toISOString(),
                    end: null,
                    time_zone: null,
                },
                ...overrides,
            } as PropertyValue

        case 'checkbox':
            return {
                ...baseProperty,
                type: 'checkbox',
                checkbox: faker.datatype.boolean(),
                ...overrides,
            } as PropertyValue

        case 'url':
            return {
                ...baseProperty,
                type: 'url',
                url: faker.internet.url(),
                ...overrides,
            } as PropertyValue

        case 'email':
            return {
                ...baseProperty,
                type: 'email',
                email: faker.internet.email(),
                ...overrides,
            } as PropertyValue

        case 'phone_number':
            return {
                ...baseProperty,
                type: 'phone_number',
                phone_number: faker.phone.number(),
                ...overrides,
            } as PropertyValue

        case 'status':
            return {
                ...baseProperty,
                type: 'status',
                status: {
                    id: mockId(),
                    name: faker.helpers.arrayElement([
                        'Not Started',
                        'In Progress',
                        'Done',
                    ]),
                    color: randomColor(),
                },
                ...overrides,
            } as PropertyValue

        default:
            return {
                ...baseProperty,
                type: 'rich_text',
                rich_text: mockRichTextArray(1),
                ...overrides,
            } as PropertyValue
    }
}

// ============================================================================
// Mock Generators - Database
// ============================================================================

/**
 * Generate a mock DatabaseProperty
 */
export const mockDatabaseProperty = (
    type: string = 'rich_text',
    overrides?: Partial<DatabaseProperty>
): DatabaseProperty => {
    return {
        id: faker.string.alphanumeric(4),
        name: faker.word.noun(),
        type,
        ...overrides,
    }
}

/**
 * Generate a mock Database
 */
export const mockDatabase = (overrides?: Partial<Database>): Database => {
    return {
        object: 'database',
        id: mockId(),
        created_time: faker.date.past().toISOString(),
        created_by: mockUser(),
        last_edited_time: faker.date.recent().toISOString(),
        last_edited_by: mockUser(),
        title: mockRichTextArray(1, { plain_text: faker.lorem.words(3) }),
        description: mockRichTextArray(1),
        icon: { type: 'emoji', emoji: '📊' },
        cover: null,
        properties: {
            Name: mockDatabaseProperty('title'),
            Status: mockDatabaseProperty('status'),
            Tags: mockDatabaseProperty('multi_select'),
        },
        parent: mockParent({ type: 'page_id' }),
        url: faker.internet.url(),
        archived: false,
        is_inline: false,
        ...overrides,
    }
}

/**
 * Generate a mock QueryDatabaseResponse
 */
export const mockQueryDatabaseResponse = (
    pageCount: number = 3,
    overrides?: Partial<QueryDatabaseResponse>
): QueryDatabaseResponse => {
    return {
        object: 'list',
        results: Array.from({ length: pageCount }, () => mockPage()),
        next_cursor: null,
        has_more: false,
        type: 'page_or_database',
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Page
// ============================================================================

/**
 * Generate a mock Page
 */
export const mockPage = (overrides?: Partial<Page>): Page => {
    return {
        object: 'page',
        id: mockId(),
        created_time: faker.date.past().toISOString(),
        created_by: mockUser(),
        last_edited_time: faker.date.recent().toISOString(),
        last_edited_by: mockUser(),
        archived: false,
        icon: { type: 'emoji', emoji: faker.internet.emoji() },
        cover: null,
        properties: {
            title: mockPropertyValue('title'),
            Status: mockPropertyValue('status'),
        },
        parent: mockParent({ type: 'database_id' }),
        url: faker.internet.url(),
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Block
// ============================================================================

/**
 * Generate a mock Block
 */
export const mockBlock = (
    type: Block['type'] = 'paragraph',
    overrides?: Partial<Block>
): Block => {
    const baseBlock = {
        object: 'block' as const,
        id: mockId(),
        parent: mockParent({ type: 'page_id' }),
        created_time: faker.date.past().toISOString(),
        created_by: mockUser(),
        last_edited_time: faker.date.recent().toISOString(),
        last_edited_by: mockUser(),
        has_children: false,
        archived: false,
    }

    switch (type) {
        case 'paragraph':
            return {
                ...baseBlock,
                type: 'paragraph',
                paragraph: {
                    rich_text: mockRichTextArray(1),
                    color: 'default' as const,
                },
                ...overrides,
            } as Block

        case 'heading_1':
        case 'heading_2':
        case 'heading_3':
            return {
                ...baseBlock,
                type,
                [type]: {
                    rich_text: mockRichTextArray(1),
                    color: 'default' as const,
                    is_toggleable: false,
                },
                ...overrides,
            } as Block

        case 'bulleted_list_item':
            return {
                ...baseBlock,
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    rich_text: mockRichTextArray(1),
                    color: 'default' as const,
                },
                ...overrides,
            } as Block

        case 'numbered_list_item':
            return {
                ...baseBlock,
                type: 'numbered_list_item',
                numbered_list_item: {
                    rich_text: mockRichTextArray(1),
                    color: 'default' as const,
                },
                ...overrides,
            } as Block

        case 'to_do':
            return {
                ...baseBlock,
                type: 'to_do',
                to_do: {
                    rich_text: mockRichTextArray(1),
                    checked: faker.datatype.boolean(),
                    color: 'default' as const,
                },
                ...overrides,
            } as Block

        case 'toggle':
            return {
                ...baseBlock,
                type: 'toggle',
                toggle: {
                    rich_text: mockRichTextArray(1),
                    color: 'default' as const,
                },
                ...overrides,
            } as Block

        case 'code':
            return {
                ...baseBlock,
                type: 'code',
                code: {
                    rich_text: mockRichTextArray(1),
                    caption: [],
                    language: 'typescript',
                },
                ...overrides,
            } as Block

        case 'quote':
            return {
                ...baseBlock,
                type: 'quote',
                quote: {
                    rich_text: mockRichTextArray(1),
                    color: 'default' as const,
                },
                ...overrides,
            } as Block

        case 'callout':
            return {
                ...baseBlock,
                type: 'callout',
                callout: {
                    rich_text: mockRichTextArray(1),
                    icon: { type: 'emoji', emoji: '💡' },
                    color: 'default' as const,
                },
                ...overrides,
            } as Block

        case 'divider':
            return {
                ...baseBlock,
                type: 'divider',
                divider: {},
                ...overrides,
            } as Block

        default:
            return {
                ...baseBlock,
                type: 'paragraph',
                paragraph: {
                    rich_text: mockRichTextArray(1),
                    color: 'default' as const,
                },
                ...overrides,
            } as Block
    }
}

/**
 * Generate a mock ListBlockChildrenResponse
 */
export const mockListBlockChildrenResponse = (
    blockCount: number = 3,
    overrides?: Partial<ListBlockChildrenResponse>
): ListBlockChildrenResponse => {
    return {
        object: 'list',
        results: Array.from({ length: blockCount }, () => mockBlock()),
        next_cursor: null,
        has_more: false,
        type: 'block',
        block: {},
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - User
// ============================================================================

/**
 * Generate a mock ListUsersResponse
 */
export const mockListUsersResponse = (
    userCount: number = 3,
    overrides?: Partial<ListUsersResponse>
): ListUsersResponse => {
    return {
        object: 'list',
        results: Array.from({ length: userCount }, () => mockUser()),
        next_cursor: null,
        has_more: false,
        type: 'user',
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Search
// ============================================================================

/**
 * Generate a mock SearchResponse
 */
export const mockSearchResponse = (
    resultCount: number = 5,
    overrides?: Partial<SearchResponse>
): SearchResponse => {
    const results: Array<Page | Database> = []

    for (let i = 0; i < resultCount; i++) {
        if (faker.datatype.boolean()) {
            results.push(mockPage())
        } else {
            results.push(mockDatabase())
        }
    }

    return {
        object: 'list',
        results,
        next_cursor: null,
        has_more: false,
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Comment
// ============================================================================

/**
 * Generate a mock Comment
 */
export const mockComment = (overrides?: Partial<Comment>): Comment => {
    return {
        object: 'comment',
        id: mockId(),
        parent: { type: 'page_id', page_id: mockId() },
        discussion_id: mockId(),
        created_time: faker.date.past().toISOString(),
        created_by: mockUser(),
        last_edited_time: faker.date.recent().toISOString(),
        rich_text: mockRichTextArray(1),
        ...overrides,
    }
}

/**
 * Generate a mock ListCommentsResponse
 */
export const mockListCommentsResponse = (
    commentCount: number = 3,
    overrides?: Partial<ListCommentsResponse>
): ListCommentsResponse => {
    return {
        object: 'list',
        results: Array.from({ length: commentCount }, () => mockComment()),
        next_cursor: null,
        has_more: false,
        ...overrides,
    }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a mock page with specific properties
 */
export const mockPageWithProperties = (
    properties: Record<string, PropertyValue>
): Page => {
    return mockPage({ properties })
}

/**
 * Create a mock database with specific properties
 */
export const mockDatabaseWithProperties = (
    properties: Record<string, DatabaseProperty>
): Database => {
    return mockDatabase({ properties })
}
