import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
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
})
