import { Effect } from 'effect'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type * as xmlrpc from 'xmlrpc'

import { makeOdooServiceLayer, type OdooConfig, OdooService } from './index'
import {
    mockCreateInvoiceInput,
    mockCreatePartnerInput,
    mockCreateProductInput,
    mockCreateSaleOrderInput,
    mockInvoice,
    mockPartner,
    mockProduct,
    mockSaleOrder,
} from './mocks'

// Mock xmlrpc module
vi.mock('xmlrpc', () => ({
    createClient: vi.fn(() => ({
        methodCall: vi.fn(),
    })),
}))

describe('OdooService', () => {
    let mockClient: {
        methodCall: ReturnType<typeof vi.fn>
    }
    let config: OdooConfig

    beforeEach(async () => {
        vi.clearAllMocks()
        mockClient = {
            methodCall: vi.fn(),
        }

        // Mock createClient to return our mock client
        const xmlrpcModule = vi.mocked(await import('xmlrpc'))
        xmlrpcModule.createClient = vi.fn(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (_options: any) => mockClient as unknown as xmlrpc.Client
        ) as any

        config = {
            url: 'http://localhost:8069',
            database: 'test_db',
            username: 'admin',
            password: 'admin',
            timeout: 5000,
        }
    })

    describe('Authentication', () => {
        it('should authenticate successfully', async () => {
            const uid = 1
            mockClient.methodCall.mockImplementation(
                (method, params, callback) => {
                    callback(null, uid)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.authenticate()
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toBe(uid)
            expect(mockClient.methodCall).toHaveBeenCalledWith(
                'authenticate',
                expect.arrayContaining([
                    config.database,
                    config.username,
                    config.password,
                ]),
                expect.any(Function)
            )
        })

        it('should fail authentication with invalid credentials', async () => {
            mockClient.methodCall.mockImplementation(
                (method, params, callback) => {
                    callback(null, false)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.authenticate()
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromiseExit(
                program.pipe(Effect.provide(layer))
            )

            expect(result._tag).toBe('Failure')
        })

        it('should handle authentication errors', async () => {
            mockClient.methodCall.mockImplementation(
                (method, params, callback) => {
                    callback({
                        faultString: 'Authentication failed',
                        faultCode: 1,
                    })
                }
            )

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromiseExit(
                Effect.provide(Effect.void, layer)
            )

            expect(result._tag).toBe('Failure')
        })
    })

    describe('Partner Operations', () => {
        beforeEach(() => {
            // First call is authentication, return uid
            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, 1)
                }
            )
        })

        it('should get partners', async () => {
            const partners = [mockPartner(), mockPartner()]

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, partners)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getPartners()
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.records).toHaveLength(2)
            expect(result.length).toBe(2)
        })

        it('should get a single partner', async () => {
            const partner = mockPartner({ id: 1 })

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, [partner])
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getPartner(1)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.id).toBe(1)
        })

        it('should create a partner', async () => {
            const input = mockCreatePartnerInput()
            const newId = 42

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, newId)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.createPartner(input)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toBe(newId)
        })

        it('should update a partner', async () => {
            const partnerId = 1
            const update = { name: 'Updated Name' }

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.updatePartner(partnerId, update)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.success).toBe(true)
        })

        it('should delete a partner', async () => {
            const partnerId = 1

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.deletePartner(partnerId)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.success).toBe(true)
        })
    })

    describe('Product Operations', () => {
        beforeEach(() => {
            // First call is authentication
            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, 1)
                }
            )
        })

        it('should get products', async () => {
            const products = [mockProduct(), mockProduct()]

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, products)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getProducts()
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.records).toHaveLength(2)
        })

        it('should get a single product', async () => {
            const product = mockProduct({ id: 1 })

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, [product])
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getProduct(1)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.id).toBe(1)
        })

        it('should create a product', async () => {
            const input = mockCreateProductInput()
            const newId = 100

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, newId)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.createProduct(input)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toBe(newId)
        })

        it('should update a product', async () => {
            const productId = 1
            const update = { name: 'Updated Product' }

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.updateProduct(productId, update)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.success).toBe(true)
        })

        it('should delete a product', async () => {
            const productId = 1

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.deleteProduct(productId)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.success).toBe(true)
        })
    })

    describe('Sale Order Operations', () => {
        beforeEach(() => {
            // First call is authentication
            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, 1)
                }
            )
        })

        it('should get sale orders', async () => {
            const orders = [mockSaleOrder(), mockSaleOrder()]

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, orders)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getSaleOrders()
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.records).toHaveLength(2)
        })

        it('should get a single sale order', async () => {
            const order = mockSaleOrder({ id: 1 })

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, [order])
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getSaleOrder(1)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.id).toBe(1)
        })

        it('should create a sale order', async () => {
            const input = mockCreateSaleOrderInput()
            const newId = 200

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, newId)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.createSaleOrder(input)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toBe(newId)
        })

        it('should update a sale order', async () => {
            const orderId = 1
            const update = { note: 'Updated note' }

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.updateSaleOrder(orderId, update)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.success).toBe(true)
        })

        it('should confirm a sale order', async () => {
            const orderId = 1

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.confirmSaleOrder(orderId)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toBe(true)
        })

        it('should cancel a sale order', async () => {
            const orderId = 1

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.cancelSaleOrder(orderId)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toBe(true)
        })

        it('should delete a sale order', async () => {
            const orderId = 1

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.deleteSaleOrder(orderId)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.success).toBe(true)
        })
    })

    describe('Invoice Operations', () => {
        beforeEach(() => {
            // First call is authentication
            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, 1)
                }
            )
        })

        it('should get invoices', async () => {
            const invoices = [mockInvoice(), mockInvoice()]

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, invoices)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getInvoices()
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.records).toHaveLength(2)
        })

        it('should get a single invoice', async () => {
            const invoice = mockInvoice({ id: 1 })

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, [invoice])
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getInvoice(1)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.id).toBe(1)
        })

        it('should create an invoice', async () => {
            const input = mockCreateInvoiceInput()
            const newId = 300

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, newId)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.createInvoice(input)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toBe(newId)
        })

        it('should update an invoice', async () => {
            const invoiceId = 1
            const update = { narration: 'Updated note' }

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.updateInvoice(invoiceId, update)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.success).toBe(true)
        })

        it('should post an invoice', async () => {
            const invoiceId = 1

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.postInvoice(invoiceId)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toBe(true)
        })

        it('should delete an invoice', async () => {
            const invoiceId = 1

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.deleteInvoice(invoiceId)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.success).toBe(true)
        })
    })

    describe('Generic CRUD Operations', () => {
        beforeEach(() => {
            // First call is authentication
            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, 1)
                }
            )
        })

        it('should search records', async () => {
            const ids = [1, 2, 3]

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, ids)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.search('res.partner', [
                    ['is_company', '=', true],
                ])
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toEqual(ids)
        })

        it('should search count records', async () => {
            const count = 42

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, count)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.searchCount('res.partner', [])
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toBe(count)
        })

        it('should read records', async () => {
            const records = [mockPartner({ id: 1 }), mockPartner({ id: 2 })]

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, records)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.read('res.partner', [1, 2])
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toHaveLength(2)
        })

        it('should search and read records', async () => {
            const records = [mockPartner(), mockPartner()]

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, records)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.searchRead('res.partner', [])
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.records).toHaveLength(2)
            expect(result.length).toBe(2)
        })

        it('should create a record', async () => {
            const newId = 99

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, newId)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.create('res.partner', { name: 'Test' })
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toBe(newId)
        })

        it('should write/update records', async () => {
            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.write('res.partner', [1], {
                    name: 'Updated',
                })
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.success).toBe(true)
        })

        it('should unlink/delete records', async () => {
            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, true)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.unlink('res.partner', [1])
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.success).toBe(true)
        })

        it('should get field definitions', async () => {
            const fields = {
                name: { type: 'char', string: 'Name' },
                email: { type: 'char', string: 'Email' },
            }

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, fields)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.fieldsGet('res.partner')
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toHaveProperty('name')
            expect(result).toHaveProperty('email')
        })

        it('should execute custom methods', async () => {
            const customResult = { success: true, data: 'custom' }

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, customResult)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.execute({
                    model: 'res.partner',
                    method: 'custom_method',
                    args: [1, 2, 3],
                })
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result).toEqual(customResult)
        })
    })

    describe('Error Handling', () => {
        beforeEach(() => {
            // First call is authentication
            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, 1)
                }
            )
        })

        it('should handle Odoo errors', async () => {
            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback({
                        faultString: 'Record not found',
                        faultCode: 2,
                    })
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getPartner(9999)
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromiseExit(
                program.pipe(Effect.provide(layer))
            )

            expect(result._tag).toBe('Failure')
        })

        it('should handle network errors', async () => {
            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(new Error('Network timeout'))
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getPartners()
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromiseExit(
                program.pipe(Effect.provide(layer))
            )

            expect(result._tag).toBe('Failure')
        })
    })

    describe('Search Options', () => {
        beforeEach(() => {
            // First call is authentication
            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, 1)
                }
            )
        })

        it('should apply limit and offset', async () => {
            const partners = [mockPartner()]

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, partners)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getPartners([], [], {
                    limit: 10,
                    offset: 20,
                })
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.records).toHaveLength(1)
        })

        it('should apply order', async () => {
            const partners = [mockPartner()]

            mockClient.methodCall.mockImplementationOnce(
                (method, params, callback) => {
                    callback(null, partners)
                }
            )

            const program = Effect.gen(function* () {
                const service = yield* OdooService
                return yield* service.getPartners([], [], {
                    order: 'name ASC',
                })
            })

            const layer = makeOdooServiceLayer(config)
            const result = await Effect.runPromise(
                program.pipe(Effect.provide(layer))
            )

            expect(result.records).toHaveLength(1)
        })
    })
})
