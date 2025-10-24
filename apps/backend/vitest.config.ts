import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        conditions: ['development', 'import', 'module', 'default'],
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
