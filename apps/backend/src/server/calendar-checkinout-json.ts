import { HttpRouter, HttpServerResponse } from '@effect/platform'
import {
    generateCheckInOutEvents,
    HostexService,
} from '@monorepo/helpers/hostex'
import { Effect } from 'effect'

import { getPropertyTimes } from '../config/property-times'

export const calendarCheckInOutJsonRoute = HttpRouter.empty.pipe(
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
    )
)
