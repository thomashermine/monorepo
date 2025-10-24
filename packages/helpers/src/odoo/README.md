# Odoo API Service

A comprehensive Effect-based service for interacting with Odoo via XMLRPC.

## Documentation

For the full Odoo API documentation, visit: [https://www.odoo.com/documentation/17.0/developer/reference/external_api.html](https://www.odoo.com/documentation/17.0/developer/reference/external_api.html)

## Features

This service provides type-safe, Effect-based wrappers for all major Odoo XMLRPC operations:

### Generic CRUD Operations

- Search records with complex domains
- Count records
- Read records by ID
- Search and read in one operation
- Create new records
- Update existing records (write)
- Delete records (unlink)
- Get field definitions
- Execute custom methods

### Partners (res.partner)

- Query partners with filters
- Get individual partners
- Create new partners
- Update partner information
- Delete partners

### Products (product.product)

- Query products with filters
- Get individual products
- Create new products
- Update product information
- Delete products

### Sale Orders (sale.order)

- Query sale orders
- Get individual sale orders
- Create new sale orders
- Update sale orders
- Confirm sale orders
- Cancel sale orders
- Delete sale orders

### Invoices (account.move)

- Query invoices
- Get individual invoices
- Create new invoices
- Update invoices
- Post invoices (validate)
- Delete invoices

## Installation

```bash
pnpm add @monorepo/helpers
```

## Usage

### Basic Setup

```typescript
import { Effect } from 'effect'
import { OdooService, makeOdooServiceLayer } from '@monorepo/helpers/odoo'

// Create service layer with configuration
const odooLayer = makeOdooServiceLayer({
    url: 'http://localhost:8069',
    database: 'my_database',
    username: 'admin',
    password: 'admin',
    timeout: 30000, // optional, defaults to 30 seconds
})

// Use the service
const program = Effect.gen(function* () {
    const service = yield* OdooService

    // Fetch all partners
    const partners = yield* service.getPartners()
    console.log('Partners:', partners.records)

    return partners
})

// Run the program
const result = await Effect.runPromise(program.pipe(Effect.provide(odooLayer)))
```

### Authentication

The service automatically handles authentication. The `uid` (user ID) is obtained during service initialization and reused for all subsequent requests.

```typescript
const program = Effect.gen(function* () {
    const service = yield* OdooService

    // Authentication is automatic, but you can re-authenticate if needed
    const uid = yield* service.authenticate()
    console.log('User ID:', uid)

    return uid
})
```

### Partner Operations

```typescript
const program = Effect.gen(function* () {
    const service = yield* OdooService

    // Search for company partners
    const companies = yield* service.getPartners(
        [['is_company', '=', true]],
        ['name', 'email', 'phone'],
        { limit: 10, offset: 0 }
    )

    // Get a specific partner
    const partner = yield* service.getPartner(1, ['name', 'email'])

    // Create a new partner
    const newPartnerId = yield* service.createPartner({
        name: 'New Company',
        email: 'contact@newcompany.com',
        is_company: true,
        customer_rank: 1,
    })

    // Update a partner
    yield* service.updatePartner(newPartnerId, {
        phone: '+1234567890',
        website: 'https://newcompany.com',
    })

    // Delete a partner
    yield* service.deletePartner(newPartnerId)

    return companies
})
```

### Product Operations

```typescript
const program = Effect.gen(function* () {
    const service = yield* OdooService

    // Search for products that can be sold
    const products = yield* service.getProducts(
        [['sale_ok', '=', true]],
        ['name', 'list_price', 'qty_available'],
        { order: 'name ASC' }
    )

    // Create a new product
    const productId = yield* service.createProduct({
        name: 'New Product',
        type: 'consu',
        list_price: 99.99,
        sale_ok: true,
    })

    // Update product price
    yield* service.updateProduct(productId, {
        list_price: 89.99,
    })

    return products
})
```

### Sale Order Operations

```typescript
const program = Effect.gen(function* () {
    const service = yield* OdooService

    // Create a sale order with lines
    const orderId = yield* service.createSaleOrder({
        partner_id: 1,
        order_line: [
            [
                0,
                0,
                {
                    product_id: 10,
                    product_uom_qty: 2,
                    price_unit: 50.0,
                },
            ],
            [
                0,
                0,
                {
                    product_id: 11,
                    product_uom_qty: 1,
                    price_unit: 100.0,
                },
            ],
        ],
    })

    // Confirm the sale order
    yield* service.confirmSaleOrder(orderId)

    // Get all confirmed sale orders
    const confirmedOrders = yield* service.getSaleOrders(
        [['state', '=', 'sale']],
        ['name', 'partner_id', 'amount_total'],
        { limit: 20 }
    )

    return confirmedOrders
})
```

### Invoice Operations

```typescript
const program = Effect.gen(function* () {
    const service = yield* OdooService

    // Create an invoice
    const invoiceId = yield* service.createInvoice({
        move_type: 'out_invoice',
        partner_id: 1,
        invoice_line_ids: [
            [
                0,
                0,
                {
                    name: 'Service A',
                    quantity: 1,
                    price_unit: 150.0,
                },
            ],
        ],
    })

    // Post (validate) the invoice
    yield* service.postInvoice(invoiceId)

    // Get all unpaid invoices
    const unpaidInvoices = yield* service.getInvoices([
        ['move_type', '=', 'out_invoice'],
        ['payment_state', '=', 'not_paid'],
    ])

    return unpaidInvoices
})
```

### Generic CRUD Operations

```typescript
const program = Effect.gen(function* () {
    const service = yield* OdooService

    // Search for records
    const partnerIds = yield* service.search(
        'res.partner',
        [['is_company', '=', true]],
        { limit: 10 }
    )

    // Count records
    const count = yield* service.searchCount('res.partner', [
        ['customer_rank', '>', 0],
    ])

    // Read records
    const partners = yield* service.read('res.partner', partnerIds, [
        'name',
        'email',
    ])

    // Search and read in one operation
    const result = yield* service.searchRead(
        'res.partner',
        [['is_company', '=', true]],
        ['name', 'email', 'phone'],
        { limit: 5 }
    )

    // Create a record
    const newId = yield* service.create('res.partner', {
        name: 'Test Partner',
        email: 'test@example.com',
    })

    // Update records
    yield* service.write('res.partner', [newId], {
        phone: '+1234567890',
    })

    // Delete records
    yield* service.unlink('res.partner', [newId])

    return result
})
```

### Using Helper Functions

```typescript
import {
    buildDomain,
    formatDate,
    extractMany2oneId,
    createReplaceCommand,
} from '@monorepo/helpers/odoo'

const program = Effect.gen(function* () {
    const service = yield* OdooService

    // Build a domain from an object
    const domain = yield* buildDomain({
        is_company: true,
        customer_rank: 1,
    })
    // Results in: [['is_company', '=', true], ['customer_rank', '=', 1]]

    const partners = yield* service.search('res.partner', domain)

    // Format dates for Odoo
    const dateStr = yield* formatDate(new Date())
    // Results in: '2024-01-15'

    // Extract Many2one IDs
    const partner = yield* service.getPartner(1)
    const countryId = extractMany2oneId(partner.country_id)
    // If country_id is [21, 'United States'], returns 21

    // Work with One2many/Many2many fields
    const tagIds = [1, 2, 3]
    const replaceCommand = createReplaceCommand(tagIds)
    // Results in: [6, 0, [1, 2, 3]]

    yield* service.write('res.partner', [1], {
        category_id: replaceCommand,
    })

    return partners
})
```

### Domain Building

```typescript
import { buildComplexDomain, combineDomains } from '@monorepo/helpers/odoo'

const program = Effect.gen(function* () {
    const service = yield* OdooService

    // Build complex domain with operators
    const domain = yield* buildComplexDomain([
        { field: 'name', operator: 'ilike', value: 'john' },
        { field: 'age', operator: '>=', value: 18 },
        { field: 'country_id', operator: 'in', value: [1, 2, 3] },
    ])

    // Combine multiple domains with AND
    const domain1 = [['is_company', '=', true]]
    const domain2 = [['customer_rank', '>', 0]]
    const combined = yield* combineDomains(domain1, domain2)
    // Results in: [['is_company', '=', true], ['customer_rank', '>', 0]]

    const partners = yield* service.search('res.partner', combined)

    return partners
})
```

### Execute Custom Methods

```typescript
const program = Effect.gen(function* () {
    const service = yield* OdooService

    // Call a custom method on a model
    const result = yield* service.execute({
        model: 'sale.order',
        method: 'action_confirm',
        args: [[1, 2, 3]], // IDs of orders to confirm
    })

    // Call a custom method with keyword arguments
    const result2 = yield* service.execute({
        model: 'account.move',
        method: 'create_invoice_from_order',
        args: [[1]],
        kwargs: {
            grouped: true,
            final: false,
        },
    })

    return result
})
```

### Error Handling

```typescript
import {
    OdooError,
    OdooNetworkError,
    OdooAuthError,
} from '@monorepo/helpers/odoo'

const program = Effect.gen(function* () {
    const service = yield* OdooService

    return yield* service.getPartner(9999)
}).pipe(
    Effect.catchTag('OdooError', (error) =>
        Effect.succeed({
            error: 'API Error',
            message: error.message,
            code: error.code,
        })
    ),
    Effect.catchTag('OdooNetworkError', (error) =>
        Effect.succeed({
            error: 'Network Error',
            message: error.message,
        })
    ),
    Effect.catchTag('OdooAuthError', (error) =>
        Effect.succeed({
            error: 'Authentication Error',
            message: error.message,
        })
    )
)
```

### Compose Multiple Operations

```typescript
const program = Effect.gen(function* () {
    const service = yield* OdooService

    // Create a partner and a sale order in one program
    const partnerId = yield* service.createPartner({
        name: 'New Customer',
        email: 'customer@example.com',
        customer_rank: 1,
    })

    const orderId = yield* service.createSaleOrder({
        partner_id: partnerId,
        order_line: [
            [
                0,
                0,
                {
                    product_id: 1,
                    product_uom_qty: 5,
                    price_unit: 50.0,
                },
            ],
        ],
    })

    yield* service.confirmSaleOrder(orderId)

    const order = yield* service.getSaleOrder(orderId)

    return {
        partnerId,
        orderId,
        order,
    }
})
```

## Error Types

The service uses Effect's error handling with three main error types:

### `OdooError`

Thrown when the Odoo API returns an error response (e.g., validation errors, record not found).

```typescript
{
  message: string
  code?: string
  data?: unknown
}
```

### `OdooNetworkError`

Thrown when network-level failures occur (e.g., connection failures, timeouts).

```typescript
{
  message: string
  cause?: unknown
}
```

### `OdooAuthError`

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
- Error types
- Domain filters
- Odoo models (Partner, Product, SaleOrder, Invoice)
- And more...

Example:

```typescript
import type {
    Partner,
    Product,
    SaleOrder,
    Invoice,
    Domain,
    CreatePartnerInput,
    CreateProductInput,
} from '@monorepo/helpers/odoo'
```

## Configuration

### Environment Variables

When using `OdooServiceLive`, you can configure the service using environment variables:

```bash
ODOO_URL=http://localhost:8069
ODOO_DATABASE=my_database
ODOO_USERNAME=admin
ODOO_PASSWORD=admin
ODOO_TIMEOUT=30000  # optional, in milliseconds
```

### Direct Configuration

When using `makeOdooServiceLayer`, pass configuration directly:

```typescript
const odooLayer = makeOdooServiceLayer({
    url: 'http://localhost:8069',
    database: 'my_database',
    username: 'admin',
    password: 'admin',
    timeout: 30000, // optional
})
```

## Odoo Domain Filters

Odoo uses domain filters for searching records. A domain is an array of conditions:

```typescript
// Simple condition: [field, operator, value]
const domain: Domain = [['name', '=', 'John Doe']]

// Multiple conditions (AND logic by default)
const domain: Domain = [
    ['is_company', '=', true],
    ['customer_rank', '>', 0],
]

// OR logic using '|' operator
const domain: Domain = [
    '|',
    ['name', 'ilike', 'john'],
    ['name', 'ilike', 'jane'],
]

// Complex nested logic
const domain: Domain = [
    '&',
    ['is_company', '=', true],
    '|',
    ['customer_rank', '>', 0],
    ['supplier_rank', '>', 0],
]
```

### Common Operators

- `=` - equals
- `!=` - not equals
- `>` - greater than
- `>=` - greater than or equal
- `<` - less than
- `<=` - less than or equal
- `in` - in list
- `not in` - not in list
- `like` - pattern match (case-sensitive)
- `ilike` - pattern match (case-insensitive)
- `child_of` - child of (for hierarchical models)

## One2many and Many2many Commands

When working with relational fields, use command tuples:

```typescript
// (0, 0, values) - Create new record
;[0, 0, { name: 'New Line', quantity: 1 }][
    // (1, id, values) - Update existing record
    (1, 42, { quantity: 5 })
][
    // (2, id, 0) - Delete record
    (2, 42, 0)
][
    // (3, id, 0) - Unlink record (remove relation but don't delete)
    (3, 42, 0)
][
    // (4, id, 0) - Link to existing record
    (4, 42, 0)
][
    // (5, 0, 0) - Remove all records
    (5, 0, 0)
][
    // (6, 0, [ids]) - Replace all records with these IDs
    (6, 0, [1, 2, 3])
]
```

Helper functions are provided:

```typescript
import {
    createCreateCommand,
    createUpdateCommand,
    createDeleteCommand,
    createLinkCommand,
    createUnlinkCommand,
    createReplaceCommand,
    createClearCommand,
} from '@monorepo/helpers/odoo'
```

## Testing

The service includes comprehensive tests covering:

- All CRUD operations
- Partner, Product, SaleOrder, and Invoice operations
- Error handling scenarios
- Domain filtering
- Mock data generators

Run tests:

```bash
pnpm test
```

## Mock Data

The service includes mock data generators for testing:

```typescript
import {
    mockPartner,
    mockProduct,
    mockSaleOrder,
    mockInvoice,
    mockPartnersResponse,
} from '@monorepo/helpers/odoo/mocks'

const partner = mockPartner({ name: 'Test Company' })
const product = mockProduct({ list_price: 99.99 })
const order = mockSaleOrder()
```

## API Version

This service implements the Odoo XMLRPC API, compatible with Odoo 14.0+.

## Contributing

This service is part of the monorepo helpers package. When contributing:

1. Add tests for any new features
2. Update types for API changes
3. Run linter and tests before committing
4. Update this README for significant changes

## License

Part of the monorepo project.
