import { HttpRouter, HttpServerResponse } from '@effect/platform'
import { HostexService } from '@monorepo/helpers/hostex'
import { Console, Effect } from 'effect'

import { MESSAGE_EXPORT_CUTOFF_DATE } from '../config/message-export'

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

export const messagesExportRoute = HttpRouter.empty.pipe(
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
    )
)
