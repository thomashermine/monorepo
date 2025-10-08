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
        include: ['e2e/**/*.test.ts'],
        testTimeout: 30000, // 30 seconds for e2e tests (network requests)
        hookTimeout: 30000,
        teardownTimeout: 10000,
        reporters: process.env.CI ? ['verbose', 'json', 'junit'] : ['verbose'],
        outputFile: {
            json: './test-results/e2e-results.json',
            junit: './test-results/e2e-results.xml',
        },
    },
})
