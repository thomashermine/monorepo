import { expect, test } from '@playwright/test'

test.describe('Prices Page', () => {
    test('has correct title', async ({ page }) => {
        await page.goto('/prices')

        // Expect title to contain "Rates" or "Availability" and "The View"
        await expect(page).toHaveTitle(/Rates.*The View/)
    })

    test('displays pricing hero section', async ({ page }) => {
        await page.goto('/prices')

        // Check for main heading (uses "Rates" not "Pricing")
        await expect(
            page.getByRole('heading', { name: /Rates.*Availability/i }).first()
        ).toBeVisible()

        // Check for dynamic pricing description (text mentions "demand-based pricing")
        await expect(
            page.getByText(/demand-based pricing/i).first()
        ).toBeVisible()
    })

    test('displays pricing factors section', async ({ page }) => {
        await page.goto('/prices')

        // Check for factors heading (uses "Rates" not "Pricing")
        await expect(
            page
                .getByRole('heading', { name: /What Influences Our Rates/i })
                .first()
        ).toBeVisible()

        // Check for key factors
        await expect(page.getByText(/Season.*Weather/i).first()).toBeVisible()
        await expect(page.getByText(/Day of the Week/i).first()).toBeVisible()
        await expect(page.getByText(/Current Demand/i).first()).toBeVisible()
    })

    test('has booking widget or calendar', async ({ page }) => {
        await page.goto('/prices')

        // Check that there's some kind of booking element
        // This could be a calendar, iframe, or booking button
        const bookingElement =
            (await page.locator('iframe').count()) > 0 ||
            (await page.getByRole('link', { name: /book/i }).count()) > 0 ||
            (await page.locator('[data-testid="booking-widget"]').count()) > 0

        expect(bookingElement).toBeTruthy()
    })
})
