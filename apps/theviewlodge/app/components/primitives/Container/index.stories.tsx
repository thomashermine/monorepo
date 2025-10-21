import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './index'

const meta: Meta<typeof Container> = {
    title: 'Primitives/Container',
    component: Container,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
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
        maxWidth: 'sm',
        children: (
            <div className="bg-cream p-8 rounded">
                <p className="text-charcoal">
                    This is a small container (max-w-2xl)
                </p>
            </div>
        ),
    },
}

export const Large: Story = {
    args: {
        maxWidth: '4xl',
        children: (
            <div className="bg-stone/20 p-8 rounded">
                <p className="text-charcoal">
                    This is a large container (max-w-7xl)
                </p>
            </div>
        ),
    },
}
