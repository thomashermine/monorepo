import { HttpRouter, HttpServerResponse } from '@effect/platform'
import { generateFullDayEvents, HostexService } from '@monorepo/helpers/hostex'
import { Console, Effect } from 'effect'

export const calendarFullDayJsonRoute = HttpRouter.empty.pipe(
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
    )
)
