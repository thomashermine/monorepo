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
import { OpenAIServiceLive } from '@monorepo/helpers/openai'
import { Console, Effect, Layer } from 'effect'

import { MESSAGE_EXPORT_CUTOFF_DATE } from './config/message-export'
import { getPropertyTimes } from './config/property-times'

const port = process.env.PORT ?? 3000

// ============================================================================================================ Helper Functions
/**
 * Generate the LLM training text content
 */
const generateLLMTrainingText = Effect.gen(function* () {
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
        yield* Console.log(`Fetching conversations page ${currentPage}...`)

        const conversationsResponse = yield* hostexService
            .getConversations(currentPage, pageSize)
            .pipe(
                Effect.catchAll((error) =>
                    Effect.gen(function* () {
                        yield* Console.error(
                            `Failed to fetch conversations page ${currentPage}:`,
                            error
                        )
                        return {
                            data: [],
                            page: currentPage,
                            pageSize: pageSize,
                            requestId: 'error',
                            total: 0,
                        }
                    })
                )
            )

        yield* Console.log(
            `Found ${conversationsResponse.data.length} conversations on page ${currentPage}`
        )

        // For each conversation, fetch its messages =====================================
        for (const conversation of conversationsResponse.data) {
            yield* Console.log(
                `Fetching messages for conversation ${conversation.id} (${conversation.guestName})...`
            )

            yield* Console.log(`  Calling API for conversation details...`)

            const result = yield* hostexService
                .getConversationDetails(conversation.id)
                .pipe(
                    Effect.tap(() =>
                        Console.log('  API call completed successfully')
                    ),
                    Effect.map((details) => {
                        return details
                    }),
                    Effect.catchAll((error) =>
                        Effect.gen(function* () {
                            yield* Console.error(
                                `  ✗ Failed to fetch conversation ${conversation.id}:`,
                                error
                            )
                            return null
                        })
                    ),
                    Effect.timeout('10 seconds')
                )

            yield* Console.log(
                `  Finished processing conversation ${conversation.id}`
            )

            if (result) {
                yield* Console.log(
                    `  → Got ${result.data?.messages?.length || 0} messages`
                )
                // Check if data has the expected structure
                if (result.data?.conversation && result.data?.messages) {
                    allConversations.push({
                        conversation: result.data.conversation,
                        messages: result.data.messages,
                    })
                } else {
                    yield* Console.error(
                        `  ✗ Unexpected response structure for conversation ${conversation.id}:`,
                        JSON.stringify(result, null, 2)
                    )
                }
            }
        }

        // Check if there are more pages ================================================
        hasMorePages =
            conversationsResponse.data.length === pageSize &&
            currentPage * pageSize < conversationsResponse.total

        currentPage++
    }

    yield* Console.log(
        `Finished fetching ${allConversations.length} conversations`
    )

    // Format as continuous TXT for LLM training ========================================
    const lines: string[] = []

    // Log cutoff date if set ========================================================
    if (MESSAGE_EXPORT_CUTOFF_DATE) {
        yield* Console.log(
            `Filtering messages older than: ${MESSAGE_EXPORT_CUTOFF_DATE.toISOString()}`
        )
    }

    // Prepare data with filtered messages ===========================================
    const conversationsWithFilteredMessages = allConversations
        .map(({ conversation, messages }) => {
            const sortedMessages = messages.sort(
                (a, b) =>
                    new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            )

            const filteredMessages = MESSAGE_EXPORT_CUTOFF_DATE
                ? sortedMessages.filter(
                      (message) =>
                          new Date(message.sentAt).getTime() >=
                          (MESSAGE_EXPORT_CUTOFF_DATE?.getTime() ?? 0)
                  )
                : sortedMessages

            return {
                conversation,
                messages: filteredMessages,
            }
        })
        .filter(({ messages }) => messages.length > 0)

    const totalFilteredMessages = conversationsWithFilteredMessages.reduce(
        (acc, c) => acc + c.messages.length,
        0
    )

    yield* Console.log(
        `After filtering: ${conversationsWithFilteredMessages.length} conversations with ${totalFilteredMessages} messages`
    )

    // Add header ====================================================================
    lines.push('=' + '='.repeat(118))
    lines.push('HOSTEX MESSAGE EXPORT FOR LLM TRAINING'.padStart(70, ' '))
    lines.push(`Generated: ${new Date().toISOString()}`.padStart(70, ' '))
    if (MESSAGE_EXPORT_CUTOFF_DATE) {
        lines.push(
            `Messages Since: ${MESSAGE_EXPORT_CUTOFF_DATE.toISOString()}`.padStart(
                70,
                ' '
            )
        )
    }
    lines.push(
        `Total Conversations: ${conversationsWithFilteredMessages.length}`.padStart(
            70,
            ' '
        )
    )
    lines.push(`Total Messages: ${totalFilteredMessages}`.padStart(70, ' '))
    lines.push('=' + '='.repeat(118))
    lines.push('')
    lines.push('')

    // Format each conversation ======================================================
    for (const {
        conversation,
        messages,
    } of conversationsWithFilteredMessages) {
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

        // Format each message (already sorted and filtered) =========================
        for (const message of messages) {
            const sender = message.sentBy === 'host' ? '[HOST]' : '[GUEST]'
            const timestamp = new Date(message.sentAt).toISOString()

            lines.push(`${sender} (${timestamp})`)

            if (message.messageType === 'image' && message.imageUrl) {
                lines.push(`[IMAGE]: ${message.imageUrl}`)
            }

            // Wrap long messages at 120 characters ==================================
            const contentLines = message.content.split('\n').flatMap((line) => {
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

    return txtContent
})

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
            const txtContent = yield* generateLLMTrainingText

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
            yield* Console.error('Error type:', typeof error)
            yield* Console.error(
                'Error keys:',
                error && typeof error === 'object' ? Object.keys(error) : 'N/A'
            )

            let errorMessage = 'Unknown error'

            if (error && typeof error === 'object') {
                if ('message' in error) {
                    errorMessage = String(
                        (error as { message: unknown }).message
                    )
                } else {
                    errorMessage = JSON.stringify(error)
                }
            } else if (typeof error === 'string') {
                errorMessage = error
            }

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
    Layer.provide(HostexServiceLive),
    Layer.provide(OpenAIServiceLive)
)

// ================================================================================================================ Program
const program = Effect.gen(function* () {
    yield* Console.log(
        `🚀 Server running on http://localhost:${port}.`,
        `Some env var: ${process.env.SOME_ENV_VAR}`
    )

    yield* Layer.launch(ServerLive)
}).pipe(Effect.provide(HostexServiceLive), Effect.provide(OpenAIServiceLive))

// ===================================================================================================================== Run
NodeRuntime.runMain(program)
