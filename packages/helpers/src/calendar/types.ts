import type { Reservation } from '../hostex'

export interface CalendarEvent {
    title: string
    description: string
    start: string
    end: string
    isAllDay: boolean
    reservation: Reservation
}
