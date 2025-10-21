import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './index'

const meta: Meta<typeof Button> = {
    title: 'Primitives/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'sage', 'charcoal', 'stone'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl'],
        },
    },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
    args: {
        children: 'Book your stay',
        variant: 'primary',
        size: 'lg',
    },
}

export const Sage: Story = {
    args: {
        children: 'Reserve now',
        variant: 'sage',
        size: 'lg',
    },
}

export const Charcoal: Story = {
    args: {
        children: 'Plan your escape',
        variant: 'charcoal',
        size: 'lg',
    },
}

export const Small: Story = {
    args: {
        children: 'Learn more',
        variant: 'sage',
        size: 'sm',
    },
}

export const AsLink: Story = {
    args: {
        children: 'Visit website',
        variant: 'primary',
        size: 'md',
        as: 'a',
        href: '#',
    },
}
