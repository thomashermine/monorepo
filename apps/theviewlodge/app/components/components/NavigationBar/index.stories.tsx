import type { Meta, StoryObj } from '@storybook/react'
import { NavigationBar } from './index'

const meta: Meta<typeof NavigationBar> = {
    title: 'Components/NavigationBar',
    component: NavigationBar,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NavigationBar>

export const Default: Story = {
    args: {
        items: [
            { label: 'Home', href: '#' },
            { label: 'Book Now', href: '#book' },
            { label: 'Gift Vouchers', href: '/vouchers' },
            { label: 'Contact', href: '#contact' },
        ],
        currentLanguage: 'EN',
        languages: [
            { code: 'EN', label: 'English', href: '/en' },
            { code: 'FR', label: 'Français', href: '/fr' },
            { code: 'NL', label: 'Nederlands', href: '/nl' },
            { code: 'DE', label: 'Deutsch', href: '/de' },
            { code: 'ES', label: 'Español', href: '/es' },
        ],
    },
}

export const WithoutLanguages: Story = {
    args: {
        items: [
            { label: 'Home', href: '#' },
            { label: 'Book Now', href: '#book' },
            { label: 'Contact', href: '#contact' },
        ],
        currentLanguage: 'EN',
        languages: [],
    },
}
