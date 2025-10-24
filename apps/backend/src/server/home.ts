import { HttpRouter, HttpServerResponse } from '@effect/platform'
import { Effect } from 'effect'

export const homeRoute = HttpRouter.empty.pipe(
    HttpRouter.get(
        '/',
        Effect.gen(function* () {
            return yield* HttpServerResponse.text('Hello World')
        })
    )
)
