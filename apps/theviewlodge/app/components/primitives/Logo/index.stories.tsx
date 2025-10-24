import type { Meta, StoryObj } from '@storybook/react-vite'

import { Logo } from './index'

const meta: Meta<typeof Logo> = {
    component: Logo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    title: 'Primitives/Logo',
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
