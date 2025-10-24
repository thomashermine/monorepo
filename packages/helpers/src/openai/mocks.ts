import type {
    ChatCompletionResponse,
    ChatMessage,
    ConversationContext,
    OpenAIConfig,
} from './types'

/**
 * Mock data for testing the OpenAI service
 */

// ============================================================================
// Mock Configurations
// ============================================================================

export const mockOpenAIConfig: OpenAIConfig = {
    apiKey: 'sk-test-mock-api-key-1234567890',
    model: 'gpt-4o-mini',
    temperature: 0.7,
}

export const mockOpenAIConfigWithoutOptionals: OpenAIConfig = {
    apiKey: 'sk-test-mock-api-key-basic',
}

// ============================================================================
// Mock Messages
// ============================================================================

export const mockSystemMessage: ChatMessage = {
    content: 'You are a helpful assistant for a property rental business.',
    role: 'system',
}

export const mockUserMessage: ChatMessage = {
    content: 'Hello, I need help with my booking.',
    role: 'user',
}

export const mockAssistantMessage: ChatMessage = {
    content:
        'Hello! I would be happy to help you with your booking. What do you need assistance with?',
    role: 'assistant',
}

export const mockConversationMessages: ChatMessage[] = [
    mockSystemMessage,
    mockUserMessage,
    mockAssistantMessage,
]

// ============================================================================
// Mock Contexts
// ============================================================================

export const mockInstructions = `You are a helpful assistant for a property rental business.
You should be professional, friendly, and concise in your responses.
Always address the guest by their name if provided.`

export const mockExamples = `[GUEST] Hello, when is check-in time?
[HOST] Hi there! Check-in time is from 3 PM onwards. Looking forward to welcoming you!

[GUEST] Is parking available?
[HOST] Yes, we have free parking available on-site. Just let us know when you arrive!`

export const mockContext: ConversationContext = {
    examples: mockExamples,
    instructions: mockInstructions,
}

export const mockEmptyContext: ConversationContext = {}

// ============================================================================
// Mock Responses
// ============================================================================

export const mockChatCompletionResponse: ChatCompletionResponse = {
    content:
        'Thank you for your message! I would be happy to help you. Could you please provide more details about your inquiry?',
    model: 'gpt-4o-mini',
    usage: {
        completionTokens: 25,
        promptTokens: 150,
        totalTokens: 175,
    },
}

export const mockChatCompletionResponseNoUsage: ChatCompletionResponse = {
    content: 'This is a test response without usage information.',
    model: 'gpt-4o-mini',
}

// ============================================================================
// Mock Guest Messages
// ============================================================================

export const mockGuestMessage1 = {
    channel: 'AirBnb',
    guestName: 'Caroline',
    message: 'On arrive pas à se garer, sa glisse de trop',
}

export const mockGuestMessage2 = {
    channel: 'Booking.com',
    guestName: 'John Smith',
    message: 'What time is check-in?',
}

export const mockGuestMessage3 = {
    channel: 'Direct',
    guestName: 'Marie Dupont',
    message: 'Je voudrais réserver pour 3 nuits',
}

export const mockFormattedMessage1 = `GUEST NAME: ${mockGuestMessage1.guestName}
CHANNEL: ${mockGuestMessage1.channel}
MESSAGE: ${mockGuestMessage1.message}`

export const mockFormattedMessage2 = `GUEST NAME: ${mockGuestMessage2.guestName}
CHANNEL: ${mockGuestMessage2.channel}
MESSAGE: ${mockGuestMessage2.message}`

export const mockInvalidFormattedMessage = `Some random text without proper formatting
that doesn't match the expected structure`

// ============================================================================
// Mock API Responses (as they would come from OpenAI)
// ============================================================================

export const mockOpenAIAPIResponse = {
    choices: [
        {
            finish_reason: 'stop',
            index: 0,
            message: {
                content: mockChatCompletionResponse.content,
                role: 'assistant',
            },
        },
    ],
    created: 1234567890,
    id: 'chatcmpl-mock123',
    model: 'gpt-4o-mini',
    object: 'chat.completion',
    usage: {
        completion_tokens: 25,
        prompt_tokens: 150,
        total_tokens: 175,
    },
}

export const mockOpenAIAPIEmptyResponse = {
    choices: [],
    created: 1234567890,
    id: 'chatcmpl-mock456',
    model: 'gpt-4o-mini',
    object: 'chat.completion',
}

// ============================================================================
// Mock Error Messages
// ============================================================================

export const mockErrorMessages = {
    authError: 'OPENAI_API_KEY environment variable is not set',
    configError: 'Failed to load instructions file: invalid/path.txt',
    invalidOptions: 'Messages array cannot be empty',
    networkError: 'Failed to send message to OpenAI',
    parseError: 'Failed to parse formatted message',
}
