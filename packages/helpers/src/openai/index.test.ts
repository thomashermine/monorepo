import { Config, Effect, Layer } from 'effect'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
    buildMessagesWithContext,
    formatSimpleMessage,
    parseFormattedMessage,
    validateChatOptions,
} from './helpers'
import { makeOpenAIServiceLive, OpenAIService } from './index'
import {
    mockChatCompletionResponse,
    mockContext,
    mockEmptyContext,
    mockFormattedMessage1,
    mockGuestMessage1,
    mockInvalidFormattedMessage,
    mockUserMessage,
} from './mocks'
import type { ChatCompletionOptions } from './types'

/**
 * Tests for OpenAI Service
 */

// Mock the OpenAI SDK
vi.mock('openai', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            chat: {
                completions: {
                    create: vi.fn().mockResolvedValue({
                        choices: [
                            {
                                message: {
                                    content: mockChatCompletionResponse.content,
                                },
                            },
                        ],
                        model: mockChatCompletionResponse.model,
                        usage: {
                            completion_tokens:
                                mockChatCompletionResponse.usage
                                    ?.completionTokens,
                            prompt_tokens:
                                mockChatCompletionResponse.usage?.promptTokens,
                            total_tokens:
                                mockChatCompletionResponse.usage?.totalTokens,
                        },
                    }),
                },
            },
        })),
    }
})

// Mock fs/promises
vi.mock('node:fs/promises', () => ({
    readFile: vi.fn().mockResolvedValue('Mock file content'),
}))

describe('OpenAI Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Set environment variables for testing
        process.env.OPENAI_API_KEY = 'sk-test-key'
        process.env.OPENAI_MODEL = 'gpt-4o-mini'
    })

    afterEach(() => {
        delete process.env.OPENAI_API_KEY
        delete process.env.OPENAI_MODEL
    })

    describe('Service Creation', () => {
        it('should create service with valid API key', async () => {
            const program = Effect.gen(function* () {
                const service = yield* OpenAIService
                expect(service).toBeDefined()
                expect(service.sendMessage).toBeDefined()
                expect(service.chat).toBeDefined()
            })

            const layer = makeOpenAIServiceLive()
            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should fail when API key is missing', async () => {
            delete process.env.OPENAI_API_KEY

            const program = Effect.gen(function* () {
                yield* OpenAIService
            })

            const layer = makeOpenAIServiceLive()

            await expect(
                Effect.runPromise(program.pipe(Effect.provide(layer)))
            ).rejects.toThrow()
        })

        it('should use default model when not specified', async () => {
            delete process.env.OPENAI_MODEL

            const program = Effect.gen(function* () {
                const service = yield* OpenAIService
                expect(service).toBeDefined()
            })

            const layer = makeOpenAIServiceLive()
            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })
    })

    describe('sendMessage', () => {
        it('should send a simple message', async () => {
            const program = Effect.gen(function* () {
                const service = yield* OpenAIService
                const response = yield* service.sendMessage('Hello!')
                expect(response).toBe(mockChatCompletionResponse.content)
            })

            const layer = makeOpenAIServiceLive()
            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should send message with context', async () => {
            const program = Effect.gen(function* () {
                const service = yield* OpenAIService
                const response = yield* service.sendMessage(
                    'Hello!',
                    mockContext
                )
                expect(response).toBe(mockChatCompletionResponse.content)
            })

            const layer = makeOpenAIServiceLive()
            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should handle empty context', async () => {
            const program = Effect.gen(function* () {
                const service = yield* OpenAIService
                const response = yield* service.sendMessage(
                    'Hello!',
                    mockEmptyContext
                )
                expect(response).toBe(mockChatCompletionResponse.content)
            })

            const layer = makeOpenAIServiceLive()
            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })
    })

    describe('chat', () => {
        it('should complete a chat request', async () => {
            const options: ChatCompletionOptions = {
                messages: [mockUserMessage],
                model: 'gpt-4o-mini',
            }

            const program = Effect.gen(function* () {
                const service = yield* OpenAIService
                const response = yield* service.chat(options)
                expect(response.content).toBe(
                    mockChatCompletionResponse.content
                )
                expect(response.model).toBe(mockChatCompletionResponse.model)
                expect(response.usage).toBeDefined()
            })

            const layer = makeOpenAIServiceLive()
            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should handle chat with multiple messages', async () => {
            const options: ChatCompletionOptions = {
                messages: [
                    { content: 'You are a helpful assistant.', role: 'system' },
                    { content: 'Hello!', role: 'user' },
                ],
            }

            const program = Effect.gen(function* () {
                const service = yield* OpenAIService
                const response = yield* service.chat(options)
                expect(response).toBeDefined()
            })

            const layer = makeOpenAIServiceLive()
            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })
    })

    describe('Custom Configuration', () => {
        it('should use custom file paths', async () => {
            const program = Effect.gen(function* () {
                const service = yield* OpenAIService
                expect(service).toBeDefined()
            })

            const layer = makeOpenAIServiceLive({
                examplesPath: 'custom/examples.txt',
                instructionsPath: 'custom/instructions.txt',
            })

            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })

        it('should work without file paths', async () => {
            const program = Effect.gen(function* () {
                const service = yield* OpenAIService
                const response = yield* service.sendMessage('Test message')
                expect(response).toBeDefined()
            })

            const layer = makeOpenAIServiceLive()
            await Effect.runPromise(program.pipe(Effect.provide(layer)))
        })
    })
})

describe('OpenAI Helpers', () => {
    describe('buildMessagesWithContext', () => {
        it('should build messages with full context', async () => {
            const program = buildMessagesWithContext('Hello!', mockContext)
            const messages = await Effect.runPromise(program)

            expect(messages).toHaveLength(3)
            expect(messages[0]?.role).toBe('system')
            expect(messages[1]?.role).toBe('system')
            expect(messages[2]?.role).toBe('user')
        })

        it('should build messages with empty context', async () => {
            const program = buildMessagesWithContext('Hello!', mockEmptyContext)
            const messages = await Effect.runPromise(program)

            expect(messages).toHaveLength(1)
            expect(messages[0]?.role).toBe('user')
            expect(messages[0]?.content).toBe('Hello!')
        })

        it('should build messages with only instructions', async () => {
            const program = buildMessagesWithContext('Hello!', {
                instructions: 'Test instructions',
            })
            const messages = await Effect.runPromise(program)

            expect(messages).toHaveLength(2)
            expect(messages[0]?.content).toBe('Test instructions')
        })
    })

    describe('validateChatOptions', () => {
        it('should validate valid options', async () => {
            const options: ChatCompletionOptions = {
                maxTokens: 100,
                messages: [mockUserMessage],
                temperature: 0.7,
            }

            const program = validateChatOptions(options)
            await expect(Effect.runPromise(program)).resolves.toBeUndefined()
        })

        it('should fail on empty messages', async () => {
            const options: ChatCompletionOptions = {
                messages: [],
            }

            const program = validateChatOptions(options)
            await expect(Effect.runPromise(program)).rejects.toThrow()
        })

        it('should fail on invalid maxTokens', async () => {
            const options: ChatCompletionOptions = {
                maxTokens: -1,
                messages: [mockUserMessage],
            }

            const program = validateChatOptions(options)
            await expect(Effect.runPromise(program)).rejects.toThrow()
        })

        it('should fail on invalid temperature', async () => {
            const options: ChatCompletionOptions = {
                messages: [mockUserMessage],
                temperature: 3,
            }

            const program = validateChatOptions(options)
            await expect(Effect.runPromise(program)).rejects.toThrow()
        })
    })

    describe('formatSimpleMessage', () => {
        it('should format a simple message', () => {
            const formatted = formatSimpleMessage(
                mockGuestMessage1.guestName,
                mockGuestMessage1.channel,
                mockGuestMessage1.message
            )

            expect(formatted).toBe(mockFormattedMessage1)
        })

        it('should include all fields', () => {
            const formatted = formatSimpleMessage('John', 'AirBnb', 'Hello')

            expect(formatted).toContain('GUEST NAME: John')
            expect(formatted).toContain('CHANNEL: AirBnb')
            expect(formatted).toContain('MESSAGE: Hello')
        })
    })

    describe('parseFormattedMessage', () => {
        it('should parse a valid formatted message', async () => {
            const program = parseFormattedMessage(mockFormattedMessage1)
            const parsed = await Effect.runPromise(program)

            expect(parsed.guestName).toBe(mockGuestMessage1.guestName)
            expect(parsed.channel).toBe(mockGuestMessage1.channel)
            expect(parsed.message).toBe(mockGuestMessage1.message)
        })

        it('should fail on invalid format', async () => {
            const program = parseFormattedMessage(mockInvalidFormattedMessage)
            await expect(Effect.runPromise(program)).rejects.toThrow()
        })

        it('should fail on missing fields', async () => {
            const invalidMessage = 'GUEST NAME: John\nMESSAGE: Hello'
            const program = parseFormattedMessage(invalidMessage)
            await expect(Effect.runPromise(program)).rejects.toThrow()
        })
    })
})
