# HOSTEX Message Export Endpoint

## Overview

This endpoint exports all messages received and sent via HOSTEX as a continuous TXT file formatted for LLM training purposes.

## Endpoint

```
GET /messages/export/llm-training.txt
```

## Response

- **Content-Type**: `text/plain; charset=utf-8`
- **Content-Disposition**: `attachment; filename="hostex-messages-llm-training.txt"`

## Output Format

The exported file follows this structure:

```
====================================================================================================
                                 HOSTEX MESSAGE EXPORT FOR LLM TRAINING
                                                Generated: 2024-01-15T10:30:00.000Z
                                                       Total Conversations: 42
                                                               Total Messages: 387
====================================================================================================


----------------------------------------------------------------------------------------------------
CONVERSATION ID: conv-123 | Guest: John Doe | Property: prop-456
Reservation: RES-ABC123
Channel: airbnb
Last Message: 2024-01-15T09:30:00.000Z
Total Messages: 5
----------------------------------------------------------------------------------------------------

[GUEST] (2024-01-14T14:20:00.000Z)
  Hi, I have a question about check-in time.

[HOST] (2024-01-14T14:35:00.000Z)
  Hello! Check-in is at 3 PM. Is there anything specific you'd like to know?

[GUEST] (2024-01-14T15:10:00.000Z)
  Can I check in earlier if needed?
  [IMAGE]: https://example.com/image.jpg

[HOST] (2024-01-14T15:30:00.000Z)
  Yes, early check-in is available for an additional fee. Let me check the availability for your
  dates.


----------------------------------------------------------------------------------------------------
CONVERSATION ID: conv-789 | Guest: Jane Smith | Property: prop-012
...
====================================================================================================
                                              END OF MESSAGE EXPORT
====================================================================================================
```

## Features

### Pagination Handling
- Automatically fetches all conversations across multiple pages
- Default page size: 100 conversations per page
- Continues until all conversations are retrieved

### Message Sorting
- Messages within each conversation are sorted chronologically by `sentAt` timestamp
- Ensures proper conversation flow for training purposes

### Content Formatting
- Lines are wrapped at 120 characters for readability
- Multi-line messages are preserved with proper indentation
- Image messages are marked with `[IMAGE]:` followed by the URL

### Metadata Preservation
- Conversation ID, guest name, property ID
- Optional: Reservation code, channel type
- Timestamp for last message
- Message count per conversation

### Character Encoding
- UTF-8 encoding ensures proper handling of international characters
- Emojis and special characters are preserved

## Use Cases

1. **LLM Training**: Fine-tune language models on actual host-guest conversations
2. **Analytics**: Analyze conversation patterns and common questions
3. **Quality Assurance**: Review communication style and response times
4. **Archive**: Create backups of all message history

## Performance Considerations

- **Response Time**: Depends on the number of conversations (typically < 60 seconds)
- **Memory Usage**: All conversations are loaded into memory before formatting
- **API Calls**: Makes N+1 API calls (1 for conversations list + 1 per conversation for messages)

## Error Handling

The endpoint inherits the global error handling from the main application:
- Network errors from HOSTEX API are caught and returned as 500 errors
- Authentication errors are handled by the HostexService layer
- Timeout: 30 seconds per API call (configurable via `HOSTEX_TIMEOUT` env var)

## Example Usage

### cURL
```bash
curl -O http://localhost:3000/messages/export/llm-training.txt
```

### Browser
Simply navigate to:
```
http://localhost:3000/messages/export/llm-training.txt
```

The file will be automatically downloaded.

### Using with LLM Training Tools

```bash
# Download the export
wget http://localhost:3000/messages/export/llm-training.txt

# Use with your favorite LLM training tool
python train_model.py --data hostex-messages-llm-training.txt
```

## Related Endpoints

- `GET /bookings/next` - Get upcoming reservations
- `GET /bookings/calendar/full-day.ics` - Full-day booking events as ICS
- `GET /bookings/calendar/checkinout.ics` - Check-in/out events as ICS

## Testing

E2E tests for this endpoint are located in `apps/backend/e2e/api.test.ts` and verify:
- Correct content type and headers
- Proper file structure (header, conversations, footer)
- Message formatting with sender labels and timestamps
- Image message handling
- Chronological ordering of messages
- UTF-8 encoding
- Response time constraints
