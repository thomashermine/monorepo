# Hostex API Service

A comprehensive Effect-based service for interacting with the Hostex API v3.0.0 (Beta).

## Documentation

For the full Hostex API documentation, visit: [https://hostex-openapi.readme.io/reference/overview](https://hostex-openapi.readme.io/reference/overview)

## Features

This service provides type-safe, Effect-based wrappers for all major Hostex API endpoints:

### Properties & Room Types

- Query properties and their details
- Query room types

### Reservations

- Query reservations with filtering
- Create new reservations
- Cancel reservations
- Update lock codes
- Access custom fields

### Availability Management

- Query property availabilities
- Update property availabilities

### Listing Calendar

- Query listing calendars for multiple listings
- Update listing inventories
- Update listing prices
- Update listing restrictions

### Messaging

- Query guest conversations
- Get conversation details and message history
- Send text and image messages to guests

### Reviews

- Query reviews with filters
- Create review replies

### Webhooks

- Query registered webhooks
- Create new webhooks
- Delete webhooks

## Installation

```bash
pnpm add @monorepo/helpers
```

## Usage

### Basic Setup

```typescript
import { Effect } from 'effect'
import { HostexService, makeHostexServiceLayer } from '@monorepo/helpers/hostex'

// Create service layer with configuration
const hostexLayer = makeHostexServiceLayer({
    accessToken: 'your-access-token',
    baseUrl: 'https://open-api.hostex.com/v3', // optional, uses default if not provided
    timeout: 30000, // optional, defaults to 30 seconds
})

// Use the service
const program = Effect.gen(function* () {
    const service = yield* HostexService

    // Fetch all properties
    const properties = yield* service.getProperties()
    console.log('Properties:', properties.data)

    return properties
})

// Run the program
const result = await Effect.runPromise(
    program.pipe(Effect.provide(hostexLayer))
)
```

### Query Reservations

```typescript
const program = Effect.gen(function* () {
    const service = yield* HostexService

    // Query reservations with filters
    const reservations = yield* service.getReservations({
        propertyId: 'prop-123',
        status: 'confirmed',
        checkInFrom: '2024-12-01',
        checkInTo: '2024-12-31',
        page: 1,
        pageSize: 20,
    })

    return reservations.data
})
```

### Create a Reservation

```typescript
const program = Effect.gen(function* () {
    const service = yield* HostexService

    const newReservation = yield* service.createReservation({
        propertyId: 'prop-123',
        checkIn: '2024-12-15',
        checkOut: '2024-12-20',
        guest: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
        },
        adults: 2,
        children: 1,
        price: 1000,
        currency: 'USD',
        channel: 'direct',
    })

    console.log('Created reservation:', newReservation.data.code)
    return newReservation
})
```

### Update Availability

```typescript
const program = Effect.gen(function* () {
    const service = yield* HostexService

    // Block dates for a property
    const result = yield* service.updateAvailabilities({
        propertyId: 'prop-123',
        startDate: '2024-12-15',
        endDate: '2024-12-20',
        available: false,
    })

    console.log('Updated', result.data.updated, 'days')
    return result
})
```

### Manage Listing Calendar

```typescript
const program = Effect.gen(function* () {
    const service = yield* HostexService

    // Update prices for multiple dates
    yield* service.updateListingPrices([
        {
            listingId: 'listing-1',
            date: '2024-12-20',
            price: 250,
        },
        {
            listingId: 'listing-1',
            date: '2024-12-21',
            price: 300,
        },
    ])

    // Update restrictions
    yield* service.updateListingRestrictions([
        {
            listingId: 'listing-1',
            date: '2024-12-25',
            minStay: 3,
            closedToArrival: true,
        },
    ])

    return { success: true }
})
```

### Send Messages

```typescript
const program = Effect.gen(function* () {
    const service = yield* HostexService

    // Send a text message
    const message = yield* service.sendMessage({
        conversationId: 'conv-123',
        content: 'Check-in is at 3 PM. Looking forward to hosting you!',
        messageType: 'text',
    })

    return message
})
```

### Compose Multiple Operations

```typescript
const program = Effect.gen(function* () {
    const service = yield* HostexService

    // Fetch properties and reservations in sequence
    const properties = yield* service.getProperties()

    const allReservations = []
    for (const property of properties.data) {
        const reservations = yield* service.getReservations({
            propertyId: property.id,
            status: 'confirmed',
        })
        allReservations.push(...reservations.data)
    }

    return {
        properties: properties.data,
        reservations: allReservations,
    }
})
```

### Error Handling

```typescript
import { HostexError, HostexNetworkError } from '@monorepo/helpers/hostex'

const program = Effect.gen(function* () {
    const service = yield* HostexService

    return yield* service.getProperties()
}).pipe(
    Effect.catchTag('HostexError', (error) =>
        Effect.succeed({
            error: 'API Error',
            message: error.message,
            code: error.errorCode,
        })
    ),
    Effect.catchTag('HostexNetworkError', (error) =>
        Effect.succeed({
            error: 'Network Error',
            message: error.message,
        })
    )
)
```

## Error Types

The service uses Effect's error handling with three main error types:

### `HostexError`

Thrown when the API returns an error response (e.g., validation errors, authentication failures).

```typescript
{
  message: string
  requestId?: string
  errorCode?: string
}
```

### `HostexNetworkError`

Thrown when network-level failures occur (e.g., connection failures, timeouts).

```typescript
{
  message: string
  cause?: unknown
}
```

### `HostexAuthError`

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
- Webhook event types
- Reservation statuses
- And more...

Example:

```typescript
import type {
    CreateReservationInput,
    Reservation,
    ReservationStatus,
    WebhookEvent,
} from '@monorepo/helpers/hostex'
```

## Configuration

### Environment Variables

When using `HostexServiceLive`, you can configure the service using environment variables:

```bash
HOSTEX_ACCESS_TOKEN=your-access-token
HOSTEX_BASE_URL=https://open-api.hostex.com/v3  # optional
HOSTEX_TIMEOUT=30000  # optional, in milliseconds
```

### Direct Configuration

When using `makeHostexServiceLayer`, pass configuration directly:

```typescript
const hostexLayer = makeHostexServiceLayer({
    accessToken: 'your-access-token',
    baseUrl: 'https://open-api.hostex.com/v3', // optional
    timeout: 30000, // optional
})
```

## Testing

The service is fully tested with 40+ test cases covering:

- All API endpoints
- Error handling scenarios
- Query parameter encoding
- Batch operations
- Effect composition
- Configuration options

Run tests:

```bash
pnpm test
```

## API Version

This service implements **Hostex API v3.0.0 (Beta)**.

Please note that the API is currently in beta. Features and endpoints may change. Refer to the [official documentation](https://hostex-openapi.readme.io/reference/overview) for the latest updates.

## Authentication

All API requests require authentication via the `Hostex-Access-Token` header. Obtain your access token from the Hostex dashboard.

## Rate Limits

Be aware of the Hostex API rate limits. Refer to the [Rate Limits documentation](https://hostex-openapi.readme.io/reference/rate-limits) for details.

## Webhooks

The service supports webhook management. Subscribe to events like:

- `reservation.created`
- `reservation.updated`
- `reservation.cancelled`
- `message.received`
- `review.created`

```typescript
const program = Effect.gen(function* () {
    const service = yield* HostexService

    // Create a webhook
    const webhook = yield* service.createWebhook({
        url: 'https://your-domain.com/webhooks/hostex',
        events: ['reservation.created', 'message.received'],
    })

    return webhook
})
```

For webhook payload examples, see the [Webhooks Usage Guide](https://hostex-openapi.readme.io/reference/usage-guide).

## Contributing

This service is part of the monorepo helpers package. When contributing:

1. Add tests for any new features
2. Update types for API changes
3. Run linter and tests before committing
4. Update this README for significant changes

## License

Part of the monorepo project.
