import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
    test('has title', async ({ page }) => {
        await page.goto('/')

        // Expect a title to contain "New React Router App"
        await expect(page).toHaveTitle(/New React Router App/)
    })

    test('displays welcome content', async ({ page }) => {
        await page.goto('/')

        // Check that "What's next?" text is visible
        await expect(page.getByText("What's next?")).toBeVisible()

        // Check that a joke is displayed (it should be in a paragraph)
        const jokeParagraph = page
            .locator('p.text-gray-700.dark\\:text-gray-200.text-center')
            .last()
        await expect(jokeParagraph).toBeVisible()
    })

    test('has navigation links', async ({ page }) => {
        await page.goto('/')

        // Check that the React Router Docs link exists and is clickable
        const docsLink = page.getByRole('link', { name: 'React Router Docs' })
        await expect(docsLink).toBeVisible()
        await expect(docsLink).toHaveAttribute(
            'href',
            'https://reactrouter.com/docs'
        )

        // Check that the Discord link exists and is clickable
        const discordLink = page.getByRole('link', { name: 'Join Discord' })
        await expect(discordLink).toBeVisible()
        await expect(discordLink).toHaveAttribute(
            'href',
            'https://rmx.as/discord'
        )
    })
})
