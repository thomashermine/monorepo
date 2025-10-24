# OpenAI Service

An Effect-based service for interacting with OpenAI's API with built-in error handling, configuration management, and context support.

## Features

- 🎯 **Effect-based architecture** - Fully integrated with Effect for composable error handling
- 🔐 **Secure configuration** - Environment-based API key management
- 📝 **Context support** - Easily add instructions and examples to conversations
- 🧪 **Fully tested** - Comprehensive test suite with mocks
- 🔧 **Type-safe** - Full TypeScript support with detailed type definitions
- 🎨 **Flexible** - Support for both simple messages and advanced chat completions

## Installation

```bash
npm install @monorepo/helpers
```

## Environment Variables

```bash
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4o-mini  # Optional, defaults to gpt-4o-mini
```

## Basic Usage

### Simple Message

```typescript
import { Effect } from 'effect'
import { OpenAIService, OpenAIServiceLive } from '@monorepo/helpers/openai'

const program = Effect.gen(function* () {
    const service = yield* OpenAIService
    const response = yield* service.sendMessage('Hello, how can I help?')
    console.log(response)
})

Effect.runPromise(program.pipe(Effect.provide(OpenAIServiceLive)))
```

### With Context

```typescript
import { Effect } from 'effect'
import { OpenAIService, OpenAIServiceLive } from '@monorepo/helpers/openai'

const program = Effect.gen(function* () {
    const service = yield* OpenAIService

    const context = {
        instructions: 'You are a helpful property rental assistant.',
        examples: `
        [GUEST] What time is check-in?
        [HOST] Check-in is from 3 PM onwards!
        `,
    }

    const response = yield* service.sendMessage(
        'I need help with my booking',
        context
    )

    console.log(response)
})

Effect.runPromise(program.pipe(Effect.provide(OpenAIServiceLive)))
```

### Advanced Chat Completion

```typescript
import { Effect } from 'effect'
import { OpenAIService, OpenAIServiceLive } from '@monorepo/helpers/openai'

const program = Effect.gen(function* () {
    const service = yield* OpenAIService

    const response = yield* service.chat({
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'What is the capital of France?' },
        ],
        temperature: 0.7,
        maxTokens: 150,
    })

    console.log(response.content)
    console.log('Tokens used:', response.usage?.totalTokens)
})

Effect.runPromise(program.pipe(Effect.provide(OpenAIServiceLive)))
```

## Custom Configuration

You can create a custom service instance with specific file paths:

```typescript
import { makeOpenAIServiceLive } from '@monorepo/helpers/openai'

const CustomOpenAIService = makeOpenAIServiceLive({
    instructionsPath: 'src/custom-instructions.txt',
    examplesPath: 'src/custom-examples.txt',
})

const program = Effect.gen(function* () {
    const service = yield* OpenAIService
    const response = yield* service.sendMessage('Hello!')
    return response
})

Effect.runPromise(program.pipe(Effect.provide(CustomOpenAIService)))
```

## Helper Functions

### Format Simple Message

```typescript
import { formatSimpleMessage } from '@monorepo/helpers/openai'

const formatted = formatSimpleMessage(
    'John Doe',
    'AirBnb',
    'I need help with parking'
)
// Output:
// GUEST NAME: John Doe
// CHANNEL: AirBnb
// MESSAGE: I need help with parking
```

### Parse Formatted Message

```typescript
import { Effect } from 'effect'
import { parseFormattedMessage } from '@monorepo/helpers/openai'

const formatted = `GUEST NAME: John Doe
CHANNEL: AirBnb
MESSAGE: I need help with parking`

const program = parseFormattedMessage(formatted)
const parsed = await Effect.runPromise(program)

console.log(parsed.guestName) // 'John Doe'
console.log(parsed.channel) // 'AirBnb'
console.log(parsed.message) // 'I need help with parking'
```

### Validate Chat Options

```typescript
import { Effect } from 'effect'
import { validateChatOptions } from '@monorepo/helpers/openai'

const program = validateChatOptions({
    messages: [{ role: 'user', content: 'Hello' }],
    temperature: 0.7,
    maxTokens: 100,
})

await Effect.runPromise(program) // Validates and throws if invalid
```

## Error Handling

The service provides detailed error types:

- `OpenAIError` - General OpenAI errors
- `OpenAIAuthError` - Authentication failures
- `OpenAINetworkError` - Network-related errors
- `OpenAIConfigError` - Configuration errors

```typescript
import { Effect } from 'effect'
import {
    OpenAIService,
    OpenAIError,
    OpenAINetworkError,
} from '@monorepo/helpers/openai'

const program = Effect.gen(function* () {
    const service = yield* OpenAIService
    const response = yield* service.sendMessage('Hello')
    return response
}).pipe(
    Effect.catchTag('OpenAINetworkError', (error) =>
        Effect.succeed(`Network error: ${error.message}`)
    ),
    Effect.catchTag('OpenAIError', (error) =>
        Effect.succeed(`General error: ${error.message}`)
    )
)
```

## Type Definitions

### ChatMessage

```typescript
interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}
```

### ConversationContext

```typescript
interface ConversationContext {
    instructions?: string
    examples?: string
}
```

### ChatCompletionOptions

```typescript
interface ChatCompletionOptions {
    messages: ChatMessage[]
    model?: string
    maxTokens?: number
    temperature?: number
}
```

### ChatCompletionResponse

```typescript
interface ChatCompletionResponse {
    content: string
    model: string
    usage?: {
        promptTokens: number
        completionTokens: number
        totalTokens: number
    }
}
```

## Testing

The package includes comprehensive mocks for testing:

```typescript
import { describe, it, expect } from 'vitest'
import {
    mockOpenAIConfig,
    mockContext,
    mockChatCompletionResponse,
} from '@monorepo/helpers/openai/mocks'

describe('My Test', () => {
    it('should use mock config', () => {
        expect(mockOpenAIConfig.apiKey).toContain('sk-')
    })
})
```

## Examples

### Property Rental Assistant

```typescript
import { Effect } from 'effect'
import {
    OpenAIService,
    OpenAIServiceLive,
    formatSimpleMessage,
} from '@monorepo/helpers/openai'

const program = Effect.gen(function* () {
    const service = yield* OpenAIService

    const message = formatSimpleMessage(
        'Caroline',
        'AirBnb',
        'On arrive pas à se garer, sa glisse de trop'
    )

    const response = yield* service.sendMessage(message, {
        instructions:
            'You are a property rental assistant. Be helpful and professional.',
    })

    return response
})

const response = await Effect.runPromise(
    program.pipe(Effect.provide(OpenAIServiceLive))
)

console.log('AI Response:', response)
```

## Best Practices

1. **Always provide context** - Include instructions and examples for better responses
2. **Handle errors appropriately** - Use Effect's error handling capabilities
3. **Use type-safe APIs** - Leverage TypeScript for compile-time safety
4. **Test with mocks** - Use provided mocks for unit testing
5. **Monitor token usage** - Track usage from chat completion responses

## License

MIT
