# OpenAI Service

The OpenAI service provides integration with OpenAI's API to generate intelligent responses based on your property's instructions and historical guest conversations.

## Setup

### 1. Install Dependencies

The OpenAI SDK is already installed:

```bash
pnpm add openai
```

### 2. Configure Environment Variables

Add the following environment variables to your `.env` file:

```env
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini  # Optional, defaults to gpt-4o-mini
```

### 3. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

## How It Works

The OpenAI service automatically loads two context files on startup:

- **`llm-instructions.txt`**: Contains your property's FAQ and guest guide
- **`llm-messages.txt`**: Contains historical guest conversations for context

When a message is sent to OpenAI, it receives:

1. System instructions from `llm-instructions.txt`
2. Historical conversation examples from `llm-messages.txt`
3. The user's question

This allows the AI to provide contextual, accurate responses based on your property's specific information and past guest interactions.

## Usage

### Startup Test

On application startup, the service automatically tests the OpenAI integration:

```typescript
const openaiService = yield * OpenAIService
const response =
    yield * openaiService.sendMessage('How can I get in the hot tub?')
```

### In Your Code

```typescript
import { OpenAIService } from './services/openai.service'

// In an Effect.gen function
const openaiService = yield * OpenAIService
const response = yield * openaiService.sendMessage('Your question here')
```

## Model Options

The service defaults to `gpt-4o-mini` which is:

- Fast
- Cost-effective
- Suitable for most customer service queries

You can change the model by setting the `OPENAI_MODEL` environment variable to:

- `gpt-4o` - More capable, higher cost
- `gpt-4o-mini` - Faster, lower cost (default)
- `gpt-3.5-turbo` - Fastest, lowest cost

## Error Handling

The service includes proper error handling for:

- Missing API key
- Failed API requests
- Missing instruction/message files

Errors are wrapped in `OpenAIServiceError` with detailed messages.

## Architecture

The service follows the Effect pattern used throughout the application:

- **Service Definition**: `OpenAIService` - Defines the service interface
- **Live Implementation**: `OpenAIServiceLive` - Provides the actual implementation
- **Error Type**: `OpenAIServiceError` - Custom error type for the service

This ensures type safety and composability with other Effect-based services in the application.
