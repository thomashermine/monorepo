import { describe, expect, it } from 'vitest'

import { appName } from './index'

describe('appName', () => {
    it('should return "monorepo"', () => {
        expect(appName).toBe('monorepo')
    })

    it('should be a string', () => {
        expect(typeof appName).toBe('string')
    })
})

