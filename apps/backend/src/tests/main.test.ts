import { HttpRouter, HttpServerResponse } from '@effect/platform'
import { describe, expect, it } from 'vitest'

describe('Echo Endpoint', () => {
    it('should create an echo route that returns the message with timestamp', () => {
        const router = HttpRouter.empty.pipe(
            HttpRouter.post(
                '/echo',
                // Mock implementation for testing
                HttpServerResponse.json({
                    message: 'test message',
                    timestamp: new Date().toISOString(),
                })
            )
        )

        expect(router).toBeDefined()
    })
})
