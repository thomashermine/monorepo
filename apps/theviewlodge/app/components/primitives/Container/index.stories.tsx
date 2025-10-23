import type { Meta, StoryObj } from '@storybook/react-vite'

import { Container } from './index'

const meta: Meta<typeof Container> = {
    component: Container,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    title: 'Primitives/Container',
}

export default meta
type Story = StoryObj<typeof Container>

export const Default: Story = {
    args: {
        children: (
            <div className="bg-sage/20 p-8 rounded">
                <p className="text-charcoal">
                    This is content inside a container with default max-width
                    (7xl)
                </p>
            </div>
        ),
    },
}

export const Small: Story = {
    args: {
        children: (
            <div className="bg-cream p-8 rounded">
                <p className="text-charcoal">
                    This is a small container (max-w-2xl)
                </p>
            </div>
        ),
        maxWidth: 'sm',
    },
}

export const Large: Story = {
    args: {
        children: (
            <div className="bg-stone/20 p-8 rounded">
                <p className="text-charcoal">
                    This is a large container (max-w-7xl)
                </p>
            </div>
        ),
        maxWidth: '4xl',
    },
}
