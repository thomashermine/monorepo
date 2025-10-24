import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: {
                'hostex/index': resolve(__dirname, 'src/hostex/index.ts'),
                'hostex/types': resolve(__dirname, 'src/hostex/types.ts'),
                'hostex/mocks': resolve(__dirname, 'src/hostex/mocks.ts'),
                'openai/index': resolve(__dirname, 'src/openai/index.ts'),
                'openai/types': resolve(__dirname, 'src/openai/types.ts'),
                'openai/mocks': resolve(__dirname, 'src/openai/mocks.ts'),
                'odoo/index': resolve(__dirname, 'src/odoo/index.ts'),
                'odoo/types': resolve(__dirname, 'src/odoo/types.ts'),
                'odoo/mocks': resolve(__dirname, 'src/odoo/mocks.ts'),
                'joke/index': resolve(__dirname, 'src/joke/index.ts'),
                'date/index': resolve(__dirname, 'src/date/index.ts'),
                'calendar/index': resolve(__dirname, 'src/calendar/index.ts'),
            },
            formats: ['es'],
        },
        rollupOptions: {
            external: ['fs/promises', 'path'],
        },
        emptyOutDir: true,
        outDir: 'dist',
        sourcemap: true,
    },
    plugins: [
        dts({
            outDir: 'dist',
            include: ['src/**/*'],
            exclude: ['**/*.test.ts'],
        }),
    ],
})
