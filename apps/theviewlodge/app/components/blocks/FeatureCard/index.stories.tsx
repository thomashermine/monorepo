import type { Meta, StoryObj } from '@storybook/react'

import { FeatureCard } from './index'

const meta: Meta<typeof FeatureCard> = {
    component: FeatureCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    title: 'Blocks/FeatureCard',
}

export default meta
type Story = StoryObj<typeof FeatureCard>

export const Sauna: Story = {
    args: {
        image: '/images/theviewlodge-sauna-mountain-view.jpg',
        size: 'large',
        subtitle: 'Unwind with stunning forest views',
        title: 'Private Sauna',
    },
}

export const HotTub: Story = {
    args: {
        image: '/images/theviewlodge-hottub.jpg',
        size: 'small',
        subtitle: 'Outdoor relaxation with stunning valley views',
        title: 'Nordic Hot Tub',
    },
}
