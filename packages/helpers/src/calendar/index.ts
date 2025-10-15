import { createEvents, type EventAttributes } from 'ics'

import type { CalendarEvent } from './types'

/**
 * Convert date string to ICS date array format
 * @returns [year, month, day]
 */
export const parseICSDate = (dateString: string): [number, number, number] => {
    const date = new Date(dateString)
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
}

/**
 * Generate ICS file content from calendar events
 */
export function generateICS(events: CalendarEvent[]): string {
    const icsEvents: EventAttributes[] = events.map((event) => {
        const uid = event.isAllDay
            ? `booking-${event.reservation.reservation_code}`
            : `${event.title.startsWith('Check-in') ? 'checkin' : 'checkout'}-${event.reservation.reservation_code}`

        if (event.isAllDay) {
            // Full-day event
            return {
                description: event.description,
                end: parseICSDate(event.end),
                start: parseICSDate(event.start),
                title: event.title,
                uid,
            }
        } else {
            // Timed event (check-in/check-out)
            const startDate = new Date(event.start)
            const endDate = new Date(event.end)

            return {
                description: event.description,
                end: [
                    endDate.getFullYear(),
                    endDate.getMonth() + 1,
                    endDate.getDate(),
                    endDate.getHours(),
                    endDate.getMinutes(),
                ],
                start: [
                    startDate.getFullYear(),
                    startDate.getMonth() + 1,
                    startDate.getDate(),
                    startDate.getHours(),
                    startDate.getMinutes(),
                ],
                title: event.title,
                uid,
            }
        }
    })

    const { error, value } = createEvents(icsEvents)

    if (error) {
        throw new Error(`Failed to generate ICS: ${error.message}`)
    }

    return value ?? ''
}

export type { CalendarEvent } from './types'
