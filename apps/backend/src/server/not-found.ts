import { HttpRouter, HttpServerResponse } from '@effect/platform'
import { Effect } from 'effect'

export const notFoundRoute = HttpRouter.empty.pipe(
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
