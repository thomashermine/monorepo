import 'dotenv/config'

import { createServer } from 'node:http'

import { HttpRouter, HttpServer, HttpServerResponse } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { generateICS } from '@monorepo/helpers/calendar'
import {
    generateCheckInOutEvents,
    generateFullDayEvents,
    HostexService,
    HostexServiceLive,
} from '@monorepo/helpers/hostex'
import { Console, Effect, Layer } from 'effect'

import { getPropertyTimes } from './config/property-times'

const port = process.env.PORT ?? 3000

// ============================================================================================================ Routes
const router = HttpRouter.empty.pipe(
    HttpRouter.get(
        '/',
        Effect.gen(function* () {
            return yield* HttpServerResponse.text('Hello World')
        })
    ),
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
    ),
    // Full-day events ICS
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
    ),
    // Check-in/Check-out events ICS
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
    ),
    // Full-day events JSON (for debugging)
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
    ),
    // Check-in/Check-out events JSON (for debugging)
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
    ),
    // Export all HOSTEX messages as TXT for LLM training
    HttpRouter.get(
        '/messages/export/llm-training.txt',
        Effect.gen(function* () {
            const hostexService = yield* HostexService

            // Fetch all conversations with pagination
            const allConversations: Array<{
                conversation: {
                    id: string
                    reservationCode?: string
                    guestName: string
                    propertyId: string
                    channel?: string
                    lastMessageAt: string
                    unreadCount: number
                }
                messages: Array<{
                    id: string
                    conversationId: string
                    content: string
                    sentBy: 'host' | 'guest'
                    sentAt: string
                    messageType: 'text' | 'image'
                    imageUrl?: string
                }>
            }> = []

            let currentPage = 1
            const pageSize = 100
            let hasMorePages = true

            // Paginate through all conversations ================================================
            while (hasMorePages) {
                const conversationsResponse =
                    yield* hostexService.getConversations(currentPage, pageSize)

                // For each conversation, fetch its messages =====================================
                for (const conversation of conversationsResponse.data) {
                    const details = yield* hostexService.getConversationDetails(
                        conversation.id
                    )
                    allConversations.push({
                        conversation: details.data.conversation,
                        messages: details.data.messages,
                    })
                }

                // Check if there are more pages ================================================
                hasMorePages =
                    conversationsResponse.data.length === pageSize &&
                    currentPage * pageSize < conversationsResponse.total

                currentPage++
            }

            // Format as continuous TXT for LLM training ========================================
            const lines: string[] = []

            // Add header ====================================================================
            lines.push('=' + '='.repeat(118))
            lines.push(
                'HOSTEX MESSAGE EXPORT FOR LLM TRAINING'.padStart(70, ' ')
            )
            lines.push(
                `Generated: ${new Date().toISOString()}`.padStart(70, ' ')
            )
            lines.push(
                `Total Conversations: ${allConversations.length}`.padStart(
                    70,
                    ' '
                )
            )
            lines.push(
                `Total Messages: ${allConversations.reduce((acc, c) => acc + c.messages.length, 0)}`.padStart(
                    70,
                    ' '
                )
            )
            lines.push('=' + '='.repeat(118))
            lines.push('')
            lines.push('')

            // Format each conversation ======================================================
            for (const { conversation, messages } of allConversations) {
                // Conversation header =======================================================
                lines.push('-' + '-'.repeat(118))
                lines.push(
                    `CONVERSATION ID: ${conversation.id} | Guest: ${conversation.guestName} | Property: ${conversation.propertyId}`
                )
                if (conversation.reservationCode) {
                    lines.push(`Reservation: ${conversation.reservationCode}`)
                }
                if (conversation.channel) {
                    lines.push(`Channel: ${conversation.channel}`)
                }
                lines.push(`Last Message: ${conversation.lastMessageAt}`)
                lines.push(`Total Messages: ${messages.length}`)
                lines.push('-' + '-'.repeat(118))
                lines.push('')

                // Sort messages by timestamp ================================================
                const sortedMessages = messages.sort(
                    (a, b) =>
                        new Date(a.sentAt).getTime() -
                        new Date(b.sentAt).getTime()
                )

                // Format each message =======================================================
                for (const message of sortedMessages) {
                    const sender =
                        message.sentBy === 'host' ? '[HOST]' : '[GUEST]'
                    const timestamp = new Date(message.sentAt).toISOString()

                    lines.push(`${sender} (${timestamp})`)

                    if (message.messageType === 'image' && message.imageUrl) {
                        lines.push(`[IMAGE]: ${message.imageUrl}`)
                    }

                    // Wrap long messages at 120 characters ==================================
                    const contentLines = message.content
                        .split('\n')
                        .flatMap((line) => {
                            if (line.length <= 120) return [line]
                            const wrapped: string[] = []
                            let currentLine = ''
                            for (const word of line.split(' ')) {
                                if (currentLine.length + word.length + 1 > 120) {
                                    if (currentLine) wrapped.push(currentLine)
                                    currentLine = word
                                } else {
                                    currentLine = currentLine
                                        ? `${currentLine} ${word}`
                                        : word
                                }
                            }
                            if (currentLine) wrapped.push(currentLine)
                            return wrapped
                        })

                    for (const line of contentLines) {
                        lines.push(`  ${line}`)
                    }

                    lines.push('')
                }

                // Add spacing between conversations =========================================
                lines.push('')
                lines.push('')
            }

            // Footer ====================================================================
            lines.push('=' + '='.repeat(118))
            lines.push('END OF MESSAGE EXPORT'.padStart(70, ' '))
            lines.push('=' + '='.repeat(118))

            const txtContent = lines.join('\n')

            return yield* HttpServerResponse.text(txtContent, {
                headers: {
                    'Content-Disposition':
                        'attachment; filename="hostex-messages-llm-training.txt"',
                    'Content-Type': 'text/plain; charset=utf-8',
                },
            })
        })
    ),
    // Generic 404 handler for unsupported URLs
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

// ============================================================================================================ Error Handling
const routerWithErrorHandling = router.pipe(
    Effect.catchAll((error) =>
        Effect.gen(function* () {
            yield* Console.error('Request error:', error)

            const errorMessage =
                error && typeof error === 'object' && 'message' in error
                    ? String((error as { message: unknown }).message)
                    : JSON.stringify(error)

            return yield* HttpServerResponse.json(
                {
                    error: 'Internal server error',
                    message: errorMessage,
                },
                { status: 500 }
            )
        })
    )
)

// ============================================================================================================ Server Setup
const ServerLive = routerWithErrorHandling.pipe(
    HttpServer.serve(),
    HttpServer.withLogAddress,
    Layer.provide(NodeHttpServer.layer(createServer, { port: Number(port) })),
    Layer.provide(HostexServiceLive)
)

// ================================================================================================================ Program
const program = Effect.gen(function* () {
    yield* Console.log(
        `🚀 Server running on http://localhost:${port}.`,
        `Some env var: ${process.env.SOME_ENV_VAR}`
    )
    yield* Layer.launch(ServerLive)
})

// ===================================================================================================================== Run
NodeRuntime.runMain(program)
