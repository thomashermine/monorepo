import { Data } from 'effect'

/**
 * Odoo API Types
 *
 * Type definitions for Odoo XMLRPC API
 * Documentation: https://www.odoo.com/documentation/17.0/developer/reference/external_api.html
 */

// ============================================================================
// Error Types
// ============================================================================

export class OdooError extends Data.TaggedError('OdooError')<{
    readonly message: string
    readonly code?: string
    readonly data?: unknown
}> {}

export class OdooAuthError extends Data.TaggedError('OdooAuthError')<{
    readonly message: string
}> {}

export class OdooNetworkError extends Data.TaggedError('OdooNetworkError')<{
    readonly message: string
    readonly cause?: unknown
}> {}

// ============================================================================
// Configuration
// ============================================================================

export interface OdooConfig {
    readonly url: string
    readonly database: string
    readonly username: string
    readonly password: string
    readonly timeout?: number
}

// ============================================================================
// Common Types
// ============================================================================

/**
 * Odoo record ID (integer)
 */
export type RecordId = number

/**
 * Odoo domain filter (array of conditions)
 * Example: [['is_company', '=', true], ['customer', '=', true]]
 */
export type Domain = Array<string | Array<string | number | boolean | number[]>>

/**
 * Fields to retrieve in queries
 * Use empty array for all fields, or specify field names
 */
export type Fields = string[]

/**
 * Odoo context for operations (can include lang, tz, etc.)
 */
export interface Context {
    lang?: string
    tz?: string
    [key: string]: unknown
}

/**
 * Search options
 */
export interface SearchOptions {
    offset?: number
    limit?: number
    order?: string
    context?: Context
}

/**
 * Generic Odoo record
 */
export interface OdooRecord {
    id: RecordId
    create_date?: string
    write_date?: string
    create_uid?: RecordId | [RecordId, string]
    write_uid?: RecordId | [RecordId, string]
    [key: string]: unknown
}

// ============================================================================
// Partner (res.partner) Types
// ============================================================================

export interface Partner extends OdooRecord {
    name: string
    email?: string
    phone?: string
    mobile?: string
    street?: string
    street2?: string
    city?: string
    state_id?: RecordId | [RecordId, string]
    country_id?: RecordId | [RecordId, string]
    zip?: string
    website?: string
    company_id?: RecordId | [RecordId, string]
    is_company?: boolean
    customer_rank?: number
    supplier_rank?: number
    comment?: string
    vat?: string
}

export interface CreatePartnerInput {
    name: string
    email?: string
    phone?: string
    mobile?: string
    street?: string
    street2?: string
    city?: string
    state_id?: RecordId
    country_id?: RecordId
    zip?: string
    website?: string
    is_company?: boolean
    customer_rank?: number
    supplier_rank?: number
    comment?: string
    vat?: string
    [key: string]: unknown
}

export interface UpdatePartnerInput
    extends Partial<
        Omit<CreatePartnerInput, keyof { [key: string]: unknown }>
    > {
    [key: string]: unknown
}

// ============================================================================
// Product (product.product) Types
// ============================================================================

export interface Product extends OdooRecord {
    name: string
    display_name?: string
    default_code?: string
    type?: 'consu' | 'service' | 'product'
    categ_id?: RecordId | [RecordId, string]
    list_price?: number
    standard_price?: number
    uom_id?: RecordId | [RecordId, string]
    uom_po_id?: RecordId | [RecordId, string]
    sale_ok?: boolean
    purchase_ok?: boolean
    active?: boolean
    barcode?: string
    description?: string
    description_sale?: string
    description_purchase?: string
    qty_available?: number
    virtual_available?: number
}

export interface CreateProductInput {
    name: string
    default_code?: string
    type?: 'consu' | 'service' | 'product'
    categ_id?: RecordId
    list_price?: number
    standard_price?: number
    sale_ok?: boolean
    purchase_ok?: boolean
    barcode?: string
    description?: string
    description_sale?: string
    [key: string]: unknown
}

export interface UpdateProductInput
    extends Partial<
        Omit<CreateProductInput, keyof { [key: string]: unknown }>
    > {
    [key: string]: unknown
}

// ============================================================================
// Sale Order (sale.order) Types
// ============================================================================

export type SaleOrderState = 'draft' | 'sent' | 'sale' | 'done' | 'cancel'

export interface SaleOrderLine extends OdooRecord {
    order_id?: RecordId | [RecordId, string]
    product_id?: RecordId | [RecordId, string]
    name?: string
    product_uom_qty?: number
    price_unit?: number
    price_subtotal?: number
    price_total?: number
    discount?: number
    tax_id?: RecordId[]
}

export interface SaleOrder extends OdooRecord {
    name: string
    partner_id: RecordId | [RecordId, string]
    partner_invoice_id?: RecordId | [RecordId, string]
    partner_shipping_id?: RecordId | [RecordId, string]
    date_order?: string
    validity_date?: string
    state?: SaleOrderState
    amount_untaxed?: number
    amount_tax?: number
    amount_total?: number
    currency_id?: RecordId | [RecordId, string]
    order_line?: SaleOrderLine[]
    note?: string
    user_id?: RecordId | [RecordId, string]
    team_id?: RecordId | [RecordId, string]
    company_id?: RecordId | [RecordId, string]
}

export interface CreateSaleOrderLineInput {
    product_id: RecordId
    product_uom_qty?: number
    price_unit?: number
    discount?: number
    name?: string
}

export interface CreateSaleOrderInput {
    partner_id: RecordId
    date_order?: string
    order_line?: Array<[number, number, CreateSaleOrderLineInput]>
    note?: string
    user_id?: RecordId
    team_id?: RecordId
    [key: string]: unknown
}

export interface UpdateSaleOrderInput {
    partner_id?: RecordId
    date_order?: string
    order_line?: Array<
        [number, number | RecordId, Partial<CreateSaleOrderLineInput>]
    >
    note?: string
    state?: SaleOrderState
    [key: string]: unknown
}

// ============================================================================
// Invoice (account.move) Types
// ============================================================================

export type InvoiceType =
    | 'out_invoice'
    | 'in_invoice'
    | 'out_refund'
    | 'in_refund'
export type InvoiceState = 'draft' | 'posted' | 'cancel'
export type PaymentState =
    | 'not_paid'
    | 'in_payment'
    | 'paid'
    | 'partial'
    | 'reversed'
    | 'invoicing_legacy'

export interface InvoiceLine extends OdooRecord {
    move_id?: RecordId | [RecordId, string]
    product_id?: RecordId | [RecordId, string]
    name?: string
    quantity?: number
    price_unit?: number
    price_subtotal?: number
    price_total?: number
    tax_ids?: RecordId[]
    account_id?: RecordId | [RecordId, string]
}

export interface Invoice extends OdooRecord {
    name?: string
    move_type?: InvoiceType
    partner_id: RecordId | [RecordId, string]
    invoice_date?: string
    invoice_date_due?: string
    state?: InvoiceState
    payment_state?: PaymentState
    amount_untaxed?: number
    amount_tax?: number
    amount_total?: number
    amount_residual?: number
    currency_id?: RecordId | [RecordId, string]
    invoice_line_ids?: InvoiceLine[]
    narration?: string
    ref?: string
    company_id?: RecordId | [RecordId, string]
}

export interface CreateInvoiceLineInput {
    product_id?: RecordId
    name: string
    quantity?: number
    price_unit?: number
    account_id?: RecordId
}

export interface CreateInvoiceInput {
    move_type: InvoiceType
    partner_id: RecordId
    invoice_date?: string
    invoice_date_due?: string
    invoice_line_ids?: Array<[number, number, CreateInvoiceLineInput]>
    narration?: string
    ref?: string
    [key: string]: unknown
}

export interface UpdateInvoiceInput {
    partner_id?: RecordId
    invoice_date?: string
    invoice_date_due?: string
    invoice_line_ids?: Array<
        [number, number | RecordId, Partial<CreateInvoiceLineInput>]
    >
    narration?: string
    state?: InvoiceState
    [key: string]: unknown
}

// ============================================================================
// Loyalty Card (loyalty.card) Types
// ============================================================================

export interface LoyaltyCard extends OdooRecord {
    partner_id: RecordId | [RecordId, string]
    program_id?: RecordId | [RecordId, string]
    points?: number
    code?: string
    expiration_date?: string
    source?: string
}

export interface CreateLoyaltyCardInput {
    partner_id: RecordId
    program_id?: RecordId
    points?: number
    code?: string
    expiration_date?: string
    [key: string]: unknown
}

export interface UpdateLoyaltyCardInput
    extends Partial<
        Omit<CreateLoyaltyCardInput, keyof { [key: string]: unknown }>
    > {
    [key: string]: unknown
}

// ============================================================================
// Generic Response Types
// ============================================================================

export interface SearchReadResponse<T = OdooRecord> {
    records: T[]
    length: number
}

export interface CreateResponse {
    id: RecordId
}

export interface WriteResponse {
    success: boolean
}

export interface UnlinkResponse {
    success: boolean
}

export interface FieldsGetResponse {
    [fieldName: string]: {
        type: string
        string: string
        help?: string
        required?: boolean
        readonly?: boolean
        [key: string]: unknown
    }
}

// ============================================================================
// Method Call Types
// ============================================================================

export interface ExecuteKwArgs {
    model: string
    method: string
    args?: unknown[]
    kwargs?: Record<string, unknown>
}

export interface SearchCountResponse {
    count: number
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Type for Odoo's name_get result
 */
export type NameGetResult = [RecordId, string]

/**
 * Type for Odoo's name_search result
 */
export type NameSearchResult = [RecordId, string][]
