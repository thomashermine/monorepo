import { expect, test } from '@playwright/test'

test.describe('Cross-page Navigation', () => {
    test('can navigate from home to vouchers', async ({ page }) => {
        await page.goto('/')

        // Click on Gift Vouchers link
        await page
            .getByRole('link', { name: /Gift Vouchers/i })
            .first()
            .click()

        // Verify we're on the vouchers page
        await expect(page).toHaveURL(/\/vouchers/)
        await expect(
            page.getByRole('heading', { name: /Gift.*Vouchers/i }).first()
        ).toBeVisible()
    })

    test('can navigate from home to prices', async ({ page }) => {
        await page.goto('/')

        // Click on Rates link
        await page.getByRole('link', { name: 'Rates' }).first().click()

        // Verify we're on the prices page
        await expect(page).toHaveURL(/\/prices/)
        await expect(
            page.getByRole('heading', { name: /Rates.*Availability/i }).first()
        ).toBeVisible()
    })

    test('can navigate from home to terms', async ({ page }) => {
        await page.goto('/')

        // Click on Terms link
        await page.getByRole('link', { name: /Terms/i }).first().click()

        // Verify we're on the terms page
        await expect(page).toHaveURL(/\/terms/)
        await expect(
            page.getByRole('heading', { name: 'Terms & Conditions' }).first()
        ).toBeVisible()
    })

    test('can navigate back to home from other pages', async ({ page }) => {
        await page.goto('/vouchers')

        // Click on Home link
        await page
            .getByRole('link', { name: /^Home$/i })
            .first()
            .click()

        // Verify we're on the home page (fix regex to match full URL)
        await expect(page).toHaveURL('/')
        await expect(
            page.getByRole('heading', { name: /Stunning views/i }).first()
        ).toBeVisible()
    })
})
