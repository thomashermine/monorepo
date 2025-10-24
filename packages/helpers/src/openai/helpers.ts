import { Effect } from 'effect'

import type {
    ChatCompletionOptions,
    ChatMessage,
    ConversationContext,
} from './types'
import { OpenAIError } from './types'

/**
 * Build chat messages with context
 */
export function buildMessagesWithContext(
    userMessage: string,
    context?: ConversationContext
): Effect.Effect<ChatMessage[], OpenAIError> {
    return Effect.sync(() => {
        const messages: ChatMessage[] = []

        // Add system instructions if provided
        if (context?.instructions) {
            messages.push({
                content: context.instructions,
                role: 'system',
            })
        }

        // Add examples if provided
        if (context?.examples) {
            messages.push({
                content: `Here are examples of past conversations:\n\n${context.examples}`,
                role: 'system',
            })
        }

        // Add user message
        messages.push({
            content: userMessage,
            role: 'user',
        })

        return messages
    }).pipe(
        Effect.catchAll((error) =>
            Effect.fail(
                new OpenAIError({
                    message: 'Failed to build messages with context',
                    cause: error,
                })
            )
        )
    )
}

/**
 * Validate chat completion options
 */
export function validateChatOptions(
    options: ChatCompletionOptions
): Effect.Effect<void, OpenAIError> {
    return Effect.try({
        catch: (error) =>
            new OpenAIError({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Invalid chat options',
                cause: error,
            }),
        try: () => {
            if (!options.messages || options.messages.length === 0) {
                throw new Error('Messages array cannot be empty')
            }

            if (options.maxTokens && options.maxTokens < 1) {
                throw new Error('maxTokens must be greater than 0')
            }

            if (
                options.temperature !== undefined &&
                (options.temperature < 0 || options.temperature > 2)
            ) {
                throw new Error('temperature must be between 0 and 2')
            }
        },
    })
}

/**
 * Format a simple message for common use cases
 */
export function formatSimpleMessage(
    guestName: string,
    channel: string,
    message: string
): string {
    return `GUEST NAME: ${guestName}
CHANNEL: ${channel}
MESSAGE: ${message}`
}

/**
 * Extract key information from a formatted message
 */
export function parseFormattedMessage(formattedMessage: string): Effect.Effect<
    {
        guestName: string
        channel: string
        message: string
    },
    OpenAIError
> {
    return Effect.sync(() => {
        const lines = formattedMessage.split('\n')
        const guestNameLine = lines.find((line) =>
            line.startsWith('GUEST NAME:')
        )
        const channelLine = lines.find((line) => line.startsWith('CHANNEL:'))
        const messageLine = lines.find((line) => line.startsWith('MESSAGE:'))

        if (!guestNameLine || !channelLine || !messageLine) {
            throw new Error('Invalid formatted message structure')
        }

        return {
            channel: channelLine.replace('CHANNEL:', '').trim(),
            guestName: guestNameLine.replace('GUEST NAME:', '').trim(),
            message: messageLine.replace('MESSAGE:', '').trim(),
        }
    }).pipe(
        Effect.catchAll((error) =>
            Effect.fail(
                new OpenAIError({
                    message: 'Failed to parse formatted message',
                    cause: error,
                })
            )
        )
    )
}
