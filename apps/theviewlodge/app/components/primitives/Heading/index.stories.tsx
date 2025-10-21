import type { Meta, StoryObj } from '@storybook/react'
import { Heading } from './index'

const meta: Meta<typeof Heading> = {
    title: 'Primitives/Heading',
    component: Heading,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Heading>

export const Hero: Story = {
    args: {
        level: 'h1',
        size: 'hero',
        weight: 'light',
        children: (
            <>
                Stunning views,
                <br />
                <span className="font-normal">Endless Relaxation</span>
            </>
        ),
    },
}

export const H2Large: Story = {
    args: {
        level: 'h2',
        size: 'xl',
        children: 'Escape to The View, your personal sanctuary',
    },
}

export const H3Medium: Story = {
    args: {
        level: 'h3',
        size: 'lg',
        children: 'Wellness Amenities',
    },
}

export const H4Small: Story = {
    args: {
        level: 'h4',
        size: 'md',
        weight: 'medium',
        children: 'Private Sauna',
    },
}
