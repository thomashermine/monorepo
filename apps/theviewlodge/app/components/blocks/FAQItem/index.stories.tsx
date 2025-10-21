import type { Meta, StoryObj } from '@storybook/react'
import { FAQItem } from './index'

const meta: Meta<typeof FAQItem> = {
    title: 'Blocks/FAQItem',
    component: FAQItem,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FAQItem>

export const Default: Story = {
    args: {
        question: 'What amenities does The View offer?',
        answer: 'The View features a private sauna, a bubble bathtub, stunning views, and a full smart home experience, including a romance mode with customized lighting and music.',
    },
}

export const WithLink: Story = {
    args: {
        question: 'How many people can stay at The View?',
        answer: (
            <>
                The lodge is designed for a maximum of two guests, providing the
                perfect setting for an intimate and romantic retreat.{' '}
                <a href="#" className="text-sage hover:underline">
                    Learn more
                </a>
            </>
        ),
    },
}
