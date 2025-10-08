import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'

import { getRandomJoke } from './index'

describe('getRandomJoke', () => {
    it('should return a string', async () => {
        const joke = await Effect.runPromise(getRandomJoke())
        expect(typeof joke).toBe('string')
    })

    it('should return different jokes on multiple calls', async () => {
        const jokes = await Effect.runPromise(
            Effect.all(
                Array.from({ length: 20 }, () => getRandomJoke()),
                { concurrency: 'unbounded' }
            )
        )

        const uniqueJokes = new Set(jokes)
        // With 20 calls, we should get at least 2 different jokes
        expect(uniqueJokes.size).toBeGreaterThan(1)
    })
})
