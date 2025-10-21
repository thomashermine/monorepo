import type { Meta, StoryObj } from '@storybook/react'

import { Heading } from './index'

const meta: Meta<typeof Heading> = {
    component: Heading,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    title: 'Primitives/Heading',
}

export default meta
type Story = StoryObj<typeof Heading>

export const Hero: Story = {
    args: {
        children: (
            <>
                Stunning views,
                <br />
                <span className="font-normal">Endless Relaxation</span>
            </>
        ),
        level: 'h1',
        size: 'hero',
        weight: 'light',
    },
}

export const H2Large: Story = {
    args: {
        children: 'Escape to The View, your personal sanctuary',
        level: 'h2',
        size: 'xl',
    },
}

export const H3Medium: Story = {
    args: {
        children: 'Wellness Amenities',
        level: 'h3',
        size: 'lg',
    },
}

export const H4Small: Story = {
    args: {
        children: 'Private Sauna',
        level: 'h4',
        size: 'md',
        weight: 'medium',
    },
}
