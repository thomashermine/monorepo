import type { Meta, StoryObj } from '@storybook/react'
import { FeatureCard } from './index'

const meta: Meta<typeof FeatureCard> = {
    title: 'Blocks/FeatureCard',
    component: FeatureCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FeatureCard>

export const Sauna: Story = {
    args: {
        image: '/images/theviewlodge-sauna-mountain-view.jpg',
        title: 'Private Sauna',
        subtitle: 'Unwind with stunning forest views',
        size: 'large',
    },
}

export const HotTub: Story = {
    args: {
        image: '/images/theviewlodge-hottub.jpg',
        title: 'Nordic Hot Tub',
        subtitle: 'Outdoor relaxation with stunning valley views',
        size: 'small',
    },
}
