import { Data } from 'effect'

/**
 * OpenAI Service Types
 *
 * Type definitions for the OpenAI service integration
 */

// ============================================================================
// Error Types
// ============================================================================

export class OpenAIError extends Data.TaggedError('OpenAIError')<{
    readonly message: string
    readonly cause?: unknown
}> {}

export class OpenAIAuthError extends Data.TaggedError('OpenAIAuthError')<{
    readonly message: string
}> {}

export class OpenAINetworkError extends Data.TaggedError('OpenAINetworkError')<{
    readonly message: string
    readonly cause?: unknown
}> {}

export class OpenAIConfigError extends Data.TaggedError('OpenAIConfigError')<{
    readonly message: string
}> {}

// ============================================================================
// Configuration Types
// ============================================================================

export interface OpenAIConfig {
    readonly apiKey: string
    readonly model?: string
    readonly maxTokens?: number
    readonly temperature?: number
}

// ============================================================================
// Message Types
// ============================================================================

export type MessageRole = 'system' | 'user' | 'assistant'

export interface ChatMessage {
    role: MessageRole
    content: string
}

export interface ChatCompletionOptions {
    messages: ChatMessage[]
    model?: string
    maxTokens?: number
    temperature?: number
}

export interface ChatCompletionResponse {
    content: string
    model: string
    usage?: {
        promptTokens: number
        completionTokens: number
        totalTokens: number
    }
}

// ============================================================================
// Context Types
// ============================================================================

export interface ConversationContext {
    instructions?: string
    examples?: string
}
