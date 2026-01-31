import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
    test('has correct title', async ({ page }) => {
        await page.goto('/')

        // Expect title to contain "The View" and "Wellness" or "Belgian Ardennes"
        await expect(page).toHaveTitle(
            'The View - Stunning views, Endless Relaxation. Wellness Lodge in Stoumont, Belgium'
        )
    })

    test('displays hero section', async ({ page }) => {
        await page.goto('/')

        // Check that the main hero heading is visible
        await expect(
            page.getByRole('heading', { name: /Stunning views/i }).first()
        ).toBeVisible()

        // Check that the secondary heading is visible
        await expect(
            page.getByRole('heading', { name: /Endless Relaxation/i }).first()
        ).toBeVisible()

        // Check that the subtitle about Belgian Ardennes is visible
        await expect(
            page
                .getByText(
                    'Forest Wellness Lodge in the Heart of the Belgian Ardennes.'
                )
                .first()
        ).toBeVisible()

        // Check that "Book your stay" CTA button exists
        await expect(
            page.getByRole('link', { name: /Book your stay/i }).first()
        ).toBeVisible()
    })

    test('has correct navigation links', async ({ page }) => {
        await page.goto('/')

        // Check Book Now link
        const bookNowLinks = page.getByRole('link', { name: /Book Now/i })
        await expect(bookNowLinks.first()).toBeVisible()

        // Check Gift Vouchers link
        await expect(
            page.getByRole('link', { name: /Gift Vouchers/i }).first()
        ).toBeVisible()

        // Check Rates link
        await expect(
            page.getByRole('link', { name: 'Rates' }).first()
        ).toBeVisible()

        // Check Contact link
        await expect(
            page.getByRole('link', { name: 'Contact' }).first()
        ).toBeVisible()

        // Check Terms link
        await expect(
            page.getByRole('link', { name: 'Terms' }).first()
        ).toBeVisible()
    })

    test('displays amenities section', async ({ page }) => {
        await page.goto('/')

        // Check for amenities heading
        await expect(
            page.getByRole('heading', { name: /Wellness Amenities/i }).first()
        ).toBeVisible()

        // Check for key amenities (matching actual translation keys)
        await expect(page.getByText('Private Sauna').first()).toBeVisible()
        await expect(page.getByText('Nordic Bath').first()).toBeVisible()
        await expect(page.getByText('Hot Tub').first()).toBeVisible()
    })

    test('displays testimonials section', async ({ page }) => {
        await page.goto('/#testimonials')
        // Scroll 100px down for the animation to start
        await page.evaluate(() => {
            window.scrollBy(0, 100)
        })

        // Check that at least one testimonial is visible
        await expect(
            page.getByText(/Beautiful house with fantastic views!/i).first()
        ).toBeVisible()
    })

    test('displays FAQ section', async ({ page }) => {
        await page.goto('/#faq')

        // Check for FAQ heading
        await expect(
            page
                .getByRole('heading', { name: /Frequently Asked Questions/i })
                .first()
        ).toBeVisible()

        // Check that at least one FAQ item is visible
        const firstFAQ = page
            .getByRole('heading', {
                name: /What amenities does The View offer/i,
            })
            .first()
        await expect(firstFAQ.first()).toBeVisible()
    })

    test('displays contact information in footer', async ({ page }) => {
        await page.goto('/')

        // Check for email
        await expect(
            page.getByText(/hello@theviewlodge\.be/i).first()
        ).toBeVisible()

        // Check for phone number
        await expect(page.getByText(/\+32 491 50 54 42/i).first()).toBeVisible()
    })

    test('displays location section', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByText('Targnon').first()).toBeVisible()
        await expect(page.getByText('Stoumont').first()).toBeVisible()
    })
})
