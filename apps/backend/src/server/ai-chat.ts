import {
    HttpRouter,
    HttpServerRequest,
    HttpServerResponse,
} from '@effect/platform'
import { OpenAIService } from '@monorepo/helpers/openai'
import { Effect } from 'effect'

export const aiChatRoute = HttpRouter.empty.pipe(
    HttpRouter.get(
        '/ai/chat',
        Effect.gen(function* () {
            // Get the request to access query parameters
            const request = yield* HttpServerRequest.HttpServerRequest

            // Extract the 'message' query parameter
            const url = new URL(request.url, `http://${request.headers.host}`)
            const message = url.searchParams.get('message')

            // Validate that message parameter exists
            if (!message) {
                return yield* HttpServerResponse.json(
                    {
                        error: 'Bad Request',
                        message: 'Missing required query parameter: message',
                    },
                    { status: 400 }
                )
            }

            // Get the OpenAI service
            const openaiService = yield* OpenAIService

            // Send the message to OpenAI and get response
            const response = yield* openaiService.sendMessage(message)

            // Return the AI response
            return yield* HttpServerResponse.json({
                message: message,
                response: response,
                timestamp: new Date().toISOString(),
            })
        })
    )
)
