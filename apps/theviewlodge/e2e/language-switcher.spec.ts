import { expect, test } from '@playwright/test'

test.describe('Language Switcher', () => {
    test('switches language from English to French', async ({ page }) => {
        await page.goto('/')

        // Click on French language button
        const frenchButton = page.getByRole('link', { name: /Français/i })
        await expect(frenchButton).toBeVisible()
        await frenchButton.click()

        // Wait for navigation
        await page.waitForURL(/\/fr/)

        // Verify we're on French version by checking URL
        expect(page.url()).toContain('/fr')

        // Verify the page loaded successfully
        await expect(page).toHaveTitle(/.+/)
    })

    test('switches language from French to English', async ({ page }) => {
        await page.goto('/fr')

        // Click on English language button
        const englishButton = page.getByRole('link', { name: /English/i })
        await expect(englishButton).toBeVisible()
        await englishButton.click()

        // Wait for navigation to complete
        await page.waitForLoadState('networkidle')

        // Verify we're on English version (no language prefix in pathname)
        const url = new URL(page.url())
        expect(url.pathname).not.toContain('/fr')
        expect(url.pathname).not.toContain('/de')
        expect(url.pathname).not.toContain('/nl')
        expect(url.pathname).not.toContain('/es')
        // Should be at root or a page without language prefix
        expect(
            url.pathname === '/' || !url.pathname.match(/^\/(fr|de|nl|es)/)
        ).toBeTruthy()
    })

    test('maintains page context when switching languages', async ({
        page,
    }) => {
        await page.goto('/vouchers')

        // Click on German language button
        const germanButton = page.getByRole('link', { name: /Deutsch/i })
        await expect(germanButton).toBeVisible()
        await germanButton.click()

        // Wait for navigation
        await page.waitForURL(/\/de\/vouchers/)

        // Verify we're on German vouchers page
        expect(page.url()).toContain('/de/vouchers')
    })

    test('all supported languages are visible', async ({ page }) => {
        await page.goto('/')

        // Verify all language options are visible
        await expect(page.getByRole('link', { name: /English/i })).toBeVisible()
        await expect(
            page.getByRole('link', { name: /Français/i })
        ).toBeVisible()
        await expect(
            page.getByRole('link', { name: /Nederlands/i })
        ).toBeVisible()
        await expect(page.getByRole('link', { name: /Deutsch/i })).toBeVisible()
        await expect(page.getByRole('link', { name: /Español/i })).toBeVisible()
    })
})
