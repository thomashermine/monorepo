import 'dotenv/config'

import { createServer } from 'node:http'

import { HttpRouter, HttpServer, HttpServerResponse } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { HostexService, HostexServiceLive } from '@monorepo/helpers/hostex'
import { Console, Effect, Layer } from 'effect'

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

            // Fetch upcoming reservations
            const reservations = yield* hostexService.getReservations({})
            return yield* HttpServerResponse.json({
                bookings: reservations.data,
                page: reservations.page,
                pageSize: reservations.pageSize,
                requestId: reservations.requestId,
                total: reservations.total,
            })
        })
    )
)

// ============================================================================================================ Server Setup
const ServerLive = router.pipe(
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
