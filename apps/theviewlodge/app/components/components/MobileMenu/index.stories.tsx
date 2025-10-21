import type { Meta, StoryObj } from '@storybook/react'
import { MobileMenu } from './index'
import { useState } from 'react'

const meta: Meta<typeof MobileMenu> = {
    title: 'Components/MobileMenu',
    component: MobileMenu,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MobileMenu>

export const Open: Story = {
    args: {
        isOpen: true,
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
                        { label: 'Home', href: '#' },
                        { label: 'Book Now', href: '#book' },
                        { label: 'Gift Vouchers', href: '/vouchers' },
                        { label: 'Contact', href: '#contact' },
                    ]}
                    currentLanguage="EN"
                    languages={[
                        { code: 'EN', label: 'English', href: '/en' },
                        { code: 'FR', label: 'Français', href: '/fr' },
                    ]}
                />
            </div>
        )
    },
}
