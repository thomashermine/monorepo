import 'dotenv/config'

import { createServer } from 'node:http'

import { HttpRouter, HttpServer, HttpServerResponse } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { generateICS } from '@monorepo/helpers/calendar'
import {
    generateCheckInOutEvents,
    generateFullDayEvents,
    HostexService,
    HostexServiceLive,
} from '@monorepo/helpers/hostex'
import { Console, Effect, Layer } from 'effect'

import { getPropertyTimes } from './config/property-times'

const port = process.env.PORT ?? 3000

// ============================================================================================================ Routes
const router = HttpRouter.empty.pipe(
    HttpRouter.get(
        '/',
        Effect.gen(function* () {
            return yield* HttpServerResponse.text('Hello World')
        })
    ),
    HttpRouter.get(
        '/bookings/next',
        Effect.gen(function* () {
            const hostexService = yield* HostexService

            // Fetch upcoming reservations (returns Reservation[])
            const reservations = yield* hostexService.getReservations({})

            // Wrap in the expected response structure
            return yield* HttpServerResponse.json({
                bookings: {
                    reservations: reservations,
                },
                page: 1,
                pageSize: 100,
                requestId: crypto.randomUUID(),
                total: reservations.length,
            })
        })
    ),
    // Full-day events ICS
    HttpRouter.get(
        '/bookings/calendar/full-day.ics',
        Effect.gen(function* () {
            const hostexService = yield* HostexService

            // Fetch all reservations
            const reservations = yield* hostexService.getReservations({})

            // Generate full-day events

            const events = yield* generateFullDayEvents(reservations)

            const icsContent = generateICS(events)

            return yield* HttpServerResponse.text(icsContent, {
                headers: {
                    'Content-Disposition':
                        'attachment; filename="bookings-full-day.ics"',
                    'Content-Type': 'text/calendar; charset=utf-8',
                },
            })
        })
    ),
    // Check-in/Check-out events ICS
    HttpRouter.get(
        '/bookings/calendar/checkinout.ics',
        Effect.gen(function* () {
            const hostexService = yield* HostexService

            // Fetch all reservations
            const reservations = yield* hostexService.getReservations({})

            // Generate check-in/check-out events

            const events = yield* generateCheckInOutEvents(
                reservations,
                getPropertyTimes
            )

            const icsContent = generateICS(events)

            return yield* HttpServerResponse.text(icsContent, {
                headers: {
                    'Content-Disposition':
                        'attachment; filename="bookings-checkinout.ics"',
                    'Content-Type': 'text/calendar; charset=utf-8',
                },
            })
        })
    ),
    // Full-day events JSON (for debugging)
    HttpRouter.get(
        '/bookings/calendar/full-day.json',
        Effect.gen(function* () {
            const hostexService = yield* HostexService

            // Fetch all reservations
            const reservations = yield* hostexService.getReservations({})
            yield* Console.log('Number of reservations:', reservations.length)

            // Generate full-day events

            const events = yield* generateFullDayEvents(reservations)

            yield* Console.log('Number of events generated:', events.length)

            return yield* HttpServerResponse.json(events)
        })
    ),
    // Check-in/Check-out events JSON (for debugging)
    HttpRouter.get(
        '/bookings/calendar/checkinout.json',
        Effect.gen(function* () {
            const hostexService = yield* HostexService

            // Fetch all reservations
            const reservations = yield* hostexService.getReservations({})

            // Generate check-in/check-out events

            const events = yield* generateCheckInOutEvents(
                reservations,
                getPropertyTimes
            )

            return yield* HttpServerResponse.json(events)
        })
    ),
    // Generic 404 handler for unsupported URLs
    HttpRouter.all(
        '*',
        Effect.gen(function* () {
            return yield* HttpServerResponse.json(
                {
                    error: 'Not Found',
                    message:
                        'The requested resource was not found on this server.',
                },
                { status: 404 }
            )
        })
    )
)

// ============================================================================================================ Error Handling
const routerWithErrorHandling = router.pipe(
    Effect.catchAll((error) =>
        Effect.gen(function* () {
            yield* Console.error('Request error:', error)

            const errorMessage =
                error && typeof error === 'object' && 'message' in error
                    ? String((error as { message: unknown }).message)
                    : JSON.stringify(error)

            return yield* HttpServerResponse.json(
                {
                    error: 'Internal server error',
                    message: errorMessage,
                },
                { status: 500 }
            )
        })
    )
)

// ============================================================================================================ Server Setup
const ServerLive = routerWithErrorHandling.pipe(
    HttpServer.serve(),
    HttpServer.withLogAddress,
    Layer.provide(NodeHttpServer.layer(createServer, { port: Number(port) })),
    Layer.provide(HostexServiceLive)
)

// ================================================================================================================ Program
const program = Effect.gen(function* () {
    yield* Console.log(
        `🚀 Server running on http://localhost:${port}.`,
        `Some env var: ${process.env.SOME_ENV_VAR}`
    )
    yield* Layer.launch(ServerLive)
})

// ===================================================================================================================== Run
NodeRuntime.runMain(program)
