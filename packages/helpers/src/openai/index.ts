import { Config, Context, Effect, Layer } from 'effect'
import { readFile } from 'fs/promises'
import OpenAI from 'openai'
import { join } from 'path'

import type {
    ChatCompletionOptions,
    ChatCompletionResponse,
    ConversationContext,
} from './types'
import {
    OpenAIAuthError,
    OpenAIConfigError,
    OpenAIError,
    OpenAINetworkError,
} from './types'

/**
 * OpenAI Service
 *
 * An Effect-based service for interacting with OpenAI's API
 */
export class OpenAIService extends Context.Tag('OpenAIService')<
    OpenAIService,
    {
        readonly sendMessage: (
            message: string,
            context?: ConversationContext
        ) => Effect.Effect<
            string,
            | OpenAIError
            | OpenAINetworkError
            | OpenAIAuthError
            | OpenAIConfigError
        >
        readonly chat: (
            options: ChatCompletionOptions
        ) => Effect.Effect<
            ChatCompletionResponse,
            | OpenAIError
            | OpenAINetworkError
            | OpenAIAuthError
            | OpenAIConfigError
        >
    }
>() {}

/**
 * Create a live implementation of the OpenAI Service
 */
export function makeOpenAIServiceLive(config?: {
    instructionsPath?: string
    examplesPath?: string
}): Layer.Layer<
    OpenAIService,
    OpenAIError | OpenAIAuthError | OpenAIConfigError | OpenAINetworkError
> {
    return Layer.effect(
        OpenAIService,
        Effect.gen(function* () {
            // Get API key from environment
            const apiKey = yield* Config.string('OPENAI_API_KEY').pipe(
                Effect.catchAll(() =>
                    Effect.fail(
                        new OpenAIAuthError({
                            message:
                                'OPENAI_API_KEY environment variable is not set',
                        })
                    )
                )
            )

            // Get optional model configuration
            const model = yield* Config.string('OPENAI_MODEL').pipe(
                Effect.catchAll(() => Effect.succeed('gpt-4o-mini'))
            )

            // Create OpenAI client
            const openai = new OpenAI({ apiKey })

            // Load instruction and message files if paths are provided
            let instructionsContent: string | undefined
            let examplesContent: string | undefined

            if (config?.instructionsPath) {
                const instructions = yield* Effect.tryPromise({
                    catch: (error) =>
                        new OpenAIConfigError({
                            message: `Failed to load instructions file: ${config.instructionsPath}`,
                        }),
                    try: () =>
                        readFile(
                            join(process.cwd(), config.instructionsPath!),
                            'utf-8'
                        ),
                })
                instructionsContent = instructions
            }

            if (config?.examplesPath) {
                const examples = yield* Effect.tryPromise({
                    catch: (error) =>
                        new OpenAIConfigError({
                            message: `Failed to load examples file: ${config.examplesPath}`,
                        }),
                    try: () =>
                        readFile(
                            join(process.cwd(), config.examplesPath!),
                            'utf-8'
                        ),
                })
                examplesContent = examples
            }

            // Create the service implementation
            return OpenAIService.of({
                chat: (options: ChatCompletionOptions) =>
                    Effect.tryPromise({
                        catch: (error) =>
                            new OpenAINetworkError({
                                message: 'Failed to complete chat request',
                                cause: error,
                            }),
                        try: async () => {
                            const completion =
                                await openai.chat.completions.create({
                                    max_tokens: options.maxTokens,
                                    messages: options.messages,
                                    model: options.model || model,
                                    temperature: options.temperature,
                                })

                            return {
                                content:
                                    completion.choices[0]?.message?.content ||
                                    'No response from OpenAI',
                                model: completion.model,
                                usage: completion.usage
                                    ? {
                                          completionTokens:
                                              completion.usage
                                                  .completion_tokens,
                                          promptTokens:
                                              completion.usage.prompt_tokens,
                                          totalTokens:
                                              completion.usage.total_tokens,
                                      }
                                    : undefined,
                            }
                        },
                    }),

                sendMessage: (
                    userMessage: string,
                    context?: ConversationContext
                ) =>
                    Effect.gen(function* () {
                        const messages: Array<{
                            role: 'system' | 'user' | 'assistant'
                            content: string
                        }> = []

                        // Add instructions from context or default
                        const instructions =
                            context?.instructions || instructionsContent
                        if (instructions) {
                            messages.push({
                                content: instructions,
                                role: 'system',
                            })
                        }

                        // Add examples from context or default
                        const examples = context?.examples || examplesContent
                        if (examples) {
                            messages.push({
                                content: `Here are examples of past conversations:\n\n${examples}`,
                                role: 'system',
                            })
                        }

                        // Add user message
                        messages.push({
                            content: userMessage,
                            role: 'user',
                        })

                        // Make the API call
                        const response = yield* Effect.tryPromise({
                            catch: (error) =>
                                new OpenAINetworkError({
                                    message: 'Failed to send message to OpenAI',
                                    cause: error,
                                }),
                            try: async () => {
                                const completion =
                                    await openai.chat.completions.create({
                                        messages,
                                        model,
                                    })

                                return (
                                    completion.choices[0]?.message?.content ||
                                    'No response from OpenAI'
                                )
                            },
                        })

                        return response
                    }),
            })
        })
    )
}

/**
 * Default live implementation with standard file paths
 */
export const OpenAIServiceLive = makeOpenAIServiceLive({
    examplesPath: 'src/llm-messages.txt',
    instructionsPath: 'src/llm-instructions.txt',
})

// Re-export types and helpers
export * from './helpers'
export * from './types'
