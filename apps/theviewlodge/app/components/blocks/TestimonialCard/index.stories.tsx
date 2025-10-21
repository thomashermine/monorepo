import type { Meta, StoryObj } from '@storybook/react'
import { TestimonialCard } from './index'

const meta: Meta<typeof TestimonialCard> = {
    title: 'Blocks/TestimonialCard',
    component: TestimonialCard,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TestimonialCard>

export const Default: Story = {
    args: {
        quote: 'What a wonderful experience! We really had a super nice stay. The location is perfect to unwind completely.',
        author: 'Thimo',
        rating: 5,
    },
}

export const ShortQuote: Story = {
    args: {
        quote: 'A great cottage with everything you want. And the views… really stunning!',
        author: 'Tim',
        rating: 5,
    },
}
