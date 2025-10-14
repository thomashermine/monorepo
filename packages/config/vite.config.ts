import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        emptyOutDir: true,
        lib: {
            entry: {
                'config/index': resolve(__dirname, 'src/config/index.ts'),
                'eslint/index': resolve(__dirname, 'src/eslint/index.ts'),
            },
            formats: ['es'],
        },
        outDir: 'dist',
        rollupOptions: {
            external: (id) => {
                return (
                    id.includes('node_modules') ||
                    id.startsWith('node:') ||
                    (!id.startsWith('.') && !id.startsWith('/'))
                )
            },
        },
        sourcemap: true,
    },
    plugins: [
        dts({
            exclude: ['**/*.test.ts'],
            include: ['src/**/*'],
            outDir: 'dist',
        }),
    ],
})
