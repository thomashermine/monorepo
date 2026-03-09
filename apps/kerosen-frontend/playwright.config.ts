import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 3000
const url = `http://localhost:${port}`

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: url,
        trace: 'on-first-retry',
        screenshot: 'on',
        video: 'on',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    webServer: {
        command: 'pnpm run start',
        url: url,
        reuseExistingServer: !process.env.CI,
    },
})
