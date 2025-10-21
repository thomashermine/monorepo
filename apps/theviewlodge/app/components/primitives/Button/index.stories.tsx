import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './index'

const meta: Meta<typeof Button> = {
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl'],
        },
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'sage', 'charcoal', 'stone'],
        },
    },
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    title: 'Primitives/Button',
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
    args: {
        children: 'Book your stay',
        size: 'lg',
        variant: 'primary',
    },
}

export const Sage: Story = {
    args: {
        children: 'Reserve now',
        size: 'lg',
        variant: 'sage',
    },
}

export const Charcoal: Story = {
    args: {
        children: 'Plan your escape',
        size: 'lg',
        variant: 'charcoal',
    },
}

export const Small: Story = {
    args: {
        children: 'Learn more',
        size: 'sm',
        variant: 'sage',
    },
}

export const AsLink: Story = {
    args: {
        as: 'a',
        children: 'Visit website',
        href: '#',
        size: 'md',
        variant: 'primary',
    },
}
