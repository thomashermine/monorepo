import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const dirname =
    typeof __dirname !== 'undefined'
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    plugins: [
        tsconfigPaths(),
        storybookTest({
            configDir: path.join(dirname, '.storybook'),
        }),
    ],
    test: {
        name: 'storybook',
        browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
        },
        setupFiles: ['.storybook/vitest.setup.ts'],
    },
    resolve: {
        conditions: ['development', 'import', 'module', 'browser', 'default'],
        alias: {
            '@': path.resolve(dirname, './app'),
        },
    },
    define: {
        'process.env': {},
        'process.platform': JSON.stringify('browser'),
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            'react/jsx-dev-runtime',
            '@mdx-js/react',
            'markdown-to-jsx',
            'effect',
        ],
    },
})
