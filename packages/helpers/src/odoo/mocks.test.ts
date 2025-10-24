import { describe, expect, it } from 'vitest'

import {
    mockAuthUid,
    mockCreateInvoiceInput,
    mockCreatePartnerInput,
    mockCreateProductInput,
    mockCreateSaleOrderInput,
    mockFieldsGetResponse,
    mockInvoice,
    mockInvoiceLine,
    mockInvoicesResponse,
    mockMany2one,
    mockPartner,
    mockPartnersResponse,
    mockProduct,
    mockProductsResponse,
    mockRecordIds,
    mockSaleOrder,
    mockSaleOrderLine,
    mockSaleOrdersResponse,
} from './mocks'

describe('Odoo Mocks', () => {
    describe('Partner Mocks', () => {
        it('should generate a valid partner', () => {
            const partner = mockPartner()

            expect(partner).toBeDefined()
            expect(partner.id).toBeGreaterThan(0)
            expect(partner.name).toBeTruthy()
            expect(partner.email).toBeTruthy()
            expect(partner.city).toBeTruthy()
            expect(typeof partner.is_company).toBe('boolean')
        })

        it('should respect overrides for partner', () => {
            const partner = mockPartner({
                name: 'Test Company',
                email: 'test@example.com',
                is_company: true,
            })

            expect(partner.name).toBe('Test Company')
            expect(partner.email).toBe('test@example.com')
            expect(partner.is_company).toBe(true)
        })

        it('should generate partners response', () => {
            const response = mockPartnersResponse(5)

            expect(response.records).toHaveLength(5)
            expect(response.length).toBe(5)
            response.records.forEach((partner) => {
                expect(partner.id).toBeGreaterThan(0)
                expect(partner.name).toBeTruthy()
            })
        })

        it('should generate create partner input', () => {
            const input = mockCreatePartnerInput()

            expect(input.name).toBeTruthy()
            expect(input.email).toBeTruthy()
            expect(input.city).toBeTruthy()
            expect(typeof input.is_company).toBe('boolean')
        })
    })

    describe('Product Mocks', () => {
        it('should generate a valid product', () => {
            const product = mockProduct()

            expect(product).toBeDefined()
            expect(product.id).toBeGreaterThan(0)
            expect(product.name).toBeTruthy()
            expect(product.list_price).toBeGreaterThan(0)
            expect(['consu', 'service', 'product']).toContain(product.type)
        })

        it('should respect overrides for product', () => {
            const product = mockProduct({
                name: 'Test Product',
                list_price: 99.99,
                type: 'service',
            })

            expect(product.name).toBe('Test Product')
            expect(product.list_price).toBe(99.99)
            expect(product.type).toBe('service')
        })

        it('should generate products response', () => {
            const response = mockProductsResponse(10)

            expect(response.records).toHaveLength(10)
            expect(response.length).toBe(10)
            response.records.forEach((product) => {
                expect(product.id).toBeGreaterThan(0)
                expect(product.name).toBeTruthy()
            })
        })

        it('should generate create product input', () => {
            const input = mockCreateProductInput()

            expect(input.name).toBeTruthy()
            expect(input.type).toBe('consu')
            expect(input.sale_ok).toBe(true)
            expect(input.list_price).toBeGreaterThan(0)
        })
    })

    describe('Sale Order Mocks', () => {
        it('should generate a valid sale order line', () => {
            const line = mockSaleOrderLine()

            expect(line).toBeDefined()
            expect(line.id).toBeGreaterThan(0)
            expect(line.product_id).toBeTruthy()
            expect(line.product_uom_qty).toBeGreaterThan(0)
            expect(line.price_unit).toBeGreaterThan(0)
            expect(line.price_subtotal).toBeGreaterThan(0)
        })

        it('should generate a valid sale order', () => {
            const order = mockSaleOrder()

            expect(order).toBeDefined()
            expect(order.id).toBeGreaterThan(0)
            expect(order.name).toBeTruthy()
            expect(order.partner_id).toBeTruthy()
            expect(order.amount_total).toBeGreaterThan(0)
            expect(order.order_line).toBeTruthy()
            expect(order.order_line!.length).toBeGreaterThan(0)
        })

        it('should calculate amounts correctly', () => {
            const order = mockSaleOrder()

            expect(order.amount_total).toBeGreaterThan(order.amount_untaxed!)
            expect(order.amount_total).toBe(
                order.amount_untaxed! + order.amount_tax!
            )
        })

        it('should respect overrides for sale order', () => {
            const order = mockSaleOrder({
                name: 'SO12345',
                state: 'sale',
            })

            expect(order.name).toBe('SO12345')
            expect(order.state).toBe('sale')
        })

        it('should generate sale orders response', () => {
            const response = mockSaleOrdersResponse(3)

            expect(response.records).toHaveLength(3)
            expect(response.length).toBe(3)
            response.records.forEach((order) => {
                expect(order.id).toBeGreaterThan(0)
                expect(order.name).toBeTruthy()
            })
        })

        it('should generate create sale order input', () => {
            const input = mockCreateSaleOrderInput()

            expect(input.partner_id).toBeGreaterThan(0)
            expect(input.order_line).toBeTruthy()
            expect(input.order_line!.length).toBeGreaterThan(0)
        })
    })

    describe('Invoice Mocks', () => {
        it('should generate a valid invoice line', () => {
            const line = mockInvoiceLine()

            expect(line).toBeDefined()
            expect(line.id).toBeGreaterThan(0)
            expect(line.name).toBeTruthy()
            expect(line.quantity).toBeGreaterThan(0)
            expect(line.price_unit).toBeGreaterThan(0)
            expect(line.price_subtotal).toBeGreaterThan(0)
        })

        it('should generate a valid invoice', () => {
            const invoice = mockInvoice()

            expect(invoice).toBeDefined()
            expect(invoice.id).toBeGreaterThan(0)
            expect(invoice.move_type).toBeTruthy()
            expect(invoice.partner_id).toBeTruthy()
            expect(invoice.amount_total).toBeGreaterThan(0)
            expect(invoice.invoice_line_ids).toBeTruthy()
            expect(invoice.invoice_line_ids!.length).toBeGreaterThan(0)
        })

        it('should calculate invoice amounts correctly', () => {
            const invoice = mockInvoice()

            expect(invoice.amount_total).toBeGreaterThan(
                invoice.amount_untaxed!
            )
            expect(invoice.amount_total).toBe(
                invoice.amount_untaxed! + invoice.amount_tax!
            )
        })

        it('should respect overrides for invoice', () => {
            const invoice = mockInvoice({
                move_type: 'out_invoice',
                state: 'posted',
            })

            expect(invoice.move_type).toBe('out_invoice')
            expect(invoice.state).toBe('posted')
        })

        it('should generate invoices response', () => {
            const response = mockInvoicesResponse(4)

            expect(response.records).toHaveLength(4)
            expect(response.length).toBe(4)
            response.records.forEach((invoice) => {
                expect(invoice.id).toBeGreaterThan(0)
                expect(invoice.move_type).toBeTruthy()
            })
        })

        it('should generate create invoice input', () => {
            const input = mockCreateInvoiceInput()

            expect(input.move_type).toBe('out_invoice')
            expect(input.partner_id).toBeGreaterThan(0)
            expect(input.invoice_line_ids).toBeTruthy()
            expect(input.invoice_line_ids!.length).toBeGreaterThan(0)
        })
    })

    describe('Generic Mocks', () => {
        it('should generate record IDs', () => {
            const ids = mockRecordIds(10)

            expect(ids).toHaveLength(10)
            ids.forEach((id) => {
                expect(id).toBeGreaterThan(0)
            })
        })

        it('should generate fields get response', () => {
            const fields = ['name', 'email', 'phone', 'street']
            const response = mockFieldsGetResponse(fields)

            expect(Object.keys(response)).toHaveLength(4)
            fields.forEach((field) => {
                expect(response[field]).toBeDefined()
                expect(response[field].type).toBeTruthy()
                expect(response[field].string).toBeTruthy()
            })
        })

        it('should generate many2one value', () => {
            const many2one = mockMany2one()

            expect(Array.isArray(many2one)).toBe(true)
            expect(many2one).toHaveLength(2)
            expect(many2one[0]).toBeGreaterThan(0)
            expect(many2one[1]).toBeTruthy()
        })

        it('should generate auth UID', () => {
            const uid = mockAuthUid()

            expect(uid).toBeGreaterThan(0)
            expect(uid).toBeLessThanOrEqual(100)
        })
    })

    describe('Mock consistency', () => {
        it('should generate unique IDs for multiple partners', () => {
            const partners = Array.from({ length: 10 }, () => mockPartner())
            const ids = partners.map((p) => p.id)

            // While IDs might occasionally collide with faker, they should mostly be unique
            const uniqueIds = new Set(ids)
            expect(uniqueIds.size).toBeGreaterThan(5)
        })

        it('should maintain data relationships in sale orders', () => {
            const order = mockSaleOrder()

            if (order.order_line && order.order_line.length > 0) {
                const lineTotal = order.order_line.reduce(
                    (sum, line) => sum + (line.price_subtotal ?? 0),
                    0
                )
                expect(
                    Math.abs(lineTotal - order.amount_untaxed!)
                ).toBeLessThan(0.01)
            }
        })

        it('should maintain data relationships in invoices', () => {
            const invoice = mockInvoice()

            if (
                invoice.invoice_line_ids &&
                invoice.invoice_line_ids.length > 0
            ) {
                const lineTotal = invoice.invoice_line_ids.reduce(
                    (sum, line) => sum + (line.price_subtotal ?? 0),
                    0
                )
                expect(
                    Math.abs(lineTotal - invoice.amount_untaxed!)
                ).toBeLessThan(0.01)
            }
        })
    })
})
