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
                'joke/index': resolve(__dirname, 'src/joke/index.ts'),
                'date/index': resolve(__dirname, 'src/date/index.ts'),
                'calendar/index': resolve(__dirname, 'src/calendar/index.ts'),
            },
            formats: ['es'],
        },
        outDir: 'dist',
        sourcemap: true,
        emptyOutDir: true,
    },
    plugins: [
        dts({
            outDir: 'dist',
            include: ['src/**/*'],
            exclude: ['**/*.test.ts'],
        }),
    ],
})
