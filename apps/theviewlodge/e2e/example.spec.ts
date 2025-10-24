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
        await expect(page.getByText(/\+32 495 64 99 99/i).first()).toBeVisible()
    })

    test('displays location section', async ({ page }) => {
        await page.goto('/')
        await expect(page.getByText('Targnon').first()).toBeVisible()
        await expect(page.getByText('Stoumont').first()).toBeVisible()
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
