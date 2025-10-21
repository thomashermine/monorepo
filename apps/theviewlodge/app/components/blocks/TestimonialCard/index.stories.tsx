import type { Meta, StoryObj } from '@storybook/react'

import { TestimonialCard } from './index'

const meta: Meta<typeof TestimonialCard> = {
    component: TestimonialCard,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    title: 'Blocks/TestimonialCard',
}

export default meta
type Story = StoryObj<typeof TestimonialCard>

export const Default: Story = {
    args: {
        author: 'Thimo',
        quote: 'What a wonderful experience! We really had a super nice stay. The location is perfect to unwind completely.',
        rating: 5,
    },
}

export const ShortQuote: Story = {
    args: {
        author: 'Tim',
        quote: 'A great cottage with everything you want. And the views… really stunning!',
        rating: 5,
    },
}
