import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            '@monorepo/helpers': path.resolve(
                __dirname,
                '../../packages/helpers/src'
            ),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        exclude: ['e2e/**/*.test.ts'], // Ran by playwright
        include: ['src/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.test.ts'],
        },
    },
})
