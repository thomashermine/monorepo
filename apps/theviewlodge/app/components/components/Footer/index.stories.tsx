import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from './index'

const meta: Meta<typeof Footer> = {
    title: 'Components/Footer',
    component: Footer,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {
    args: {
        quickLinks: [
            { label: 'Home', href: '#' },
            { label: 'Book Now', href: '#book' },
            { label: 'Gift Vouchers', href: '/vouchers' },
            { label: 'Contact', href: '#contact' },
            {
                label: 'Instagram',
                href: 'https://www.instagram.com/theviewlodge.be',
                external: true,
            },
            { label: 'Terms', href: '/terms' },
        ],
        languages: [
            { code: 'EN', label: 'English', href: '/en', current: true },
            { code: 'FR', label: 'Français', href: '/fr' },
            { code: 'NL', label: 'Nederlands', href: '/nl' },
            { code: 'DE', label: 'Deutsch', href: '/de' },
            { code: 'ES', label: 'Español', href: '/es' },
        ],
    },
}
