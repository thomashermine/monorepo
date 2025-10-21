import type { Meta, StoryObj } from '@storybook/react'

import { Heading } from '../../primitives/Heading'
import { Text } from '../../primitives/Text'
import { Card } from './index'

const meta: Meta<typeof Card> = {
    component: Card,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    title: 'Blocks/Card',
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
    args: {
        children: (
            <div>
                <Heading level="h3" size="md">
                    Card Title
                </Heading>
                <Text className="mt-4">
                    This is a card with default styling.
                </Text>
            </div>
        ),
    },
}

export const WithHover: Story = {
    args: {
        children: (
            <div>
                <Heading level="h3" size="md">
                    Hover Me
                </Heading>
                <Text className="mt-4">This card has hover effects.</Text>
            </div>
        ),
        hover: true,
    },
}

export const Cream: Story = {
    args: {
        background: 'cream',
        children: (
            <div>
                <Heading level="h3" size="md">
                    Cream Background
                </Heading>
                <Text className="mt-4">This card has a cream background.</Text>
            </div>
        ),
    },
}
