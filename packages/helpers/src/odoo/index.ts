import { Config, Context, Effect, Layer } from 'effect'
import * as xmlrpc from 'xmlrpc'

import {
    type CreateInvoiceInput,
    type CreatePartnerInput,
    type CreateProductInput,
    type CreateResponse,
    type CreateSaleOrderInput,
    type Domain,
    type ExecuteKwArgs,
    type Fields,
    type FieldsGetResponse,
    type Invoice,
    OdooAuthError,
    type OdooConfig,
    OdooError,
    OdooNetworkError,
    type OdooRecord,
    type Partner,
    type Product,
    type RecordId,
    type SaleOrder,
    type SearchCountResponse,
    type SearchOptions,
    type SearchReadResponse,
    type UnlinkResponse,
    type UpdateInvoiceInput,
    type UpdatePartnerInput,
    type UpdateProductInput,
    type UpdateSaleOrderInput,
    type WriteResponse,
} from './types'

/**
 * Odoo API Service
 *
 * A comprehensive Effect-based service for interacting with Odoo via XMLRPC
 * Documentation: https://www.odoo.com/documentation/17.0/developer/reference/external_api.html
 */

// Re-export all types
export * from './types'

export class OdooService extends Context.Tag('OdooService')<
    OdooService,
    {
        // Authentication
        readonly authenticate: () => Effect.Effect<
            number,
            OdooAuthError | OdooNetworkError
        >

        // Generic CRUD operations
        readonly search: (
            model: string,
            domain: Domain,
            options?: SearchOptions
        ) => Effect.Effect<RecordId[], OdooError | OdooNetworkError>

        readonly searchCount: (
            model: string,
            domain: Domain
        ) => Effect.Effect<number, OdooError | OdooNetworkError>

        readonly read: <T = OdooRecord>(
            model: string,
            ids: RecordId[],
            fields?: Fields
        ) => Effect.Effect<T[], OdooError | OdooNetworkError>

        readonly searchRead: <T = OdooRecord>(
            model: string,
            domain: Domain,
            fields?: Fields,
            options?: SearchOptions
        ) => Effect.Effect<SearchReadResponse<T>, OdooError | OdooNetworkError>

        readonly create: (
            model: string,
            values: Record<string, unknown>
        ) => Effect.Effect<RecordId, OdooError | OdooNetworkError>

        readonly write: (
            model: string,
            ids: RecordId[],
            values: Record<string, unknown>
        ) => Effect.Effect<WriteResponse, OdooError | OdooNetworkError>

        readonly unlink: (
            model: string,
            ids: RecordId[]
        ) => Effect.Effect<UnlinkResponse, OdooError | OdooNetworkError>

        readonly fieldsGet: (
            model: string,
            fields?: Fields
        ) => Effect.Effect<FieldsGetResponse, OdooError | OdooNetworkError>

        readonly execute: <T = unknown>(
            args: ExecuteKwArgs
        ) => Effect.Effect<T, OdooError | OdooNetworkError>

        // Partner operations
        readonly getPartners: (
            domain?: Domain,
            fields?: Fields,
            options?: SearchOptions
        ) => Effect.Effect<
            SearchReadResponse<Partner>,
            OdooError | OdooNetworkError
        >

        readonly getPartner: (
            id: RecordId,
            fields?: Fields
        ) => Effect.Effect<Partner, OdooError | OdooNetworkError>

        readonly createPartner: (
            input: CreatePartnerInput
        ) => Effect.Effect<RecordId, OdooError | OdooNetworkError>

        readonly updatePartner: (
            id: RecordId,
            input: UpdatePartnerInput
        ) => Effect.Effect<WriteResponse, OdooError | OdooNetworkError>

        readonly deletePartner: (
            id: RecordId
        ) => Effect.Effect<UnlinkResponse, OdooError | OdooNetworkError>

        // Product operations
        readonly getProducts: (
            domain?: Domain,
            fields?: Fields,
            options?: SearchOptions
        ) => Effect.Effect<
            SearchReadResponse<Product>,
            OdooError | OdooNetworkError
        >

        readonly getProduct: (
            id: RecordId,
            fields?: Fields
        ) => Effect.Effect<Product, OdooError | OdooNetworkError>

        readonly createProduct: (
            input: CreateProductInput
        ) => Effect.Effect<RecordId, OdooError | OdooNetworkError>

        readonly updateProduct: (
            id: RecordId,
            input: UpdateProductInput
        ) => Effect.Effect<WriteResponse, OdooError | OdooNetworkError>

        readonly deleteProduct: (
            id: RecordId
        ) => Effect.Effect<UnlinkResponse, OdooError | OdooNetworkError>

        // Sale Order operations
        readonly getSaleOrders: (
            domain?: Domain,
            fields?: Fields,
            options?: SearchOptions
        ) => Effect.Effect<
            SearchReadResponse<SaleOrder>,
            OdooError | OdooNetworkError
        >

        readonly getSaleOrder: (
            id: RecordId,
            fields?: Fields
        ) => Effect.Effect<SaleOrder, OdooError | OdooNetworkError>

        readonly createSaleOrder: (
            input: CreateSaleOrderInput
        ) => Effect.Effect<RecordId, OdooError | OdooNetworkError>

        readonly updateSaleOrder: (
            id: RecordId,
            input: UpdateSaleOrderInput
        ) => Effect.Effect<WriteResponse, OdooError | OdooNetworkError>

        readonly confirmSaleOrder: (
            id: RecordId
        ) => Effect.Effect<boolean, OdooError | OdooNetworkError>

        readonly cancelSaleOrder: (
            id: RecordId
        ) => Effect.Effect<boolean, OdooError | OdooNetworkError>

        readonly deleteSaleOrder: (
            id: RecordId
        ) => Effect.Effect<UnlinkResponse, OdooError | OdooNetworkError>

        // Invoice operations
        readonly getInvoices: (
            domain?: Domain,
            fields?: Fields,
            options?: SearchOptions
        ) => Effect.Effect<
            SearchReadResponse<Invoice>,
            OdooError | OdooNetworkError
        >

        readonly getInvoice: (
            id: RecordId,
            fields?: Fields
        ) => Effect.Effect<Invoice, OdooError | OdooNetworkError>

        readonly createInvoice: (
            input: CreateInvoiceInput
        ) => Effect.Effect<RecordId, OdooError | OdooNetworkError>

        readonly updateInvoice: (
            id: RecordId,
            input: UpdateInvoiceInput
        ) => Effect.Effect<WriteResponse, OdooError | OdooNetworkError>

        readonly postInvoice: (
            id: RecordId
        ) => Effect.Effect<boolean, OdooError | OdooNetworkError>

        readonly deleteInvoice: (
            id: RecordId
        ) => Effect.Effect<UnlinkResponse, OdooError | OdooNetworkError>
    }
>() {}

/**
 * Create XMLRPC client
 */
const createClient = (
    url: string,
    path: string
): Effect.Effect<xmlrpc.Client, never> =>
    Effect.sync(() => {
        const urlObj = new URL(url)
        return xmlrpc.createClient({
            host: urlObj.hostname,
            port: urlObj.port
                ? parseInt(urlObj.port)
                : urlObj.protocol === 'https:'
                  ? 443
                  : 80,
            path,
        })
    })

/**
 * Make XMLRPC method call
 */
const makeXmlrpcCall = <T>(
    client: xmlrpc.Client,
    method: string,
    params: unknown[],
    timeout: number
): Effect.Effect<T, OdooError | OdooNetworkError> =>
    Effect.tryPromise({
        try: () =>
            new Promise<T>((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('Request timeout'))
                }, timeout)

                client.methodCall(method, params, (error, value) => {
                    clearTimeout(timeoutId)
                    if (error) {
                        reject(error)
                    } else {
                        resolve(value as T)
                    }
                })
            }),
        catch: (error) => {
            if (error && typeof error === 'object' && 'faultString' in error) {
                return new OdooError({
                    message: String(
                        (error as { faultString: string }).faultString
                    ),
                    code: String((error as { faultCode?: string }).faultCode),
                    data: error,
                })
            }
            return new OdooNetworkError({
                message:
                    error instanceof Error
                        ? error.message
                        : 'XMLRPC request failed',
                cause: error,
            })
        },
    })

/**
 * Authenticate and get user ID
 */
const authenticate = (
    config: OdooConfig
): Effect.Effect<number, OdooAuthError | OdooNetworkError> =>
    Effect.gen(function* () {
        const client = yield* createClient(config.url, '/xmlrpc/2/common')
        const timeout = config.timeout ?? 30000

        const uid = yield* makeXmlrpcCall<number>(
            client,
            'authenticate',
            [config.database, config.username, config.password, {}],
            timeout
        ).pipe(
            Effect.catchTag('OdooError', (error) =>
                Effect.fail(
                    new OdooAuthError({
                        message: `Authentication failed: ${error.message}`,
                    })
                )
            )
        )

        if (!uid || uid === false) {
            return yield* Effect.fail(
                new OdooAuthError({
                    message: 'Authentication failed: Invalid credentials',
                })
            )
        }

        return uid as number
    })

/**
 * Execute kw method (main method for CRUD operations)
 */
const executeKw = <T>(
    config: OdooConfig,
    uid: number,
    model: string,
    method: string,
    args: unknown[] = [],
    kwargs: Record<string, unknown> = {}
): Effect.Effect<T, OdooError | OdooNetworkError> =>
    Effect.gen(function* () {
        const client = yield* createClient(config.url, '/xmlrpc/2/object')
        const timeout = config.timeout ?? 30000

        return yield* makeXmlrpcCall<T>(
            client,
            'execute_kw',
            [
                config.database,
                uid,
                config.password,
                model,
                method,
                args,
                kwargs,
            ],
            timeout
        )
    })

/**
 * Create the service implementation
 */
const makeOdooService = (
    config: OdooConfig,
    uid: number
): {
    authenticate: () => Effect.Effect<number, OdooAuthError | OdooNetworkError>
    search: (
        model: string,
        domain: Domain,
        options?: SearchOptions
    ) => Effect.Effect<RecordId[], OdooError | OdooNetworkError>
    searchCount: (
        model: string,
        domain: Domain
    ) => Effect.Effect<number, OdooError | OdooNetworkError>
    read: <T = OdooRecord>(
        model: string,
        ids: RecordId[],
        fields?: Fields
    ) => Effect.Effect<T[], OdooError | OdooNetworkError>
    searchRead: <T = OdooRecord>(
        model: string,
        domain: Domain,
        fields?: Fields,
        options?: SearchOptions
    ) => Effect.Effect<SearchReadResponse<T>, OdooError | OdooNetworkError>
    create: (
        model: string,
        values: Record<string, unknown>
    ) => Effect.Effect<RecordId, OdooError | OdooNetworkError>
    write: (
        model: string,
        ids: RecordId[],
        values: Record<string, unknown>
    ) => Effect.Effect<WriteResponse, OdooError | OdooNetworkError>
    unlink: (
        model: string,
        ids: RecordId[]
    ) => Effect.Effect<UnlinkResponse, OdooError | OdooNetworkError>
    fieldsGet: (
        model: string,
        fields?: Fields
    ) => Effect.Effect<FieldsGetResponse, OdooError | OdooNetworkError>
    execute: <T = unknown>(
        args: ExecuteKwArgs
    ) => Effect.Effect<T, OdooError | OdooNetworkError>
    getPartners: (
        domain?: Domain,
        fields?: Fields,
        options?: SearchOptions
    ) => Effect.Effect<
        SearchReadResponse<Partner>,
        OdooError | OdooNetworkError
    >
    getPartner: (
        id: RecordId,
        fields?: Fields
    ) => Effect.Effect<Partner, OdooError | OdooNetworkError>
    createPartner: (
        input: CreatePartnerInput
    ) => Effect.Effect<RecordId, OdooError | OdooNetworkError>
    updatePartner: (
        id: RecordId,
        input: UpdatePartnerInput
    ) => Effect.Effect<WriteResponse, OdooError | OdooNetworkError>
    deletePartner: (
        id: RecordId
    ) => Effect.Effect<UnlinkResponse, OdooError | OdooNetworkError>
    getProducts: (
        domain?: Domain,
        fields?: Fields,
        options?: SearchOptions
    ) => Effect.Effect<
        SearchReadResponse<Product>,
        OdooError | OdooNetworkError
    >
    getProduct: (
        id: RecordId,
        fields?: Fields
    ) => Effect.Effect<Product, OdooError | OdooNetworkError>
    createProduct: (
        input: CreateProductInput
    ) => Effect.Effect<RecordId, OdooError | OdooNetworkError>
    updateProduct: (
        id: RecordId,
        input: UpdateProductInput
    ) => Effect.Effect<WriteResponse, OdooError | OdooNetworkError>
    deleteProduct: (
        id: RecordId
    ) => Effect.Effect<UnlinkResponse, OdooError | OdooNetworkError>
    getSaleOrders: (
        domain?: Domain,
        fields?: Fields,
        options?: SearchOptions
    ) => Effect.Effect<
        SearchReadResponse<SaleOrder>,
        OdooError | OdooNetworkError
    >
    getSaleOrder: (
        id: RecordId,
        fields?: Fields
    ) => Effect.Effect<SaleOrder, OdooError | OdooNetworkError>
    createSaleOrder: (
        input: CreateSaleOrderInput
    ) => Effect.Effect<RecordId, OdooError | OdooNetworkError>
    updateSaleOrder: (
        id: RecordId,
        input: UpdateSaleOrderInput
    ) => Effect.Effect<WriteResponse, OdooError | OdooNetworkError>
    confirmSaleOrder: (
        id: RecordId
    ) => Effect.Effect<boolean, OdooError | OdooNetworkError>
    cancelSaleOrder: (
        id: RecordId
    ) => Effect.Effect<boolean, OdooError | OdooNetworkError>
    deleteSaleOrder: (
        id: RecordId
    ) => Effect.Effect<UnlinkResponse, OdooError | OdooNetworkError>
    getInvoices: (
        domain?: Domain,
        fields?: Fields,
        options?: SearchOptions
    ) => Effect.Effect<
        SearchReadResponse<Invoice>,
        OdooError | OdooNetworkError
    >
    getInvoice: (
        id: RecordId,
        fields?: Fields
    ) => Effect.Effect<Invoice, OdooError | OdooNetworkError>
    createInvoice: (
        input: CreateInvoiceInput
    ) => Effect.Effect<RecordId, OdooError | OdooNetworkError>
    updateInvoice: (
        id: RecordId,
        input: UpdateInvoiceInput
    ) => Effect.Effect<WriteResponse, OdooError | OdooNetworkError>
    postInvoice: (
        id: RecordId
    ) => Effect.Effect<boolean, OdooError | OdooNetworkError>
    deleteInvoice: (
        id: RecordId
    ) => Effect.Effect<UnlinkResponse, OdooError | OdooNetworkError>
} => ({
    authenticate: () => authenticate(config),

    // Generic CRUD operations
    search: (model, domain, options = {}) => {
        const kwargs: Record<string, unknown> = {}
        if (options.offset !== undefined) kwargs.offset = options.offset
        if (options.limit !== undefined) kwargs.limit = options.limit
        if (options.order) kwargs.order = options.order
        if (options.context) kwargs.context = options.context

        return executeKw<RecordId[]>(
            config,
            uid,
            model,
            'search',
            [domain],
            kwargs
        )
    },

    searchCount: (model, domain) =>
        executeKw<number>(config, uid, model, 'search_count', [domain]),

    read: <T = OdooRecord>(model: string, ids: RecordId[], fields?: Fields) => {
        const kwargs: Record<string, unknown> = {}
        if (fields && fields.length > 0) kwargs.fields = fields

        return executeKw<T[]>(config, uid, model, 'read', [ids], kwargs)
    },

    searchRead: <T = OdooRecord>(
        model: string,
        domain: Domain,
        fields?: Fields,
        options: SearchOptions = {}
    ) =>
        Effect.gen(function* () {
            const kwargs: Record<string, unknown> = {}
            if (fields && fields.length > 0) kwargs.fields = fields
            if (options.offset !== undefined) kwargs.offset = options.offset
            if (options.limit !== undefined) kwargs.limit = options.limit
            if (options.order) kwargs.order = options.order
            if (options.context) kwargs.context = options.context

            const records = yield* executeKw<T[]>(
                config,
                uid,
                model,
                'search_read',
                [domain],
                kwargs
            )

            return {
                records,
                length: records.length,
            }
        }),

    create: (model, values) =>
        executeKw<RecordId>(config, uid, model, 'create', [values]),

    write: (model, ids, values) =>
        executeKw<boolean>(config, uid, model, 'write', [ids, values]).pipe(
            Effect.map((success) => ({ success }))
        ),

    unlink: (model, ids) =>
        executeKw<boolean>(config, uid, model, 'unlink', [ids]).pipe(
            Effect.map((success) => ({ success }))
        ),

    fieldsGet: (model, fields) => {
        const kwargs: Record<string, unknown> = {}
        if (fields && fields.length > 0) kwargs.allfields = fields

        return executeKw<FieldsGetResponse>(
            config,
            uid,
            model,
            'fields_get',
            [],
            kwargs
        )
    },

    execute: <T = unknown>(args: ExecuteKwArgs) =>
        executeKw<T>(
            config,
            uid,
            args.model,
            args.method,
            args.args ?? [],
            args.kwargs ?? {}
        ),

    // Partner operations
    getPartners: (domain = [], fields, options) =>
        makeOdooService(config, uid).searchRead<Partner>(
            'res.partner',
            domain,
            fields,
            options
        ),

    getPartner: (id, fields) =>
        Effect.gen(function* () {
            const partners = yield* makeOdooService(config, uid).read<Partner>(
                'res.partner',
                [id],
                fields
            )
            if (partners.length === 0) {
                return yield* Effect.fail(
                    new OdooError({
                        message: `Partner with id ${id} not found`,
                    })
                )
            }
            return partners[0]
        }),

    createPartner: (input) =>
        makeOdooService(config, uid).create('res.partner', input),

    updatePartner: (id, input) =>
        makeOdooService(config, uid).write('res.partner', [id], input),

    deletePartner: (id) =>
        makeOdooService(config, uid).unlink('res.partner', [id]),

    // Product operations
    getProducts: (domain = [], fields, options) =>
        makeOdooService(config, uid).searchRead<Product>(
            'product.product',
            domain,
            fields,
            options
        ),

    getProduct: (id, fields) =>
        Effect.gen(function* () {
            const products = yield* makeOdooService(config, uid).read<Product>(
                'product.product',
                [id],
                fields
            )
            if (products.length === 0) {
                return yield* Effect.fail(
                    new OdooError({
                        message: `Product with id ${id} not found`,
                    })
                )
            }
            return products[0]
        }),

    createProduct: (input) =>
        makeOdooService(config, uid).create('product.product', input),

    updateProduct: (id, input) =>
        makeOdooService(config, uid).write('product.product', [id], input),

    deleteProduct: (id) =>
        makeOdooService(config, uid).unlink('product.product', [id]),

    // Sale Order operations
    getSaleOrders: (domain = [], fields, options) =>
        makeOdooService(config, uid).searchRead<SaleOrder>(
            'sale.order',
            domain,
            fields,
            options
        ),

    getSaleOrder: (id, fields) =>
        Effect.gen(function* () {
            const orders = yield* makeOdooService(config, uid).read<SaleOrder>(
                'sale.order',
                [id],
                fields
            )
            if (orders.length === 0) {
                return yield* Effect.fail(
                    new OdooError({
                        message: `Sale order with id ${id} not found`,
                    })
                )
            }
            return orders[0]
        }),

    createSaleOrder: (input) =>
        makeOdooService(config, uid).create('sale.order', input),

    updateSaleOrder: (id, input) =>
        makeOdooService(config, uid).write('sale.order', [id], input),

    confirmSaleOrder: (id) =>
        executeKw<boolean>(config, uid, 'sale.order', 'action_confirm', [[id]]),

    cancelSaleOrder: (id) =>
        executeKw<boolean>(config, uid, 'sale.order', 'action_cancel', [[id]]),

    deleteSaleOrder: (id) =>
        makeOdooService(config, uid).unlink('sale.order', [id]),

    // Invoice operations
    getInvoices: (domain = [], fields, options) =>
        makeOdooService(config, uid).searchRead<Invoice>(
            'account.move',
            domain,
            fields,
            options
        ),

    getInvoice: (id, fields) =>
        Effect.gen(function* () {
            const invoices = yield* makeOdooService(config, uid).read<Invoice>(
                'account.move',
                [id],
                fields
            )
            if (invoices.length === 0) {
                return yield* Effect.fail(
                    new OdooError({
                        message: `Invoice with id ${id} not found`,
                    })
                )
            }
            return invoices[0]
        }),

    createInvoice: (input) =>
        makeOdooService(config, uid).create('account.move', input),

    updateInvoice: (id, input) =>
        makeOdooService(config, uid).write('account.move', [id], input),

    postInvoice: (id) =>
        executeKw<boolean>(config, uid, 'account.move', 'action_post', [[id]]),

    deleteInvoice: (id) =>
        makeOdooService(config, uid).unlink('account.move', [id]),
})

/**
 * Live layer that reads configuration from environment variables
 */
export const OdooServiceLive = Layer.effect(
    OdooService,
    Effect.gen(function* () {
        const config = yield* Config.all({
            url: Config.string('ODOO_URL'),
            database: Config.string('ODOO_DATABASE'),
            username: Config.string('ODOO_USERNAME'),
            password: Config.string('ODOO_PASSWORD'),
            timeout: Config.number('ODOO_TIMEOUT').pipe(
                Config.withDefault(30000)
            ),
        }).pipe(
            Effect.catchAll(() =>
                Effect.die(
                    new OdooAuthError({
                        message:
                            'ODOO_URL, ODOO_DATABASE, ODOO_USERNAME, and ODOO_PASSWORD are required',
                    })
                )
            )
        )

        const uid = yield* authenticate(config)

        return OdooService.of(makeOdooService(config, uid))
    })
)

/**
 * Create a service layer with direct configuration
 */
export const makeOdooServiceLayer = (
    config: OdooConfig
): Layer.Layer<OdooService, OdooAuthError | OdooNetworkError> =>
    Layer.effect(
        OdooService,
        Effect.gen(function* () {
            const uid = yield* authenticate(config)
            return OdooService.of(makeOdooService(config, uid))
        })
    )

export {
    buildDomain,
    formatDate,
    formatDateTime,
    isFalse,
    parseDate,
    parseDateTime,
} from './helpers'
