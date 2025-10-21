import type { Meta, StoryObj } from '@storybook/react'

import { HeroSection } from './index'

const meta: Meta<typeof HeroSection> = {
    component: HeroSection,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    title: 'Components/HeroSection',
}

export default meta
type Story = StoryObj<typeof HeroSection>

export const WithImage: Story = {
    args: {
        backgroundImage: '/images/theviewlodge-main.jpg',
        ctaHref: '#book',
        ctaText: 'Book your stay',
        subtitle: 'Wellness Forest Lodge in the Heart of the Belgian Ardennes.',
        title: (
            <>
                Stunning views,
                <br />
                <span className="font-normal">Endless Relaxation</span>
            </>
        ),
    },
}

export const VouchersHero: Story = {
    args: {
        backgroundImage: '/images/theviewlodge-main.jpg',
        ctaHref: '#vouchers',
        ctaText: 'Browse Vouchers',
        subtitle: 'Give the Perfect Gift of Luxury and Relaxation',
        title: (
            <>
                Gift
                <br />
                <span className="font-normal">Vouchers</span>
            </>
        ),
    },
}
