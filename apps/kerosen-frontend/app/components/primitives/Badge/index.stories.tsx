import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from './index'

const meta: Meta<typeof Badge> = {
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'info', 'success', 'warning', 'danger'],
        },
    },
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    title: 'Primitives/Badge',
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
    args: {
        children: '42 flights',
        variant: 'default',
    },
}

export const Info: Story = {
    args: {
        children: 'Morning',
        variant: 'info',
    },
}

export const Success: Story = {
    args: {
        children: 'Low density',
        variant: 'success',
    },
}

export const Warning: Story = {
    args: {
        children: 'Medium density',
        variant: 'warning',
    },
}

export const Danger: Story = {
    args: {
        children: 'High density',
        variant: 'danger',
    },
}
