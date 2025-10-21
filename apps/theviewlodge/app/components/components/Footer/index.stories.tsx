import type { Meta, StoryObj } from '@storybook/react'

import { Footer } from './index'

const meta: Meta<typeof Footer> = {
    component: Footer,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    title: 'Components/Footer',
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {
    args: {
        languages: [
            { code: 'EN', current: true, href: '/en', label: 'English' },
            { code: 'FR', href: '/fr', label: 'Français' },
            { code: 'NL', href: '/nl', label: 'Nederlands' },
            { code: 'DE', href: '/de', label: 'Deutsch' },
            { code: 'ES', href: '/es', label: 'Español' },
        ],
        quickLinks: [
            { href: '#', label: 'Home' },
            { href: '#book', label: 'Book Now' },
            { href: '/vouchers', label: 'Gift Vouchers' },
            { href: '#contact', label: 'Contact' },
            {
                external: true,
                href: 'https://www.instagram.com/theviewlodge.be',
                label: 'Instagram',
            },
            { href: '/terms', label: 'Terms' },
        ],
    },
}
