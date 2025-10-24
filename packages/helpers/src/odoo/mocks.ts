import { faker } from '@faker-js/faker'

import type {
    CreateInvoiceInput,
    CreatePartnerInput,
    CreateProductInput,
    CreateSaleOrderInput,
    FieldsGetResponse,
    Invoice,
    InvoiceLine,
    InvoiceState,
    InvoiceType,
    Partner,
    PaymentState,
    Product,
    RecordId,
    SaleOrder,
    SaleOrderLine,
    SaleOrderState,
    SearchReadResponse,
} from './types'

/**
 * Odoo API Mocks Generator
 *
 * Utilities to generate mock data for the Odoo API using faker-js
 */

// ============================================================================
// Mock Generators - Partners
// ============================================================================

/**
 * Generate a mock Partner (res.partner)
 */
export const mockPartner = (overrides?: Partial<Partner>): Partner => {
    const isCompany = faker.datatype.boolean()
    const id = faker.number.int({ min: 1, max: 10000 })

    return {
        id,
        name: isCompany ? faker.company.name() : faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        mobile: faker.phone.number(),
        street: faker.location.streetAddress(),
        street2: faker.datatype.boolean()
            ? faker.location.secondaryAddress()
            : undefined,
        city: faker.location.city(),
        state_id: [
            faker.number.int({ min: 1, max: 100 }),
            faker.location.state(),
        ],
        country_id: [
            faker.number.int({ min: 1, max: 250 }),
            faker.location.country(),
        ],
        zip: faker.location.zipCode(),
        website: faker.datatype.boolean() ? faker.internet.url() : undefined,
        company_id: [1, 'My Company'],
        is_company: isCompany,
        customer_rank: faker.number.int({ min: 0, max: 100 }),
        supplier_rank: faker.number.int({ min: 0, max: 50 }),
        comment: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
        vat: isCompany ? `US${faker.string.alphanumeric(9)}` : undefined,
        create_date: faker.date.past().toISOString(),
        write_date: faker.date.recent().toISOString(),
        create_uid: [1, 'Administrator'],
        write_uid: [1, 'Administrator'],
        ...overrides,
    }
}

/**
 * Generate mock Partners response
 */
export const mockPartnersResponse = (
    count: number = 3,
    overrides?: Partial<SearchReadResponse<Partner>>
): SearchReadResponse<Partner> => {
    const records = Array.from({ length: count }, () => mockPartner())
    return {
        records,
        length: records.length,
        ...overrides,
    }
}

/**
 * Generate mock CreatePartnerInput
 */
export const mockCreatePartnerInput = (
    overrides?: Partial<CreatePartnerInput>
): CreatePartnerInput => {
    const isCompany = faker.datatype.boolean()

    return {
        name: isCompany ? faker.company.name() : faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        zip: faker.location.zipCode(),
        is_company: isCompany,
        customer_rank: 1,
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Products
// ============================================================================

/**
 * Generate a mock Product (product.product)
 */
export const mockProduct = (overrides?: Partial<Product>): Product => {
    const id = faker.number.int({ min: 1, max: 10000 })
    const productType = faker.helpers.arrayElement([
        'consu',
        'service',
        'product',
    ] as const)

    return {
        id,
        name: faker.commerce.productName(),
        display_name: faker.commerce.productName(),
        default_code: faker.string.alphanumeric(8).toUpperCase(),
        type: productType,
        categ_id: [
            faker.number.int({ min: 1, max: 50 }),
            faker.commerce.department(),
        ],
        list_price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        standard_price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
        uom_id: [1, 'Units'],
        uom_po_id: [1, 'Units'],
        sale_ok: faker.datatype.boolean(),
        purchase_ok: faker.datatype.boolean(),
        active: faker.datatype.boolean({ probability: 0.9 }),
        barcode: faker.string.numeric(13),
        description: faker.commerce.productDescription(),
        description_sale: faker.commerce.productDescription(),
        description_purchase: faker.commerce.productDescription(),
        qty_available: faker.number.int({ min: 0, max: 1000 }),
        virtual_available: faker.number.int({ min: 0, max: 1000 }),
        create_date: faker.date.past().toISOString(),
        write_date: faker.date.recent().toISOString(),
        create_uid: [1, 'Administrator'],
        write_uid: [1, 'Administrator'],
        ...overrides,
    }
}

/**
 * Generate mock Products response
 */
export const mockProductsResponse = (
    count: number = 5,
    overrides?: Partial<SearchReadResponse<Product>>
): SearchReadResponse<Product> => {
    const records = Array.from({ length: count }, () => mockProduct())
    return {
        records,
        length: records.length,
        ...overrides,
    }
}

/**
 * Generate mock CreateProductInput
 */
export const mockCreateProductInput = (
    overrides?: Partial<CreateProductInput>
): CreateProductInput => {
    return {
        name: faker.commerce.productName(),
        type: 'consu',
        list_price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        sale_ok: true,
        purchase_ok: true,
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Sale Orders
// ============================================================================

/**
 * Generate a mock Sale Order Line
 */
export const mockSaleOrderLine = (
    overrides?: Partial<SaleOrderLine>
): SaleOrderLine => {
    const id = faker.number.int({ min: 1, max: 10000 })
    const productId = faker.number.int({ min: 1, max: 1000 })
    const qty = faker.number.int({ min: 1, max: 10 })
    const priceUnit = parseFloat(faker.commerce.price({ min: 10, max: 500 }))
    const discount = faker.datatype.boolean()
        ? faker.number.int({ min: 0, max: 50 })
        : 0
    const priceSubtotal = qty * priceUnit * (1 - discount / 100)

    return {
        id,
        order_id: [faker.number.int({ min: 1, max: 1000 }), 'SO001'],
        product_id: [productId, faker.commerce.productName()],
        name: faker.commerce.productName(),
        product_uom_qty: qty,
        price_unit: priceUnit,
        price_subtotal: priceSubtotal,
        price_total: priceSubtotal,
        discount,
        tax_id: [],
        create_date: faker.date.past().toISOString(),
        write_date: faker.date.recent().toISOString(),
        ...overrides,
    }
}

/**
 * Generate a mock Sale Order (sale.order)
 */
export const mockSaleOrder = (overrides?: Partial<SaleOrder>): SaleOrder => {
    const id = faker.number.int({ min: 1, max: 10000 })
    const orderLines = Array.from(
        { length: faker.number.int({ min: 1, max: 5 }) },
        () => mockSaleOrderLine()
    )
    const amountUntaxed = orderLines.reduce(
        (sum, line) => sum + (line.price_subtotal ?? 0),
        0
    )
    const amountTax = amountUntaxed * 0.1 // 10% tax
    const amountTotal = amountUntaxed + amountTax

    return {
        id,
        name: `SO${faker.string.numeric(5)}`,
        partner_id: [
            faker.number.int({ min: 1, max: 1000 }),
            faker.company.name(),
        ],
        date_order: faker.date.recent().toISOString(),
        state: faker.helpers.arrayElement([
            'draft',
            'sent',
            'sale',
            'done',
            'cancel',
        ] as SaleOrderState[]),
        amount_untaxed: amountUntaxed,
        amount_tax: amountTax,
        amount_total: amountTotal,
        currency_id: [1, 'USD'],
        order_line: orderLines,
        note: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
        user_id: [1, 'Administrator'],
        company_id: [1, 'My Company'],
        create_date: faker.date.past().toISOString(),
        write_date: faker.date.recent().toISOString(),
        create_uid: [1, 'Administrator'],
        write_uid: [1, 'Administrator'],
        ...overrides,
    }
}

/**
 * Generate mock Sale Orders response
 */
export const mockSaleOrdersResponse = (
    count: number = 5,
    overrides?: Partial<SearchReadResponse<SaleOrder>>
): SearchReadResponse<SaleOrder> => {
    const records = Array.from({ length: count }, () => mockSaleOrder())
    return {
        records,
        length: records.length,
        ...overrides,
    }
}

/**
 * Generate mock CreateSaleOrderInput
 */
export const mockCreateSaleOrderInput = (
    overrides?: Partial<CreateSaleOrderInput>
): CreateSaleOrderInput => {
    return {
        partner_id: faker.number.int({ min: 1, max: 1000 }),
        order_line: [
            [
                0,
                0,
                {
                    product_id: faker.number.int({ min: 1, max: 500 }),
                    product_uom_qty: faker.number.int({ min: 1, max: 10 }),
                    price_unit: parseFloat(
                        faker.commerce.price({ min: 10, max: 500 })
                    ),
                },
            ],
        ],
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Invoices
// ============================================================================

/**
 * Generate a mock Invoice Line
 */
export const mockInvoiceLine = (
    overrides?: Partial<InvoiceLine>
): InvoiceLine => {
    const id = faker.number.int({ min: 1, max: 10000 })
    const qty = faker.number.int({ min: 1, max: 10 })
    const priceUnit = parseFloat(faker.commerce.price({ min: 10, max: 500 }))
    const priceSubtotal = qty * priceUnit

    return {
        id,
        move_id: [faker.number.int({ min: 1, max: 1000 }), 'INV/2024/0001'],
        product_id: [
            faker.number.int({ min: 1, max: 1000 }),
            faker.commerce.productName(),
        ],
        name: faker.commerce.productName(),
        quantity: qty,
        price_unit: priceUnit,
        price_subtotal: priceSubtotal,
        price_total: priceSubtotal,
        tax_ids: [],
        account_id: [1, 'Product Sales'],
        create_date: faker.date.past().toISOString(),
        write_date: faker.date.recent().toISOString(),
        ...overrides,
    }
}

/**
 * Generate a mock Invoice (account.move)
 */
export const mockInvoice = (overrides?: Partial<Invoice>): Invoice => {
    const id = faker.number.int({ min: 1, max: 10000 })
    const invoiceType = faker.helpers.arrayElement([
        'out_invoice',
        'in_invoice',
        'out_refund',
        'in_refund',
    ] as InvoiceType[])
    const state = faker.helpers.arrayElement([
        'draft',
        'posted',
        'cancel',
    ] as InvoiceState[])
    const invoiceLines = Array.from(
        { length: faker.number.int({ min: 1, max: 5 }) },
        () => mockInvoiceLine()
    )
    const amountUntaxed = invoiceLines.reduce(
        (sum, line) => sum + (line.price_subtotal ?? 0),
        0
    )
    const amountTax = amountUntaxed * 0.1 // 10% tax
    const amountTotal = amountUntaxed + amountTax
    const amountResidual =
        state === 'posted'
            ? faker.number.float({ min: 0, max: amountTotal })
            : 0

    return {
        id,
        name:
            state === 'draft'
                ? undefined
                : `INV/${new Date().getFullYear()}/${faker.string.numeric(4)}`,
        move_type: invoiceType,
        partner_id: [
            faker.number.int({ min: 1, max: 1000 }),
            faker.company.name(),
        ],
        invoice_date: faker.date.recent().toISOString().split('T')[0],
        invoice_date_due: faker.date.future().toISOString().split('T')[0],
        state,
        payment_state: faker.helpers.arrayElement([
            'not_paid',
            'in_payment',
            'paid',
            'partial',
        ] as PaymentState[]),
        amount_untaxed: amountUntaxed,
        amount_tax: amountTax,
        amount_total: amountTotal,
        amount_residual: amountResidual,
        currency_id: [1, 'USD'],
        invoice_line_ids: invoiceLines,
        narration: faker.datatype.boolean()
            ? faker.lorem.paragraph()
            : undefined,
        ref: faker.datatype.boolean()
            ? `REF-${faker.string.numeric(6)}`
            : undefined,
        company_id: [1, 'My Company'],
        create_date: faker.date.past().toISOString(),
        write_date: faker.date.recent().toISOString(),
        create_uid: [1, 'Administrator'],
        write_uid: [1, 'Administrator'],
        ...overrides,
    }
}

/**
 * Generate mock Invoices response
 */
export const mockInvoicesResponse = (
    count: number = 5,
    overrides?: Partial<SearchReadResponse<Invoice>>
): SearchReadResponse<Invoice> => {
    const records = Array.from({ length: count }, () => mockInvoice())
    return {
        records,
        length: records.length,
        ...overrides,
    }
}

/**
 * Generate mock CreateInvoiceInput
 */
export const mockCreateInvoiceInput = (
    overrides?: Partial<CreateInvoiceInput>
): CreateInvoiceInput => {
    return {
        move_type: 'out_invoice',
        partner_id: faker.number.int({ min: 1, max: 1000 }),
        invoice_line_ids: [
            [
                0,
                0,
                {
                    name: faker.commerce.productName(),
                    quantity: faker.number.int({ min: 1, max: 10 }),
                    price_unit: parseFloat(
                        faker.commerce.price({ min: 10, max: 500 })
                    ),
                },
            ],
        ],
        ...overrides,
    }
}

// ============================================================================
// Mock Generators - Generic
// ============================================================================

/**
 * Generate mock record IDs
 */
export const mockRecordIds = (count: number = 5): RecordId[] => {
    return Array.from({ length: count }, () =>
        faker.number.int({ min: 1, max: 10000 })
    )
}

/**
 * Generate mock FieldsGet response
 */
export const mockFieldsGetResponse = (
    fields: string[] = ['name', 'email', 'phone']
): FieldsGetResponse => {
    const response: FieldsGetResponse = {}

    for (const field of fields) {
        response[field] = {
            type: faker.helpers.arrayElement([
                'char',
                'text',
                'integer',
                'float',
                'boolean',
                'many2one',
            ]),
            string: faker.lorem.words(2),
            help: faker.lorem.sentence(),
            required: faker.datatype.boolean(),
            readonly: faker.datatype.boolean(),
        }
    }

    return response
}

/**
 * Generate a mock Many2one value
 */
export const mockMany2one = (): [number, string] => {
    return [faker.number.int({ min: 1, max: 1000 }), faker.lorem.words(3)]
}

/**
 * Generate mock authentication UID
 */
export const mockAuthUid = (): number => {
    return faker.number.int({ min: 1, max: 100 })
}
