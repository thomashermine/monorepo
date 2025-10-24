import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

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
                return id.startsWith('node:') || id.includes('node_modules')
            },
        },

        sourcemap: true,
        ssr: true,
    },
    plugins: [tsconfigPaths()],
    resolve: {
        // Use development condition for dev/test, production uses default
        conditions:
            mode === 'production'
                ? ['import', 'module', 'default']
                : ['development', 'import', 'module', 'default'],
    },
}))
