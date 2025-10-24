import 'dotenv/config'

import { createServer } from 'node:http'

import { HttpRouter, HttpServer, HttpServerResponse } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { HostexServiceLive } from '@monorepo/helpers/hostex'
import { OpenAIServiceLive } from '@monorepo/helpers/openai'
import { Console, Effect, Layer } from 'effect'

import { bookingsNextRoute } from './server/bookings-next'
import { calendarCheckInOutIcsRoute } from './server/calendar-checkinout-ics'
import { calendarCheckInOutJsonRoute } from './server/calendar-checkinout-json'
import { calendarFullDayIcsRoute } from './server/calendar-full-day-ics'
import { calendarFullDayJsonRoute } from './server/calendar-full-day-json'
import { homeRoute } from './server/home'
import { messagesExportRoute } from './server/messages-export'
import { notFoundRoute } from './server/not-found'

const port = process.env.PORT ?? 3000

// ============================================================================================================ Routes
const router = HttpRouter.empty.pipe(
    HttpRouter.concat(homeRoute),
    HttpRouter.concat(bookingsNextRoute),
    HttpRouter.concat(calendarFullDayIcsRoute),
    HttpRouter.concat(calendarCheckInOutIcsRoute),
    HttpRouter.concat(calendarFullDayJsonRoute),
    HttpRouter.concat(calendarCheckInOutJsonRoute),
    HttpRouter.concat(messagesExportRoute),
    HttpRouter.concat(notFoundRoute)
)

// ============================================================================================================ Error Handling
const routerWithErrorHandling = router.pipe(
    Effect.catchAll((error) =>
        Effect.gen(function* () {
            yield* Console.error('Request error:', error)
            yield* Console.error('Error type:', typeof error)
            yield* Console.error(
                'Error keys:',
                error && typeof error === 'object' ? Object.keys(error) : 'N/A'
            )

            let errorMessage = 'Unknown error'

            if (error && typeof error === 'object') {
                if ('message' in error) {
                    errorMessage = String(
                        (error as { message: unknown }).message
                    )
                } else {
                    errorMessage = JSON.stringify(error)
                }
            } else if (typeof error === 'string') {
                errorMessage = error
            }

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
    Layer.provide(HostexServiceLive),
    Layer.provide(OpenAIServiceLive)
)

// ================================================================================================================ Program
const program = Effect.gen(function* () {
    yield* Console.log(
        `🚀 Server running on http://localhost:${port}.`,
        `Some env var: ${process.env.SOME_ENV_VAR}`
    )

    yield* Layer.launch(ServerLive)
}).pipe(Effect.provide(HostexServiceLive), Effect.provide(OpenAIServiceLive))

// ===================================================================================================================== Run
NodeRuntime.runMain(program)
