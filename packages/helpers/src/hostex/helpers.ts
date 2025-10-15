import { Console, Data, Effect } from 'effect'

import type { CalendarEvent } from '../calendar'
import { calculateNights } from '../date'
import type { Reservation } from './types'

/**
 * Error for reservation processing failures
 */
export class ReservationProcessingError extends Data.TaggedError(
    'ReservationProcessingError'
)<{
    message: string
    reservationCode: string
    cause?: unknown
}> {}

/**
 * Generate emoji representation of guests
 */
export function generateGuestEmojis(
    reservation: Reservation
): Effect.Effect<string, never> {
    return Effect.sync(() => {
        const emojis: string[] = []

        // Adults
        for (let i = 0; i < reservation.number_of_adults; i++) {
            emojis.push('👤')
        }

        // Children
        for (let i = 0; i < reservation.number_of_children; i++) {
            emojis.push('👶')
        }

        // Infants
        for (let i = 0; i < reservation.number_of_infants; i++) {
            emojis.push('🍼')
        }

        // Pets
        for (let i = 0; i < reservation.number_of_pets; i++) {
            emojis.push('🐾')
        }

        return emojis.join('')
    })
}

/**
 * Generate formatted title for a reservation
 */
export function generateTitleForReservation(
    reservation: Reservation
): Effect.Effect<string, ReservationProcessingError> {
    return Effect.gen(function* () {
        const nights = calculateNights(
            reservation.check_in_date,
            reservation.check_out_date
        )
        const rate = reservation.rates?.total_rate?.amount ?? 0
        const commission = reservation.rates?.total_commission?.amount ?? 0
        const netRate = rate - commission
        const currency =
            reservation.rates?.total_rate?.currency === 'EUR'
                ? '€'
                : (reservation.rates?.total_rate?.currency ?? '€')
        const emojis = yield* generateGuestEmojis(reservation)

        return `${reservation.guest_name} #${nights} ${Math.round(rate)}${currency} (${Math.round(netRate)}${currency}) ${emojis}`
    }).pipe(
        Effect.catchAll((error) =>
            Effect.fail(
                new ReservationProcessingError({
                    message: 'Failed to generate title for reservation',
                    reservationCode: reservation.reservation_code,
                    cause: error,
                })
            )
        )
    )
}

/**
 * Generate detailed description for a reservation
 */
export function generateDescriptionForReservation(
    reservation: Reservation
): Effect.Effect<string, ReservationProcessingError> {
    return Effect.sync(() => {
        const nights = calculateNights(
            reservation.check_in_date,
            reservation.check_out_date
        )
        const rate = reservation.rates?.total_rate?.amount ?? 0
        const commission = reservation.rates?.total_commission?.amount ?? 0
        const netRate = rate - commission
        const currency =
            reservation.rates?.total_rate?.currency === 'EUR'
                ? '€'
                : (reservation.rates?.total_rate?.currency ?? '€')

        const lines = [
            `BOOKING DETAILS`,
            ``,
            `Guest: ${reservation.guest_name || 'N/A'}`,
            `Email: ${reservation.guest_email || 'N/A'}`,
            `Phone: ${reservation.guest_phone || 'N/A'}`,
            ``,
            `Number of Guests: ${reservation.number_of_guests}`,
            `  - Adults: ${reservation.number_of_adults}`,
            `  - Children: ${reservation.number_of_children}`,
            `  - Infants: ${reservation.number_of_infants}`,
            `  - Pets: ${reservation.number_of_pets}`,
            ``,
            `Stay Duration: ${nights} night${nights !== 1 ? 's' : ''}`,
            `Check-in: ${reservation.check_in_date}`,
            `Check-out: ${reservation.check_out_date}`,
            ``,
            `FINANCIAL DETAILS`,
            ``,
            `Total Rate: ${Math.round(rate)} ${currency}`,
            `Commission: ${Math.round(commission)} ${currency}`,
            `Net Rate: ${Math.round(netRate)} ${currency}`,
            ``,
            `BOOKING INFORMATION`,
            ``,
            `Channel: ${reservation.channel_type}`,
            `Reservation Code: ${reservation.reservation_code}`,
            `Status: ${reservation.status}`,
            `Booked At: ${reservation.booked_at}`,
        ]

        if (reservation.remarks) {
            lines.push(``, `REMARKS`, ``, reservation.remarks)
        }

        if (reservation.channel_remarks) {
            lines.push(``, `CHANNEL REMARKS`, ``, reservation.channel_remarks)
        }

        return lines.join('\n')
    }).pipe(
        Effect.catchAll((error) =>
            Effect.fail(
                new ReservationProcessingError({
                    message: 'Failed to generate description for reservation',
                    reservationCode: reservation.reservation_code,
                    cause: error,
                })
            )
        )
    )
}

/**
 * Configuration for check-in/check-out times per property
 */
export interface PropertyTimeConfig {
    checkInHour: number
    checkInMinute: number
    checkOutHour: number
    checkOutMinute: number
}

/**
 * Generate full-day booking events (one event per booking covering the entire stay)
 */
export function generateFullDayEvents(
    reservations: Reservation[]
): Effect.Effect<CalendarEvent[], ReservationProcessingError> {
    // Filter out cancelled bookings
    const activeReservations = reservations.filter(
        (r) => r.status !== 'cancelled'
    )

    return Effect.gen(function* () {
        const events: CalendarEvent[] = []

        for (const reservation of activeReservations) {
            const result = yield* Effect.gen(function* () {
                const title = yield* generateTitleForReservation(reservation)
                const description =
                    yield* generateDescriptionForReservation(reservation)

                return {
                    description,
                    end: reservation.check_out_date,
                    isAllDay: true,
                    reservation,
                    start: reservation.check_in_date,
                    title,
                }
            }).pipe(
                Effect.catchAll((error) =>
                    Effect.gen(function* () {
                        yield* Console.error(
                            `Failed to generate event for reservation ${reservation.reservation_code}:`,
                            error
                        )
                        return null
                    })
                )
            )

            if (result !== null) {
                events.push(result)
            }
        }

        return events
    })
}

/**
 * Generate check-in/check-out events (two events per booking)
 */
export function generateCheckInOutEvents(
    reservations: Reservation[],
    getPropertyTimes: (propertyId: number) => PropertyTimeConfig
): Effect.Effect<CalendarEvent[], ReservationProcessingError> {
    // Filter out cancelled bookings
    const activeReservations = reservations.filter(
        (r) => r.status !== 'cancelled'
    )

    return Effect.gen(function* () {
        const events: CalendarEvent[] = []

        for (const reservation of activeReservations) {
            const result = yield* Effect.gen(function* () {
                const times = getPropertyTimes(reservation.property_id)
                const title = yield* generateTitleForReservation(reservation)
                const description =
                    yield* generateDescriptionForReservation(reservation)

                // Check-in event
                const checkInDate = new Date(reservation.check_in_date)
                checkInDate.setHours(
                    times.checkInHour,
                    times.checkInMinute,
                    0,
                    0
                )
                const checkInEvent: CalendarEvent = {
                    description,
                    end: checkInDate.toISOString(),
                    isAllDay: false,
                    reservation,
                    start: checkInDate.toISOString(),
                    title: `Check-in: ${title}`,
                }

                // Check-out event
                const checkOutDate = new Date(reservation.check_out_date)
                checkOutDate.setHours(
                    times.checkOutHour,
                    times.checkOutMinute,
                    0,
                    0
                )
                const checkOutEvent: CalendarEvent = {
                    description,
                    end: checkOutDate.toISOString(),
                    isAllDay: false,
                    reservation,
                    start: checkOutDate.toISOString(),
                    title: `Check-out: ${title}`,
                }

                return [checkInEvent, checkOutEvent]
            }).pipe(
                Effect.catchAll((error) =>
                    Effect.gen(function* () {
                        yield* Console.error(
                            `Failed to generate events for reservation ${reservation.reservation_code}:`,
                            error
                        )
                        return []
                    })
                )
            )

            events.push(...result)
        }

        return events
    })
}
