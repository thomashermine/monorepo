import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        conditions: ['development', 'import', 'module', 'default'],
    },
    test: {
        coverage: {
            include: ['src/**/*.test.ts'],
            provider: 'v8',
        },
        environment: 'node',
        exclude: ['e2e/**/*.test.ts'],
        globals: true,
        // Ran by playwright
        include: ['src/**/*.test.ts'],
    },
})
