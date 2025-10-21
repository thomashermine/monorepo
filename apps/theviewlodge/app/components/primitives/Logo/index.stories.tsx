import type { Meta, StoryObj } from '@storybook/react'
import { Logo } from './index'

const meta: Meta<typeof Logo> = {
    title: 'Primitives/Logo',
    component: Logo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Logo>

export const WithText: Story = {
    args: {
        showText: true,
        size: 'md',
    },
}

export const ImageOnly: Story = {
    args: {
        showText: false,
        size: 'md',
    },
}

export const Large: Story = {
    args: {
        showText: true,
        size: 'lg',
    },
}

export const Small: Story = {
    args: {
        showText: true,
        size: 'sm',
    },
}
