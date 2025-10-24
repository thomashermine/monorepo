import { HttpRouter, HttpServerResponse } from '@effect/platform'
import { generateICS } from '@monorepo/helpers/calendar'
import {
    generateCheckInOutEvents,
    HostexService,
} from '@monorepo/helpers/hostex'
import { Effect } from 'effect'

import { getPropertyTimes } from '../config/property-times'

export const calendarCheckInOutIcsRoute = HttpRouter.empty.pipe(
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
    )
)
