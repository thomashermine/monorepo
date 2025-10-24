import { Effect } from 'effect'

import type { NotionColor, RichText } from './types'

/**
 * Helper functions for working with Notion API data
 */

/**
 * Generate a simple rich text object from a string
 */
export function generateSimpleRichText(
    text: string,
    options?: {
        bold?: boolean
        italic?: boolean
        strikethrough?: boolean
        underline?: boolean
        code?: boolean
        color?: NotionColor
        link?: string
    }
): Effect.Effect<RichText, never> {
    return Effect.sync(() => ({
        type: 'text' as const,
        text: {
            content: text,
            link: options?.link ? { url: options.link } : null,
        },
        annotations: {
            bold: options?.bold ?? false,
            italic: options?.italic ?? false,
            strikethrough: options?.strikethrough ?? false,
            underline: options?.underline ?? false,
            code: options?.code ?? false,
            color: options?.color ?? 'default',
        },
        plain_text: text,
        href: options?.link ?? null,
    }))
}

/**
 * Generate an array of rich text objects from a string
 * This is useful for properties that require RichText[]
 */
export function generateRichText(
    text: string,
    options?: {
        bold?: boolean
        italic?: boolean
        strikethrough?: boolean
        underline?: boolean
        code?: boolean
        color?: NotionColor
        link?: string
    }
): Effect.Effect<RichText[], never> {
    return generateSimpleRichText(text, options).pipe(
        Effect.map((richText) => [richText])
    )
}

/**
 * Extract plain text from rich text array
 */
export function extractPlainText(
    richText: RichText[]
): Effect.Effect<string, never> {
    return Effect.sync(() => richText.map((rt) => rt.plain_text).join(''))
}

/**
 * Create a paragraph block with simple text
 */
export function createParagraphBlock(
    text: string,
    options?: {
        color?: NotionColor
        bold?: boolean
        italic?: boolean
        code?: boolean
    }
): Effect.Effect<
    {
        object: 'block'
        type: 'paragraph'
        paragraph: {
            rich_text: RichText[]
            color: NotionColor
        }
    },
    never
> {
    return generateRichText(text, options).pipe(
        Effect.map((richText) => ({
            object: 'block' as const,
            type: 'paragraph' as const,
            paragraph: {
                rich_text: richText,
                color: options?.color ?? 'default',
            },
        }))
    )
}

/**
 * Create a heading block
 */
export function createHeadingBlock(
    level: 1 | 2 | 3,
    text: string,
    options?: {
        color?: NotionColor
        bold?: boolean
        italic?: boolean
    }
): Effect.Effect<
    {
        object: 'block'
        type: 'heading_1' | 'heading_2' | 'heading_3'
        [key: string]: unknown
    },
    never
> {
    const headingType = `heading_${level}` as
        | 'heading_1'
        | 'heading_2'
        | 'heading_3'

    return generateRichText(text, options).pipe(
        Effect.map((richText) => ({
            object: 'block' as const,
            type: headingType,
            [headingType]: {
                rich_text: richText,
                color: options?.color ?? 'default',
                is_toggleable: false,
            },
        }))
    )
}

/**
 * Create a to-do block
 */
export function createToDoBlock(
    text: string,
    checked: boolean = false,
    options?: {
        color?: NotionColor
        bold?: boolean
        italic?: boolean
    }
): Effect.Effect<
    {
        object: 'block'
        type: 'to_do'
        to_do: {
            rich_text: RichText[]
            checked: boolean
            color: NotionColor
        }
    },
    never
> {
    return generateRichText(text, options).pipe(
        Effect.map((richText) => ({
            object: 'block' as const,
            type: 'to_do' as const,
            to_do: {
                rich_text: richText,
                checked,
                color: options?.color ?? 'default',
            },
        }))
    )
}

/**
 * Create a bulleted list item block
 */
export function createBulletedListItemBlock(
    text: string,
    options?: {
        color?: NotionColor
        bold?: boolean
        italic?: boolean
    }
): Effect.Effect<
    {
        object: 'block'
        type: 'bulleted_list_item'
        bulleted_list_item: {
            rich_text: RichText[]
            color: NotionColor
        }
    },
    never
> {
    return generateRichText(text, options).pipe(
        Effect.map((richText) => ({
            object: 'block' as const,
            type: 'bulleted_list_item' as const,
            bulleted_list_item: {
                rich_text: richText,
                color: options?.color ?? 'default',
            },
        }))
    )
}

/**
 * Create a numbered list item block
 */
export function createNumberedListItemBlock(
    text: string,
    options?: {
        color?: NotionColor
        bold?: boolean
        italic?: boolean
    }
): Effect.Effect<
    {
        object: 'block'
        type: 'numbered_list_item'
        numbered_list_item: {
            rich_text: RichText[]
            color: NotionColor
        }
    },
    never
> {
    return generateRichText(text, options).pipe(
        Effect.map((richText) => ({
            object: 'block' as const,
            type: 'numbered_list_item' as const,
            numbered_list_item: {
                rich_text: richText,
                color: options?.color ?? 'default',
            },
        }))
    )
}

/**
 * Create a code block
 */
export function createCodeBlock(
    code: string,
    language: string = 'typescript',
    caption?: string
): Effect.Effect<
    {
        object: 'block'
        type: 'code'
        code: {
            rich_text: RichText[]
            caption: RichText[]
            language: string
        }
    },
    never
> {
    return Effect.all([
        generateRichText(code),
        caption ? generateRichText(caption) : Effect.succeed([]),
    ]).pipe(
        Effect.map(([richText, captionText]) => ({
            object: 'block' as const,
            type: 'code' as const,
            code: {
                rich_text: richText,
                caption: captionText,
                language,
            },
        }))
    )
}

/**
 * Create a quote block
 */
export function createQuoteBlock(
    text: string,
    options?: {
        color?: NotionColor
        bold?: boolean
        italic?: boolean
    }
): Effect.Effect<
    {
        object: 'block'
        type: 'quote'
        quote: {
            rich_text: RichText[]
            color: NotionColor
        }
    },
    never
> {
    return generateRichText(text, options).pipe(
        Effect.map((richText) => ({
            object: 'block' as const,
            type: 'quote' as const,
            quote: {
                rich_text: richText,
                color: options?.color ?? 'default',
            },
        }))
    )
}

/**
 * Create a divider block
 */
export function createDividerBlock(): Effect.Effect<
    {
        object: 'block'
        type: 'divider'
        divider: Record<string, never>
    },
    never
> {
    return Effect.succeed({
        object: 'block' as const,
        type: 'divider' as const,
        divider: {},
    })
}

/**
 * Create a callout block
 */
export function createCalloutBlock(
    text: string,
    options?: {
        emoji?: string
        color?: NotionColor
        bold?: boolean
        italic?: boolean
    }
): Effect.Effect<
    {
        object: 'block'
        type: 'callout'
        callout: {
            rich_text: RichText[]
            icon: { type: 'emoji'; emoji: string } | null
            color: NotionColor
        }
    },
    never
> {
    return generateRichText(text, options).pipe(
        Effect.map((richText) => ({
            object: 'block' as const,
            type: 'callout' as const,
            callout: {
                rich_text: richText,
                icon: options?.emoji
                    ? { type: 'emoji' as const, emoji: options.emoji }
                    : null,
                color: options?.color ?? 'default',
            },
        }))
    )
}
