import { describe, expect, it } from 'vitest'

import {
    mockAssistantMessage,
    mockChatCompletionResponse,
    mockChatCompletionResponseNoUsage,
    mockContext,
    mockConversationMessages,
    mockEmptyContext,
    mockErrorMessages,
    mockExamples,
    mockFormattedMessage1,
    mockFormattedMessage2,
    mockGuestMessage1,
    mockGuestMessage2,
    mockInstructions,
    mockInvalidFormattedMessage,
    mockOpenAIAPIEmptyResponse,
    mockOpenAIAPIResponse,
    mockOpenAIConfig,
    mockOpenAIConfigWithoutOptionals,
    mockSystemMessage,
    mockUserMessage,
} from './mocks'

/**
 * Tests for OpenAI mock data
 */

describe('OpenAI Mocks', () => {
    describe('Configuration Mocks', () => {
        it('should have valid full config', () => {
            expect(mockOpenAIConfig).toMatchObject({
                apiKey: expect.stringContaining('sk-'),
                model: expect.any(String),
                temperature: expect.any(Number),
            })
            expect(mockOpenAIConfig.temperature).toBeGreaterThanOrEqual(0)
            expect(mockOpenAIConfig.temperature).toBeLessThanOrEqual(2)
        })

        it('should have valid minimal config', () => {
            expect(mockOpenAIConfigWithoutOptionals).toMatchObject({
                apiKey: expect.stringContaining('sk-'),
            })
            expect(mockOpenAIConfigWithoutOptionals.model).toBeUndefined()
        })
    })

    describe('Message Mocks', () => {
        it('should have valid system message', () => {
            expect(mockSystemMessage).toMatchObject({
                content: expect.any(String),
                role: 'system',
            })
        })

        it('should have valid user message', () => {
            expect(mockUserMessage).toMatchObject({
                content: expect.any(String),
                role: 'user',
            })
        })

        it('should have valid assistant message', () => {
            expect(mockAssistantMessage).toMatchObject({
                content: expect.any(String),
                role: 'assistant',
            })
        })

        it('should have valid conversation messages', () => {
            expect(mockConversationMessages).toHaveLength(3)
            expect(mockConversationMessages[0]?.role).toBe('system')
            expect(mockConversationMessages[1]?.role).toBe('user')
            expect(mockConversationMessages[2]?.role).toBe('assistant')
        })
    })

    describe('Context Mocks', () => {
        it('should have valid context with instructions and examples', () => {
            expect(mockContext).toMatchObject({
                examples: expect.any(String),
                instructions: expect.any(String),
            })
            expect(mockInstructions.length).toBeGreaterThan(0)
            expect(mockExamples.length).toBeGreaterThan(0)
        })

        it('should have valid empty context', () => {
            expect(mockEmptyContext).toEqual({})
        })
    })

    describe('Response Mocks', () => {
        it('should have valid chat completion response with usage', () => {
            expect(mockChatCompletionResponse).toMatchObject({
                content: expect.any(String),
                model: expect.any(String),
                usage: {
                    completionTokens: expect.any(Number),
                    promptTokens: expect.any(Number),
                    totalTokens: expect.any(Number),
                },
            })
            expect(mockChatCompletionResponse.usage?.totalTokens).toBe(
                (mockChatCompletionResponse.usage?.promptTokens || 0) +
                    (mockChatCompletionResponse.usage?.completionTokens || 0)
            )
        })

        it('should have valid chat completion response without usage', () => {
            expect(mockChatCompletionResponseNoUsage).toMatchObject({
                content: expect.any(String),
                model: expect.any(String),
            })
            expect(mockChatCompletionResponseNoUsage.usage).toBeUndefined()
        })
    })

    describe('Guest Message Mocks', () => {
        it('should have valid guest message structures', () => {
            expect(mockGuestMessage1).toMatchObject({
                channel: expect.any(String),
                guestName: expect.any(String),
                message: expect.any(String),
            })
        })

        it('should have properly formatted messages', () => {
            expect(mockFormattedMessage1).toContain('GUEST NAME:')
            expect(mockFormattedMessage1).toContain('CHANNEL:')
            expect(mockFormattedMessage1).toContain('MESSAGE:')
            expect(mockFormattedMessage1).toContain(mockGuestMessage1.guestName)
        })

        it('should have different guest messages', () => {
            expect(mockGuestMessage1.guestName).not.toBe(
                mockGuestMessage2.guestName
            )
            expect(mockFormattedMessage1).not.toBe(mockFormattedMessage2)
        })

        it('should have invalid formatted message for testing', () => {
            expect(mockInvalidFormattedMessage).not.toContain('GUEST NAME:')
        })
    })

    describe('API Response Mocks', () => {
        it('should have valid OpenAI API response structure', () => {
            expect(mockOpenAIAPIResponse).toMatchObject({
                choices: expect.any(Array),
                created: expect.any(Number),
                id: expect.any(String),
                model: expect.any(String),
                object: 'chat.completion',
            })
            expect(mockOpenAIAPIResponse.choices[0]).toMatchObject({
                finish_reason: 'stop',
                index: 0,
                message: {
                    content: expect.any(String),
                    role: 'assistant',
                },
            })
        })

        it('should have empty API response for error testing', () => {
            expect(mockOpenAIAPIEmptyResponse.choices).toHaveLength(0)
        })
    })

    describe('Error Message Mocks', () => {
        it('should have all error message types', () => {
            expect(mockErrorMessages).toMatchObject({
                authError: expect.any(String),
                configError: expect.any(String),
                invalidOptions: expect.any(String),
                networkError: expect.any(String),
                parseError: expect.any(String),
            })
        })

        it('should have descriptive error messages', () => {
            expect(mockErrorMessages.authError.length).toBeGreaterThan(10)
            expect(mockErrorMessages.networkError.length).toBeGreaterThan(10)
        })
    })
})
