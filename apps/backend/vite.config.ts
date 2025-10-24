import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
    build: {
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            fileName: 'main',
            formats: ['es'],
        },
        outDir: 'dist',
        rollupOptions: {
            external: (id) => {
                return (
                    id.startsWith('node:') ||
                    id.includes('node_modules') ||
                    id.startsWith('@monorepo/') ||
                    (!id.startsWith('.') && !id.startsWith('/'))
                )
            },
        },

        sourcemap: true,
        ssr: true,
    },
    resolve: {
        // Use development condition for dev/test, production uses default
        conditions:
            mode === 'production'
                ? ['import', 'module', 'default']
                : ['development', 'import', 'module', 'default'],
    },
}))
