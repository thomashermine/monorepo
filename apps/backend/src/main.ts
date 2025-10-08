import 'dotenv/config'

import { createServer } from 'node:http'

import {
    HttpRouter,
    HttpServer,
    HttpServerRequest,
    HttpServerResponse,
} from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
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
    HttpRouter.post(
        '/echo',
        Effect.gen(function* () {
            const request = yield* HttpServerRequest.HttpServerRequest
            const body = yield* request.text

            return yield* HttpServerResponse.json({
                message: body,
                timestamp: new Date().toISOString(),
            })
        })
    )
)

// ============================================================================================================ Server Setup
const ServerLive = router.pipe(
    HttpServer.serve(),
    HttpServer.withLogAddress,
    Layer.provide(NodeHttpServer.layer(createServer, { port: Number(port) }))
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
