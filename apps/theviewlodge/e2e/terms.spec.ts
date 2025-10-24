import { expect, test } from '@playwright/test'

test.describe('Terms Page', () => {
    test('has correct title', async ({ page }) => {
        await page.goto('/terms')

        // Expect title to contain "Terms" and "The View"
        await expect(page).toHaveTitle(/Terms.*The View/)
    })

    test('displays terms heading', async ({ page }) => {
        await page.goto('/terms')

        // Check for main heading
        await expect(
            page.getByRole('heading', { name: 'Terms & Conditions' }).first()
        ).toBeVisible()
    })

    test('displays operator information', async ({ page }) => {
        await page.goto('/terms')

        // Check for operator information
        await expect(
            page.getByText(/Crafted Signals SRL/i).first()
        ).toBeVisible()
        await expect(
            page.getByText(/Saint-Gilles, Belgium/i).first()
        ).toBeVisible()
    })

    test('displays cancellation policy', async ({ page }) => {
        await page.goto('/terms')

        // Check for cancellation policy section
        await expect(
            page.getByRole('heading', { name: /Cancellation Policy/i }).first()
        ).toBeVisible()

        // Check for refund information
        await expect(page.getByText(/14 days/i).first()).toBeVisible()
        await expect(page.getByText(/Full refund/i).first()).toBeVisible()
    })

    test('displays check-in and check-out times', async ({ page }) => {
        await page.goto('/terms')

        // Check for check-in/check-out section
        await expect(
            page
                .getByRole('heading', { name: /Check-in and Check-out/i })
                .first()
        ).toBeVisible()

        // Check for times
        await expect(page.getByText(/4:00 PM/i).first()).toBeVisible()
        await expect(page.getByText(/12:00 PM/i).first()).toBeVisible()
    })

    test('displays house rules', async ({ page }) => {
        await page.goto('/terms')

        // Check for house rules section
        await expect(
            page.getByRole('heading', { name: /House Rules/i }).first()
        ).toBeVisible()

        // Check for key rules (matching actual translation text)
        await expect(page.getByText(/Maximum 2 adults/i).first()).toBeVisible()
        await expect(page.getByText(/Pets of any kind/i).first()).toBeVisible()
    })
})
