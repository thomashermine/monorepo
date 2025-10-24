import { expect, test } from '@playwright/test'

test.describe('Vouchers Page', () => {
    test('has correct title', async ({ page }) => {
        await page.goto('/vouchers')

        // Expect title to contain "Gift Vouchers" and "The View"
        await expect(page).toHaveTitle(/Gift Vouchers.*The View/)
    })

    test('displays voucher hero section', async ({ page }) => {
        await page.goto('/vouchers')

        // Check for main heading
        await expect(
            page.getByRole('heading', { name: /Gift.*Vouchers/i }).first()
        ).toBeVisible()

        // Check for subtitle about gift
        await expect(
            page.getByText('Give the Gift of Relaxation').first()
        ).toBeVisible()
    })

    test('displays voucher amount options', async ({ page }) => {
        await page.goto('/vouchers')

        // Check that voucher amounts are visible (amounts are displayed as "49€", "99€", etc.)
        await expect(page.getByText('49€').first()).toBeVisible()
        await expect(page.getByText('99€').first()).toBeVisible()
        await expect(page.getByText('199€').first()).toBeVisible()
        await expect(page.getByText('299€').first()).toBeVisible()
        await expect(page.getByText('499€').first()).toBeVisible()
    })

    test('displays how it works section', async ({ page }) => {
        await page.goto('/vouchers')

        // Check for "How it works" heading
        await expect(
            page.getByRole('heading', { name: /How it works/i }).first()
        ).toBeVisible()

        // Check for key features
        await expect(page.getByText(/Instant delivery/i).first()).toBeVisible()
        await expect(page.getByText(/Valid 12 months/i).first()).toBeVisible()
    })

    test('has purchase voucher buttons', async ({ page }) => {
        await page.goto('/vouchers')

        // Check that purchase buttons exist (uses "Buy" not "Purchase")
        const purchaseButtons = page.getByRole('link', {
            name: /Buy.*Voucher/i,
        })
        await expect(purchaseButtons.first()).toBeVisible()
    })
})
