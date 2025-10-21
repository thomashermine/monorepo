import type { Meta, StoryObj } from '@storybook/react'
import { HeroSection } from './index'

const meta: Meta<typeof HeroSection> = {
    title: 'Components/HeroSection',
    component: HeroSection,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HeroSection>

export const WithImage: Story = {
    args: {
        title: (
            <>
                Stunning views,
                <br />
                <span className="font-normal">Endless Relaxation</span>
            </>
        ),
        subtitle: 'Wellness Forest Lodge in the Heart of the Belgian Ardennes.',
        ctaText: 'Book your stay',
        ctaHref: '#book',
        backgroundImage: '/images/theviewlodge-main.jpg',
    },
}

export const VouchersHero: Story = {
    args: {
        title: (
            <>
                Gift
                <br />
                <span className="font-normal">Vouchers</span>
            </>
        ),
        subtitle: 'Give the Perfect Gift of Luxury and Relaxation',
        ctaText: 'Browse Vouchers',
        ctaHref: '#vouchers',
        backgroundImage: '/images/theviewlodge-main.jpg',
    },
}
