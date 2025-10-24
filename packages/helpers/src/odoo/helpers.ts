import { Effect } from 'effect'

import type { Domain } from './types'

/**
 * Odoo Helper Functions
 *
 * Utility functions for working with Odoo data and operations
 */

/**
 * Build an Odoo domain from a simple object
 *
 * @example
 * buildDomain({ name: 'John', is_company: true })
 * // Returns: [['name', '=', 'John'], ['is_company', '=', true]]
 */
export function buildDomain(
    conditions: Record<string, unknown>
): Effect.Effect<Domain, never> {
    return Effect.sync(() => {
        const domain: Domain = []
        for (const [key, value] of Object.entries(conditions)) {
            if (value !== undefined && value !== null && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
                domain.push([key, '=', value])
            }
        }
        return domain
    })
}

/**
 * Format a JavaScript Date to Odoo date string (YYYY-MM-DD)
 */
export function formatDate(date: Date): Effect.Effect<string, never> {
    return Effect.sync(() => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    })
}

/**
 * Format a JavaScript Date to Odoo datetime string (YYYY-MM-DD HH:MM:SS)
 */
export function formatDateTime(date: Date): Effect.Effect<string, never> {
    return Effect.sync(() => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    })
}

/**
 * Parse Odoo date string (YYYY-MM-DD) to JavaScript Date
 */
export function parseDate(dateStr: string): Effect.Effect<Date, Error> {
    return Effect.try(() => {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date string: ${dateStr}`)
        }
        return date
    })
}

/**
 * Parse Odoo datetime string (YYYY-MM-DD HH:MM:SS) to JavaScript Date
 */
export function parseDateTime(datetimeStr: string): Effect.Effect<Date, Error> {
    return Effect.try(() => {
        // Replace space with 'T' to make it ISO-compatible
        const isoStr = datetimeStr.replace(' ', 'T')
        const date = new Date(isoStr)
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid datetime string: ${datetimeStr}`)
        }
        return date
    })
}

/**
 * Check if a value is Odoo's "false" (false or 0)
 * In Odoo, many2one fields return false when not set
 */
export function isFalse(value: unknown): boolean {
    return value === false || value === 0
}

/**
 * Domain operators helper
 * Common Odoo domain operators
 */
export const DomainOperators = {
    EQUALS: '=',
    NOT_EQUALS: '!=',
    GREATER_THAN: '>',
    GREATER_THAN_OR_EQUAL: '>=',
    LESS_THAN: '<',
    LESS_THAN_OR_EQUAL: '<=',
    LIKE: 'like',
    ILIKE: 'ilike', // Case-insensitive like
    IN: 'in',
    NOT_IN: 'not in',
    CHILD_OF: 'child_of',
} as const

/**
 * Build a domain with custom operators
 *
 * @example
 * buildComplexDomain([
 *   { field: 'name', operator: 'ilike', value: 'john' },
 *   { field: 'age', operator: '>=', value: 18 },
 * ])
 */
export function buildComplexDomain(
    conditions: Array<{
        field: string
        operator: string
        value: unknown
    }>
): Effect.Effect<Domain, never> {
    return Effect.sync(() => {
        const domain: Domain = []
        for (const condition of conditions) {
            if (condition.value !== undefined && condition.value !== null && (typeof condition.value === 'string' || typeof condition.value === 'number' || typeof condition.value === 'boolean')) {
                domain.push([
                    condition.field,
                    condition.operator,
                    condition.value,
                ])
            }
        }
        return domain
    })
}

/**
 * Combine multiple domains with AND logic
 */
export function combineDomains(
    ...domains: Domain[]
): Effect.Effect<Domain, never> {
    return Effect.sync(() => {
        const combined: Domain = []
        for (const domain of domains) {
            combined.push(...domain)
        }
        return combined
    })
}

/**
 * Combine multiple domains with OR logic
 */
export function combineDomainsOr(
    ...domains: Domain[]
): Effect.Effect<Domain, never> {
    return Effect.sync(() => {
        if (domains.length === 0) return []
        if (domains.length === 1) return domains[0]!

        const combined: Domain = []
        for (let i = 0; i < domains.length; i++) {
            if (i > 0) {
                combined.push('|')
            }
            combined.push(...domains[i]!)
        }
        return combined
    })
}

/**
 * Create a domain for searching by ID
 */
export function domainById(id: number): Effect.Effect<Domain, never> {
    return Effect.sync(() => [['id', '=', id]])
}

/**
 * Create a domain for searching by multiple IDs
 */
export function domainByIds(ids: number[]): Effect.Effect<Domain, never> {
    return Effect.sync(() => [['id', 'in', ids]])
}

/**
 * Create a domain for searching by name (case-insensitive)
 */
export function domainByName(name: string): Effect.Effect<Domain, never> {
    return Effect.sync(() => [['name', 'ilike', name]])
}

/**
 * Extract ID from Many2one field
 * Odoo Many2one fields can be: false, [id, "display_name"], or just id
 */
export function extractMany2oneId(
    value: boolean | number | [number, string] | undefined
): number | null {
    if (!value) return null
    if (Array.isArray(value)) return value[0]
    if (typeof value === 'number') return value
    return null
}

/**
 * Extract display name from Many2one field
 */
export function extractMany2oneName(
    value: boolean | number | [number, string] | undefined
): string | null {
    if (!value) return null
    if (Array.isArray(value)) return value[1]
    return null
}

/**
 * Create a Many2one value for write operations
 * Just use the ID number directly
 */
export function createMany2oneValue(id: number): number {
    return id
}

/**
 * Create a One2many/Many2many command to add a record
 * Command: (4, id, 0) - link to existing record
 */
export function createLinkCommand(id: number): [number, number, number] {
    return [4, id, 0]
}

/**
 * Create a One2many/Many2many command to remove a record
 * Command: (3, id, 0) - unlink record
 */
export function createUnlinkCommand(id: number): [number, number, number] {
    return [3, id, 0]
}

/**
 * Create a One2many/Many2many command to delete a record
 * Command: (2, id, 0) - delete record
 */
export function createDeleteCommand(id: number): [number, number, number] {
    return [2, id, 0]
}

/**
 * Create a One2many/Many2many command to create a new record
 * Command: (0, 0, values) - create new record
 */
export function createCreateCommand(
    values: Record<string, unknown>
): [number, number, Record<string, unknown>] {
    return [0, 0, values]
}

/**
 * Create a One2many/Many2many command to update a record
 * Command: (1, id, values) - update existing record
 */
export function createUpdateCommand(
    id: number,
    values: Record<string, unknown>
): [number, number, Record<string, unknown>] {
    return [1, id, values]
}

/**
 * Create a One2many/Many2many command to replace all records
 * Command: (6, 0, [ids]) - replace all
 */
export function createReplaceCommand(
    ids: number[]
): [number, number, number[]] {
    return [6, 0, ids]
}

/**
 * Create a One2many/Many2many command to clear all records
 * Command: (5, 0, 0) - remove all
 */
export function createClearCommand(): [number, number, number] {
    return [5, 0, 0]
}

/**
 * Format a number as Odoo currency amount (2 decimal places)
 */
export function formatCurrency(amount: number): string {
    return amount.toFixed(2)
}

/**
 * Parse Odoo boolean value
 * Odoo can return false, true, 0, or 1 for boolean fields
 */
export function parseBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') return value
    if (value === 1 || value === '1') return true
    if (value === 0 || value === '0') return false
    return Boolean(value)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate VAT number format (basic check)
 */
export function isValidVAT(vat: string): boolean {
    // Basic check: at least 2 chars
    return vat.length >= 2
}

/**
 * Get the current date in Odoo format
 */
export function getCurrentDate(): Effect.Effect<string, never> {
    return formatDate(new Date())
}

/**
 * Get the current datetime in Odoo format
 */
export function getCurrentDateTime(): Effect.Effect<string, never> {
    return formatDateTime(new Date())
}
