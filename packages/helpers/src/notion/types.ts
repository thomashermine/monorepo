import { Data } from 'effect'

/**
 * Notion API Types
 *
 * Type definitions for the Notion API v2022-06-28
 * Documentation: https://developers.notion.com/reference/intro
 */

// ============================================================================
// Error Types
// ============================================================================

export class NotionError extends Data.TaggedError('NotionError')<{
    readonly message: string
    readonly code?: string
    readonly status?: number
}> {}

export class NotionAuthError extends Data.TaggedError('NotionAuthError')<{
    readonly message: string
}> {}

export class NotionNetworkError extends Data.TaggedError('NotionNetworkError')<{
    readonly message: string
    readonly cause?: unknown
}> {}

// ============================================================================
// Common Types
// ============================================================================

export type NotionColor =
    | 'default'
    | 'gray'
    | 'brown'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'red'

export interface RichText {
    type: 'text' | 'mention' | 'equation'
    text?: {
        content: string
        link?: { url: string } | null
    }
    mention?: {
        type: string
        [key: string]: unknown
    }
    equation?: {
        expression: string
    }
    annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: NotionColor
    }
    plain_text: string
    href?: string | null
}

export interface User {
    object: 'user'
    id: string
    type?: 'person' | 'bot'
    name?: string
    avatar_url?: string | null
    person?: {
        email?: string
    }
    bot?: {
        owner?: {
            type: string
            workspace?: boolean
        }
    }
}

export interface Parent {
    type: 'database_id' | 'page_id' | 'workspace' | 'block_id'
    database_id?: string
    page_id?: string
    workspace?: boolean
    block_id?: string
}

// ============================================================================
// Property Types
// ============================================================================

export interface TitleProperty {
    id: string
    type: 'title'
    title: RichText[]
}

export interface RichTextProperty {
    id: string
    type: 'rich_text'
    rich_text: RichText[]
}

export interface NumberProperty {
    id: string
    type: 'number'
    number: number | null
}

export interface SelectProperty {
    id: string
    type: 'select'
    select: {
        id: string
        name: string
        color: NotionColor
    } | null
}

export interface MultiSelectProperty {
    id: string
    type: 'multi_select'
    multi_select: Array<{
        id: string
        name: string
        color: NotionColor
    }>
}

export interface DateProperty {
    id: string
    type: 'date'
    date: {
        start: string
        end?: string | null
        time_zone?: string | null
    } | null
}

export interface PeopleProperty {
    id: string
    type: 'people'
    people: User[]
}

export interface FilesProperty {
    id: string
    type: 'files'
    files: Array<{
        name: string
        type?: 'external' | 'file'
        external?: { url: string }
        file?: { url: string; expiry_time: string }
    }>
}

export interface CheckboxProperty {
    id: string
    type: 'checkbox'
    checkbox: boolean
}

export interface UrlProperty {
    id: string
    type: 'url'
    url: string | null
}

export interface EmailProperty {
    id: string
    type: 'email'
    email: string | null
}

export interface PhoneNumberProperty {
    id: string
    type: 'phone_number'
    phone_number: string | null
}

export interface FormulaProperty {
    id: string
    type: 'formula'
    formula:
        | { type: 'string'; string: string | null }
        | { type: 'number'; number: number | null }
        | { type: 'boolean'; boolean: boolean | null }
        | { type: 'date'; date: { start: string; end?: string | null } | null }
}

export interface RelationProperty {
    id: string
    type: 'relation'
    relation: Array<{
        id: string
    }>
    has_more?: boolean
}

export interface RollupProperty {
    id: string
    type: 'rollup'
    rollup:
        | { type: 'number'; number: number | null; function: string }
        | {
              type: 'date'
              date: { start: string; end?: string | null } | null
              function: string
          }
        | { type: 'array'; array: PropertyValue[]; function: string }
}

export interface CreatedTimeProperty {
    id: string
    type: 'created_time'
    created_time: string
}

export interface CreatedByProperty {
    id: string
    type: 'created_by'
    created_by: User
}

export interface LastEditedTimeProperty {
    id: string
    type: 'last_edited_time'
    last_edited_time: string
}

export interface LastEditedByProperty {
    id: string
    type: 'last_edited_by'
    last_edited_by: User
}

export interface StatusProperty {
    id: string
    type: 'status'
    status: {
        id: string
        name: string
        color: NotionColor
    } | null
}

export type PropertyValue =
    | TitleProperty
    | RichTextProperty
    | NumberProperty
    | SelectProperty
    | MultiSelectProperty
    | DateProperty
    | PeopleProperty
    | FilesProperty
    | CheckboxProperty
    | UrlProperty
    | EmailProperty
    | PhoneNumberProperty
    | FormulaProperty
    | RelationProperty
    | RollupProperty
    | CreatedTimeProperty
    | CreatedByProperty
    | LastEditedTimeProperty
    | LastEditedByProperty
    | StatusProperty

// ============================================================================
// Database Types
// ============================================================================

export interface DatabaseProperty {
    id: string
    name: string
    type: string
    [key: string]: unknown
}

export interface Database {
    object: 'database'
    id: string
    created_time: string
    created_by: User
    last_edited_time: string
    last_edited_by: User
    title: RichText[]
    description: RichText[]
    icon:
        | { type: 'emoji'; emoji: string }
        | { type: 'external'; external: { url: string } }
        | { type: 'file'; file: { url: string; expiry_time: string } }
        | null
    cover:
        | { type: 'external'; external: { url: string } }
        | { type: 'file'; file: { url: string; expiry_time: string } }
        | null
    properties: Record<string, DatabaseProperty>
    parent: Parent
    url: string
    archived: boolean
    is_inline?: boolean
}

export interface QueryDatabaseParams {
    filter?: DatabaseFilter
    sorts?: DatabaseSort[]
    start_cursor?: string
    page_size?: number
}

export interface DatabaseFilter {
    or?: DatabaseFilter[]
    and?: DatabaseFilter[]
    property?: string
    [key: string]: unknown
}

export interface DatabaseSort {
    property?: string
    timestamp?: 'created_time' | 'last_edited_time'
    direction: 'ascending' | 'descending'
}

export interface QueryDatabaseResponse {
    object: 'list'
    results: Page[]
    next_cursor: string | null
    has_more: boolean
    type: 'page_or_database'
}

export interface CreateDatabaseInput {
    parent: Parent
    title?: RichText[]
    properties: Record<string, DatabaseProperty>
    icon?:
        | { type: 'emoji'; emoji: string }
        | { type: 'external'; external: { url: string } }
    cover?: { type: 'external'; external: { url: string } }
}

export interface UpdateDatabaseInput {
    title?: RichText[]
    description?: RichText[]
    properties?: Record<string, DatabaseProperty>
    icon?:
        | { type: 'emoji'; emoji: string }
        | { type: 'external'; external: { url: string } }
        | null
    cover?: { type: 'external'; external: { url: string } } | null
    archived?: boolean
}

// ============================================================================
// Page Types
// ============================================================================

export interface Page {
    object: 'page'
    id: string
    created_time: string
    created_by: User
    last_edited_time: string
    last_edited_by: User
    archived: boolean
    icon:
        | { type: 'emoji'; emoji: string }
        | { type: 'external'; external: { url: string } }
        | { type: 'file'; file: { url: string; expiry_time: string } }
        | null
    cover:
        | { type: 'external'; external: { url: string } }
        | { type: 'file'; file: { url: string; expiry_time: string } }
        | null
    properties: Record<string, PropertyValue>
    parent: Parent
    url: string
}

export interface CreatePageInput {
    parent: Parent
    properties: Record<string, Partial<PropertyValue>>
    children?: Block[]
    icon?:
        | { type: 'emoji'; emoji: string }
        | { type: 'external'; external: { url: string } }
    cover?: { type: 'external'; external: { url: string } }
}

export interface UpdatePageInput {
    properties?: Record<string, Partial<PropertyValue>>
    icon?:
        | { type: 'emoji'; emoji: string }
        | { type: 'external'; external: { url: string } }
        | null
    cover?: { type: 'external'; external: { url: string } } | null
    archived?: boolean
}

// ============================================================================
// Block Types
// ============================================================================

export interface BlockBase {
    object: 'block'
    id: string
    parent: Parent
    created_time: string
    created_by: User
    last_edited_time: string
    last_edited_by: User
    has_children: boolean
    archived: boolean
}

export interface ParagraphBlock extends BlockBase {
    type: 'paragraph'
    paragraph: {
        rich_text: RichText[]
        color: NotionColor
        children?: Block[]
    }
}

export interface HeadingBlock extends BlockBase {
    type: 'heading_1' | 'heading_2' | 'heading_3'
    [key: string]: unknown
}

export interface BulletedListItemBlock extends BlockBase {
    type: 'bulleted_list_item'
    bulleted_list_item: {
        rich_text: RichText[]
        color: NotionColor
        children?: Block[]
    }
}

export interface NumberedListItemBlock extends BlockBase {
    type: 'numbered_list_item'
    numbered_list_item: {
        rich_text: RichText[]
        color: NotionColor
        children?: Block[]
    }
}

export interface ToDoBlock extends BlockBase {
    type: 'to_do'
    to_do: {
        rich_text: RichText[]
        checked: boolean
        color: NotionColor
        children?: Block[]
    }
}

export interface ToggleBlock extends BlockBase {
    type: 'toggle'
    toggle: {
        rich_text: RichText[]
        color: NotionColor
        children?: Block[]
    }
}

export interface CodeBlock extends BlockBase {
    type: 'code'
    code: {
        rich_text: RichText[]
        caption: RichText[]
        language: string
    }
}

export interface QuoteBlock extends BlockBase {
    type: 'quote'
    quote: {
        rich_text: RichText[]
        color: NotionColor
        children?: Block[]
    }
}

export interface CalloutBlock extends BlockBase {
    type: 'callout'
    callout: {
        rich_text: RichText[]
        icon:
            | { type: 'emoji'; emoji: string }
            | { type: 'external'; external: { url: string } }
            | null
        color: NotionColor
        children?: Block[]
    }
}

export interface DividerBlock extends BlockBase {
    type: 'divider'
    divider: Record<string, never>
}

export type Block =
    | ParagraphBlock
    | HeadingBlock
    | BulletedListItemBlock
    | NumberedListItemBlock
    | ToDoBlock
    | ToggleBlock
    | CodeBlock
    | QuoteBlock
    | CalloutBlock
    | DividerBlock

export interface ListBlockChildrenResponse {
    object: 'list'
    results: Block[]
    next_cursor: string | null
    has_more: boolean
    type: 'block'
    block: Record<string, never>
}

export interface AppendBlockChildrenInput {
    children: Partial<Block>[]
}

// ============================================================================
// User Types
// ============================================================================

export interface ListUsersResponse {
    object: 'list'
    results: User[]
    next_cursor: string | null
    has_more: boolean
    type: 'user'
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchParams {
    query?: string
    filter?: {
        value: 'page' | 'database'
        property: 'object'
    }
    sort?: {
        direction: 'ascending' | 'descending'
        timestamp: 'last_edited_time'
    }
    start_cursor?: string
    page_size?: number
}

export interface SearchResponse {
    object: 'list'
    results: Array<Page | Database>
    next_cursor: string | null
    has_more: boolean
}

// ============================================================================
// Comment Types
// ============================================================================

export interface Comment {
    object: 'comment'
    id: string
    parent:
        | { type: 'page_id'; page_id: string }
        | { type: 'block_id'; block_id: string }
    discussion_id: string
    created_time: string
    created_by: User
    last_edited_time: string
    rich_text: RichText[]
}

export interface CreateCommentInput {
    parent:
        | { type: 'page_id'; page_id: string }
        | { type: 'discussion_id'; discussion_id: string }
    rich_text: RichText[]
}

export interface ListCommentsParams {
    block_id: string
    start_cursor?: string
    page_size?: number
}

export interface ListCommentsResponse {
    object: 'list'
    results: Comment[]
    next_cursor: string | null
    has_more: boolean
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface NotionConfig {
    readonly token: string
    readonly baseUrl?: string
    readonly version?: string
    readonly timeout?: number
}
