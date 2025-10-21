import type { Meta, StoryObj } from '@storybook/react'

import { FAQItem } from './index'

const meta: Meta<typeof FAQItem> = {
    component: FAQItem,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    title: 'Blocks/FAQItem',
}

export default meta
type Story = StoryObj<typeof FAQItem>

export const Default: Story = {
    args: {
        answer: 'The View features a private sauna, a bubble bathtub, stunning views, and a full smart home experience, including a romance mode with customized lighting and music.',
        question: 'What amenities does The View offer?',
    },
}

export const WithLink: Story = {
    args: {
        answer: (
            <>
                The lodge is designed for a maximum of two guests, providing the
                perfect setting for an intimate and romantic retreat.{' '}
                <a href="#" className="text-sage hover:underline">
                    Learn more
                </a>
            </>
        ),
        question: 'How many people can stay at The View?',
    },
}
