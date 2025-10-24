import { HttpRouter, HttpServerResponse } from '@effect/platform'
import { HostexService } from '@monorepo/helpers/hostex'
import { Effect } from 'effect'

export const bookingsNextRoute = HttpRouter.empty.pipe(
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
    )
)
