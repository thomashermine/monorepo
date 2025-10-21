import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { MobileMenu } from './index'

const meta: Meta<typeof MobileMenu> = {
    component: MobileMenu,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    title: 'Components/MobileMenu',
}

export default meta
type Story = StoryObj<typeof MobileMenu>

export const Open: Story = {
    args: {
        currentLanguage: 'EN',
        isOpen: true,
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
        ],
    },
}

export const Interactive: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false)
        return (
            <div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-6 py-3 bg-sage text-white rounded"
                >
                    Open Mobile Menu
                </button>
                <MobileMenu
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    items={[
                        { href: '#', label: 'Home' },
                        { href: '#book', label: 'Book Now' },
                        { href: '/vouchers', label: 'Gift Vouchers' },
                        { href: '#contact', label: 'Contact' },
                    ]}
                    currentLanguage="EN"
                    languages={[
                        { code: 'EN', href: '/en', label: 'English' },
                        { code: 'FR', href: '/fr', label: 'Français' },
                    ]}
                />
            </div>
        )
    },
}
