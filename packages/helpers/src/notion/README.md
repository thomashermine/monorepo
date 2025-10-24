# Notion API Service

A comprehensive Effect-based service for interacting with the Notion API v2022-06-28.

## Documentation

For the full Notion API documentation, visit: [https://developers.notion.com/reference/intro](https://developers.notion.com/reference/intro)

## Features

This service provides type-safe, Effect-based wrappers for all major Notion API endpoints:

### Database Operations

- Query databases with filters and sorts
- Retrieve database metadata
- Create new databases
- Update database properties and settings

### Page Operations

- Retrieve page data and properties
- Create new pages in databases or as children of pages
- Update page properties
- Archive pages

### Block Operations

- Retrieve individual blocks
- List block children with pagination
- Append new blocks to existing blocks
- Delete blocks

### User Operations

- Retrieve user information
- List all workspace users
- Get bot user information

### Search

- Full-text search across pages and databases
- Filter search results by object type
- Sort search results

### Comments

- List comments on pages or blocks
- Create new comments
- Access discussion threads

## Installation

```bash
pnpm add @monorepo/helpers
```

## Usage

### Basic Setup

```typescript
import { Effect } from 'effect'
import { NotionService, makeNotionServiceLayer } from '@monorepo/helpers/notion'

// Create service layer with configuration
const notionLayer = makeNotionServiceLayer({
    token: 'your-integration-token',
    baseUrl: 'https://api.notion.com', // optional, uses default if not provided
    version: '2022-06-28', // optional, defaults to 2022-06-28
    timeout: 30000, // optional, defaults to 30 seconds
})

// Use the service
const program = Effect.gen(function* () {
    const service = yield* NotionService

    // Search for pages
    const results = yield* service.search({
        query: 'Meeting notes',
        filter: { property: 'object', value: 'page' },
    })

    console.log('Found pages:', results.results.length)
    return results
})

// Run the program
const result = await Effect.runPromise(
    program.pipe(Effect.provide(notionLayer))
)
```

### Query a Database

```typescript
const program = Effect.gen(function* () {
    const service = yield* NotionService

    // Query database with filters
    const results = yield* service.queryDatabase('database-id', {
        filter: {
            and: [
                {
                    property: 'Status',
                    select: { equals: 'In Progress' },
                },
                {
                    property: 'Priority',
                    select: { equals: 'High' },
                },
            ],
        },
        sorts: [{ property: 'Created', direction: 'descending' }],
        page_size: 50,
    })

    console.log('Found items:', results.results.length)
    return results
})
```

### Create a Page

```typescript
import { generateRichText } from '@monorepo/helpers/notion'

const program = Effect.gen(function* () {
    const service = yield* NotionService

    // Create title text
    const titleText = yield* generateRichText('New Task')
    const descriptionText = yield* generateRichText('Task description')

    // Create a new page in a database
    const page = yield* service.createPage({
        parent: {
            type: 'database_id',
            database_id: 'your-database-id',
        },
        properties: {
            Name: {
                title: titleText,
            },
            Description: {
                rich_text: descriptionText,
            },
            Status: {
                select: { name: 'Not Started' },
            },
            Priority: {
                select: { name: 'High' },
            },
        },
        icon: {
            type: 'emoji',
            emoji: '📝',
        },
    })

    console.log('Created page:', page.id)
    return page
})
```

### Add Content to a Page

```typescript
import {
    createParagraphBlock,
    createHeadingBlock,
    createBulletedListItemBlock,
    createCodeBlock,
} from '@monorepo/helpers/notion'

const program = Effect.gen(function* () {
    const service = yield* NotionService

    // Create various blocks
    const heading = yield* createHeadingBlock(1, 'Project Overview')
    const paragraph = yield* createParagraphBlock(
        'This is a description of the project.'
    )
    const bulletPoint = yield* createBulletedListItemBlock(
        'First task to complete'
    )
    const codeBlock = yield* createCodeBlock(
        'const hello = "world";',
        'typescript',
        'Example code'
    )

    // Append blocks to a page
    const result = yield* service.appendBlockChildren('page-id', {
        children: [heading, paragraph, bulletPoint, codeBlock],
    })

    console.log('Added blocks:', result.results.length)
    return result
})
```

### Update Page Properties

```typescript
const program = Effect.gen(function* () {
    const service = yield* NotionService

    // Update page properties
    const updatedPage = yield* service.updatePage('page-id', {
        properties: {
            Status: {
                select: { name: 'Completed' },
            },
            'Completion Date': {
                date: {
                    start: new Date().toISOString(),
                },
            },
        },
    })

    console.log('Updated page:', updatedPage.id)
    return updatedPage
})
```

### Search with Filters

```typescript
const program = Effect.gen(function* () {
    const service = yield* NotionService

    // Search for databases only
    const databases = yield* service.search({
        filter: {
            property: 'object',
            value: 'database',
        },
        sort: {
            direction: 'descending',
            timestamp: 'last_edited_time',
        },
    })

    console.log('Found databases:', databases.results.length)
    return databases
})
```

### List and Create Comments

```typescript
const program = Effect.gen(function* () {
    const service = yield* NotionService
    const commentText = yield* generateRichText('Great work on this page!')

    // List existing comments
    const comments = yield* service.listComments({
        block_id: 'page-id',
        page_size: 50,
    })

    console.log('Existing comments:', comments.results.length)

    // Create a new comment
    const newComment = yield* service.createComment({
        parent: { type: 'page_id', page_id: 'page-id' },
        rich_text: commentText,
    })

    console.log('Created comment:', newComment.id)
    return { comments, newComment }
})
```

### Retrieve and Work with Blocks

```typescript
const program = Effect.gen(function* () {
    const service = yield* NotionService

    // Get all children of a block
    const children = yield* service.retrieveBlockChildren('block-id')

    for (const block of children.results) {
        console.log('Block type:', block.type)

        if (block.type === 'paragraph') {
            const text = block.paragraph.rich_text
                .map((rt) => rt.plain_text)
                .join('')
            console.log('Paragraph text:', text)
        }
    }

    return children
})
```

### List Workspace Users

```typescript
const program = Effect.gen(function* () {
    const service = yield* NotionService

    // Get all users in the workspace
    const users = yield* service.listUsers()

    console.log('Workspace users:', users.results.length)

    users.results.forEach((user) => {
        if (user.type === 'person' && user.person?.email) {
            console.log('User:', user.name, user.person.email)
        }
    })

    return users
})
```

## Helper Functions

The service includes helpful utilities for creating Notion content:

### Rich Text Helpers

```typescript
import {
    generateRichText,
    generateSimpleRichText,
    extractPlainText,
} from '@monorepo/helpers/notion'

// Create formatted rich text
const boldText = yield * generateRichText('Important!', { bold: true })
const linkText =
    yield *
    generateRichText('Click here', {
        link: 'https://example.com',
        underline: true,
    })
const codeText = yield * generateRichText('console.log()', { code: true })

// Extract plain text from rich text array
const plainText = yield * extractPlainText(richTextArray)
```

### Block Creation Helpers

```typescript
import {
    createParagraphBlock,
    createHeadingBlock,
    createToDoBlock,
    createBulletedListItemBlock,
    createNumberedListItemBlock,
    createCodeBlock,
    createQuoteBlock,
    createCalloutBlock,
    createDividerBlock,
} from '@monorepo/helpers/notion'

// Create a to-do item
const todo = yield * createToDoBlock('Complete documentation', false)

// Create a callout
const callout =
    yield *
    createCalloutBlock('Important information here', {
        emoji: '💡',
        color: 'yellow',
    })

// Create a quote
const quote =
    yield *
    createQuoteBlock('The only way to do great work is to love what you do.', {
        italic: true,
    })
```

## Error Handling

```typescript
import {
    NotionError,
    NotionNetworkError,
    NotionAuthError,
} from '@monorepo/helpers/notion'

const program = Effect.gen(function* () {
    const service = yield* NotionService

    return yield* service.retrievePage('page-id')
}).pipe(
    Effect.catchTag('NotionError', (error) =>
        Effect.succeed({
            error: 'API Error',
            message: error.message,
            code: error.code,
            status: error.status,
        })
    ),
    Effect.catchTag('NotionNetworkError', (error) =>
        Effect.succeed({
            error: 'Network Error',
            message: error.message,
        })
    ),
    Effect.catchTag('NotionAuthError', (error) =>
        Effect.succeed({
            error: 'Authentication Error',
            message: error.message,
        })
    )
)
```

## Error Types

The service uses Effect's error handling with three main error types:

### `NotionError`

Thrown when the API returns an error response (e.g., validation errors, not found).

```typescript
{
  message: string
  code?: string
  status?: number
}
```

### `NotionNetworkError`

Thrown when network-level failures occur (e.g., connection failures, timeouts).

```typescript
{
  message: string
  cause?: unknown
}
```

### `NotionAuthError`

Thrown when authentication configuration is missing or invalid.

```typescript
{
    message: string
}
```

## Type Safety

All API requests and responses are fully typed. The service exports comprehensive TypeScript types for:

- Request parameters
- Response data structures
- Property types
- Block types
- Error types
- And more...

Example:

```typescript
import type {
    Database,
    Page,
    Block,
    PropertyValue,
    RichText,
    NotionColor,
    QueryDatabaseParams,
    CreatePageInput,
} from '@monorepo/helpers/notion'
```

## Configuration

### Environment Variables

When using `NotionServiceLive`, you can configure the service using environment variables:

```bash
NOTION_TOKEN=your-integration-token
NOTION_BASE_URL=https://api.notion.com  # optional
NOTION_VERSION=2022-06-28  # optional
NOTION_TIMEOUT=30000  # optional, in milliseconds
```

### Direct Configuration

When using `makeNotionServiceLayer`, pass configuration directly:

```typescript
const notionLayer = makeNotionServiceLayer({
    token: 'your-integration-token',
    baseUrl: 'https://api.notion.com', // optional
    version: '2022-06-28', // optional
    timeout: 30000, // optional
})
```

## Authentication

To use the Notion API, you need to:

1. Create an integration at [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Copy the integration token (Internal Integration Token)
3. Share the pages/databases you want to access with your integration

All API requests require authentication via the `Authorization` header with your integration token.

## Rate Limits

Notion has rate limits on API requests:

- **3 requests per second** per integration
- Bursts are allowed but sustained rate should stay within limit

The service does not automatically handle rate limiting. Consider implementing retry logic with exponential backoff for production use.

## API Version

This service implements **Notion API version 2022-06-28**.

The API version is specified in the `Notion-Version` header for all requests.

## Testing

The service is fully tested with comprehensive test coverage:

- All API endpoints
- Error handling scenarios
- Effect composition
- Configuration options
- Mock data generators

Run tests:

```bash
pnpm test
```

## Property Types

Notion supports various property types in databases:

- `title` - Title text
- `rich_text` - Formatted text
- `number` - Numeric values
- `select` - Single select from options
- `multi_select` - Multiple selections
- `date` - Date or date range
- `people` - User references
- `files` - File attachments
- `checkbox` - Boolean values
- `url` - URL links
- `email` - Email addresses
- `phone_number` - Phone numbers
- `formula` - Computed values
- `relation` - Relations to other pages
- `rollup` - Aggregations from relations
- `status` - Status values
- `created_time` - Auto-populated creation time
- `created_by` - Auto-populated creator
- `last_edited_time` - Auto-populated edit time
- `last_edited_by` - Auto-populated editor

## Block Types

Supported block types for page content:

- `paragraph` - Text paragraphs
- `heading_1`, `heading_2`, `heading_3` - Headings
- `bulleted_list_item` - Bulleted lists
- `numbered_list_item` - Numbered lists
- `to_do` - Checkboxes/to-do items
- `toggle` - Toggleable sections
- `code` - Code blocks with syntax highlighting
- `quote` - Quote blocks
- `callout` - Callout boxes with icons
- `divider` - Horizontal dividers

## Contributing

This service is part of the monorepo helpers package. When contributing:

1. Add tests for any new features
2. Update types for API changes
3. Run linter and tests before committing
4. Update this README for significant changes

## Resources

- [Notion API Documentation](https://developers.notion.com/reference/intro)
- [Notion Integration Guide](https://developers.notion.com/docs/getting-started)
- [Working with Databases](https://developers.notion.com/docs/working-with-databases)
- [Working with Page Content](https://developers.notion.com/docs/working-with-page-content)
- [Property Value Objects](https://developers.notion.com/reference/property-value-object)
- [Block Objects](https://developers.notion.com/reference/block)

## License

Part of the monorepo project.
