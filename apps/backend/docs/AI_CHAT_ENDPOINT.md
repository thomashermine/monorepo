# AI Chat Endpoint

A simple REST API endpoint that allows users to send messages to the OpenAI service and receive AI-generated responses.

## Endpoint

```
GET /ai/chat
```

## Query Parameters

| Parameter | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| message   | string | Yes      | The message to send to the AI |

## Response Format

### Success Response (200 OK)

```json
{
    "message": "Your original message",
    "response": "AI-generated response",
    "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response (400 Bad Request)

```json
{
    "error": "Bad Request",
    "message": "Missing required query parameter: message"
}
```

## Examples

### Example 1: Basic Usage

**Request:**

```bash
curl "http://localhost:3000/ai/chat?message=How%20do%20I%20check%20in?"
```

**Response:**

```json
{
    "message": "How do I check in?",
    "response": "Check-in is at 3 PM. You'll receive detailed instructions with your check-in code via email 24 hours before your arrival.",
    "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Example 2: Parking Information

**Request:**

```bash
curl "http://localhost:3000/ai/chat?message=Where%20can%20I%20park?"
```

**Response:**

```json
{
    "message": "Where can I park?",
    "response": "Free parking is available on the street in front of the property. There's also a public parking lot 2 blocks away.",
    "timestamp": "2024-01-15T10:35:00.000Z"
}
```

### Example 3: Using with JavaScript/TypeScript

```typescript
async function askAI(message: string) {
    const url = `http://localhost:3000/ai/chat?message=${encodeURIComponent(message)}`

    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
        console.log('AI Response:', data.response)
    } else {
        console.error('Error:', data.error)
    }

    return data
}

// Usage
await askAI('What time is checkout?')
```

### Example 4: Using with Python

```python
import requests
import urllib.parse

def ask_ai(message):
    encoded_message = urllib.parse.quote(message)
    url = f'http://localhost:3000/ai/chat?message={encoded_message}'

    response = requests.get(url)
    data = response.json()

    if response.status_code == 200:
        print('AI Response:', data['response'])
    else:
        print('Error:', data['error'])

    return data

# Usage
ask_ai('How can I get in the hot tub?')
```

## Context and Instructions

The AI responses are powered by the OpenAI service which uses:

- **Instructions**: Loaded from `src/llm-instructions.txt` - Contains property FAQs and guest guides
- **Examples**: Loaded from `src/llm-messages.txt` - Contains historical guest conversations for context

This ensures the AI provides contextual, accurate responses based on your property's specific information and past guest interactions.

## Implementation Details

The endpoint is implemented in `apps/backend/src/server/ai-chat.ts` and:

1. Extracts the `message` query parameter from the request URL
2. Validates that the message parameter is provided
3. Calls the OpenAI service with the message
4. Returns the AI response along with the original message and timestamp

## Error Handling

The endpoint includes error handling for:

- Missing `message` query parameter (400 Bad Request)
- OpenAI service errors (500 Internal Server Error) - handled by global error handler
- Network errors - handled by global error handler

## Dependencies

This endpoint requires:

- OpenAI API key configured in `.env` file
- `llm-instructions.txt` and `llm-messages.txt` files in the `src/` directory
- OpenAI service properly configured (see [OPENAI_SERVICE.md](./OPENAI_SERVICE.md))

## Testing

You can test the endpoint using:

```bash
# Using curl
curl "http://localhost:3000/ai/chat?message=Hello"

# Using httpie (if installed)
http GET "http://localhost:3000/ai/chat?message=Hello"

# Using your browser
# Just navigate to: http://localhost:3000/ai/chat?message=Hello
```

## Production Considerations

For production use, consider:

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **Authentication**: Add authentication if needed
3. **Input Validation**: Add more robust input validation and sanitization
4. **Logging**: Log requests and responses for monitoring
5. **Caching**: Cache common responses to reduce API costs
6. **Message Length Limits**: Add maximum message length validation
