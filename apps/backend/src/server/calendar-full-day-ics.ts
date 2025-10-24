import { HttpRouter, HttpServerResponse } from '@effect/platform'
import { generateICS } from '@monorepo/helpers/calendar'
import { generateFullDayEvents, HostexService } from '@monorepo/helpers/hostex'
import { Effect } from 'effect'

export const calendarFullDayIcsRoute = HttpRouter.empty.pipe(
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
    )
)
