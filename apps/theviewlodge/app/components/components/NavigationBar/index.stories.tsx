import type { Meta, StoryObj } from '@storybook/react-vite'

import { NavigationBar } from './index'

const meta: Meta<typeof NavigationBar> = {
    component: NavigationBar,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    title: 'Components/NavigationBar',
}

export default meta
type Story = StoryObj<typeof NavigationBar>

export const Default: Story = {
    args: {
        currentLanguage: 'EN',
        items: [
            { href: '#', label: 'Home' },
            { href: '#book', label: 'Book Now' },
            { href: '/vouchers', label: 'Gift Vouchers' },
            { href: '#contact', label: 'Contact' },
        ],
        languages: [
            { code: 'EN', href: '/en', label: 'English' },
            { code: 'FR', href: '/fr', label: 'Français' },
            { code: 'NL', href: '/nl', label: 'Nederlands' },
            { code: 'DE', href: '/de', label: 'Deutsch' },
            { code: 'ES', href: '/es', label: 'Español' },
        ],
    },
}

export const WithoutLanguages: Story = {
    args: {
        currentLanguage: 'EN',
        items: [
            { href: '#', label: 'Home' },
            { href: '#book', label: 'Book Now' },
            { href: '#contact', label: 'Contact' },
        ],
        languages: [],
    },
}
