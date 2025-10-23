import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
    test('has correct title', async ({ page }) => {
        await page.goto('/')

        // Expect title to contain "The View" and "Wellness" or "Belgian Ardennes"
        await expect(page).toHaveTitle(/The View.*Belgian Ardennes/)
    })

    test('displays hero section', async ({ page }) => {
        await page.goto('/')

        // Check that the main hero heading is visible
        await expect(
            page.getByRole('heading', { name: /Stunning views/i })
        ).toBeVisible()

        // Check that the secondary heading is visible
        await expect(
            page.getByRole('heading', { name: /Endless Relaxation/i })
        ).toBeVisible()

        // Check that the subtitle about Belgian Ardennes is visible
        await expect(page.getByText(/Belgian Ardennes/i)).toBeVisible()

        // Check that "Book your stay" CTA button exists
        await expect(
            page.getByRole('link', { name: /Book your stay/i })
        ).toBeVisible()
    })

    test('has correct navigation links', async ({ page }) => {
        await page.goto('/')

        // Check Home link
        await expect(page.getByRole('link', { name: /^Home$/i })).toBeVisible()

        // Check Book Now link
        await expect(
            page.getByRole('link', { name: /Book Now/i })
        ).toBeVisible()

        // Check Gift Vouchers link
        await expect(
            page.getByRole('link', { name: /Gift Vouchers/i })
        ).toBeVisible()

        // Check Prices link
        await expect(
            page.getByRole('link', { name: /^Prices$/i })
        ).toBeVisible()

        // Check Contact link
        await expect(page.getByRole('link', { name: /Contact/i })).toBeVisible()

        // Check Terms link
        await expect(page.getByRole('link', { name: /Terms/i })).toBeVisible()
    })

    test('displays amenities section', async ({ page }) => {
        await page.goto('/')

        // Check for amenities heading
        await expect(
            page.getByRole('heading', { name: /Wellness Amenities/i })
        ).toBeVisible()

        // Check for key amenities
        await expect(page.getByText(/Private Sauna/i)).toBeVisible()
        await expect(page.getByText(/Nordic Hot Tub/i)).toBeVisible()
        await expect(page.getByText(/Whirlpool Bath/i)).toBeVisible()
    })

    test('displays testimonials section', async ({ page }) => {
        await page.goto('/')

        // Check for testimonials/reviews heading
        await expect(
            page.getByRole('heading', { name: /Guest Reviews/i })
        ).toBeVisible()

        // Check that at least one testimonial is visible
        await expect(
            page.locator('[data-testid="testimonial-card"]').first()
        ).toBeVisible()
    })

    test('displays FAQ section', async ({ page }) => {
        await page.goto('/')

        // Check for FAQ heading
        await expect(
            page.getByRole('heading', { name: /Frequently Asked Questions/i })
        ).toBeVisible()

        // Check that at least one FAQ item is visible
        const firstFAQ = page
            .getByRole('button')
            .filter({ hasText: /What amenities does The View offer/i })
        await expect(firstFAQ).toBeVisible()
    })

    test('displays contact information in footer', async ({ page }) => {
        await page.goto('/')

        // Check for email
        await expect(page.getByText(/hello@theviewlodge\.be/i)).toBeVisible()

        // Check for phone number
        await expect(page.getByText(/\+32 495 64 99 99/i)).toBeVisible()
    })

    test('displays location section', async ({ page }) => {
        await page.goto('/')

        // Check for location/map section
        await expect(
            page.getByRole('heading', { name: /The View: A Hidden Gem/i })
        ).toBeVisible()

        // Check for address information
        await expect(page.getByText(/Stoumont/i)).toBeVisible()
    })
})

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
            page.getByRole('heading', { name: /Gift.*Vouchers/i })
        ).toBeVisible()

        // Check for subtitle about gift
        await expect(
            page.getByText(/Perfect Gift of Luxury and Relaxation/i)
        ).toBeVisible()
    })

    test('displays voucher amount options', async ({ page }) => {
        await page.goto('/vouchers')

        // Check that voucher amounts are visible
        await expect(page.getByText(/49.*Voucher/i)).toBeVisible()
        await expect(page.getByText(/99.*Voucher/i)).toBeVisible()
        await expect(page.getByText(/199.*Voucher/i)).toBeVisible()
        await expect(page.getByText(/299.*Voucher/i)).toBeVisible()
        await expect(page.getByText(/499.*Voucher/i)).toBeVisible()
    })

    test('displays how it works section', async ({ page }) => {
        await page.goto('/vouchers')

        // Check for "How it works" heading
        await expect(
            page.getByRole('heading', { name: /How it works/i })
        ).toBeVisible()

        // Check for key features
        await expect(page.getByText(/Instant delivery/i)).toBeVisible()
        await expect(page.getByText(/Valid 12 months/i)).toBeVisible()
    })

    test('has purchase voucher buttons', async ({ page }) => {
        await page.goto('/vouchers')

        // Check that purchase buttons exist
        const purchaseButtons = page.getByRole('link', {
            name: /Purchase.*Voucher/i,
        })
        await expect(purchaseButtons.first()).toBeVisible()
    })
})

test.describe('Prices Page', () => {
    test('has correct title', async ({ page }) => {
        await page.goto('/prices')

        // Expect title to contain "Pricing" or "Prices" and "The View"
        await expect(page).toHaveTitle(/Pric(ing|es).*The View/)
    })

    test('displays pricing hero section', async ({ page }) => {
        await page.goto('/prices')

        // Check for main heading
        await expect(
            page.getByRole('heading', { name: /Pricing.*Availability/i })
        ).toBeVisible()

        // Check for dynamic pricing description
        await expect(page.getByText(/dynamic pricing/i)).toBeVisible()
    })

    test('displays pricing factors section', async ({ page }) => {
        await page.goto('/prices')

        // Check for factors heading
        await expect(
            page.getByRole('heading', { name: /What Influences Our Pricing/i })
        ).toBeVisible()

        // Check for key factors
        await expect(page.getByText(/Season.*Weather/i)).toBeVisible()
        await expect(page.getByText(/Day of the Week/i)).toBeVisible()
        await expect(page.getByText(/Current Demand/i)).toBeVisible()
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
            page.getByRole('heading', { name: /Terms and Conditions/i })
        ).toBeVisible()
    })

    test('displays operator information', async ({ page }) => {
        await page.goto('/terms')

        // Check for operator information
        await expect(page.getByText(/Crafted Signals SRL/i)).toBeVisible()
        await expect(page.getByText(/Saint-Gilles, Belgium/i)).toBeVisible()
    })

    test('displays cancellation policy', async ({ page }) => {
        await page.goto('/terms')

        // Check for cancellation policy section
        await expect(
            page.getByRole('heading', { name: /Cancellation Policy/i })
        ).toBeVisible()

        // Check for refund information
        await expect(page.getByText(/14 days/i)).toBeVisible()
        await expect(page.getByText(/Full refund/i)).toBeVisible()
    })

    test('displays check-in and check-out times', async ({ page }) => {
        await page.goto('/terms')

        // Check for check-in/check-out section
        await expect(
            page.getByRole('heading', { name: /Check-in and Check-out/i })
        ).toBeVisible()

        // Check for times
        await expect(page.getByText(/4:00 PM/i)).toBeVisible()
        await expect(page.getByText(/12:00 PM/i)).toBeVisible()
    })

    test('displays house rules', async ({ page }) => {
        await page.goto('/terms')

        // Check for house rules section
        await expect(
            page.getByRole('heading', { name: /House Rules/i })
        ).toBeVisible()

        // Check for key rules
        await expect(page.getByText(/Maximum 2 adult guests/i)).toBeVisible()
        await expect(page.getByText(/Pets.*not.*permitted/i)).toBeVisible()
    })
})

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
            page.getByRole('heading', { name: /Gift.*Vouchers/i })
        ).toBeVisible()
    })

    test('can navigate from home to prices', async ({ page }) => {
        await page.goto('/')

        // Click on Prices link
        await page
            .getByRole('link', { name: /^Prices$/i })
            .first()
            .click()

        // Verify we're on the prices page
        await expect(page).toHaveURL(/\/prices/)
        await expect(
            page.getByRole('heading', { name: /Pricing.*Availability/i })
        ).toBeVisible()
    })

    test('can navigate from home to terms', async ({ page }) => {
        await page.goto('/')

        // Click on Terms link
        await page.getByRole('link', { name: /Terms/i }).first().click()

        // Verify we're on the terms page
        await expect(page).toHaveURL(/\/terms/)
        await expect(
            page.getByRole('heading', { name: /Terms and Conditions/i })
        ).toBeVisible()
    })

    test('can navigate back to home from other pages', async ({ page }) => {
        await page.goto('/vouchers')

        // Click on Home link
        await page
            .getByRole('link', { name: /^Home$/i })
            .first()
            .click()

        // Verify we're on the home page
        await expect(page).toHaveURL(/^\/$/)
        await expect(
            page.getByRole('heading', { name: /Stunning views/i })
        ).toBeVisible()
    })
})
