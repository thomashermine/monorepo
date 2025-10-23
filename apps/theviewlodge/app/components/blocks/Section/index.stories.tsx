import type { Meta, StoryObj } from '@storybook/react-vite'

import { Heading } from '../../primitives/Heading'
import { Text } from '../../primitives/Text'
import { Section } from './index'

const meta: Meta<typeof Section> = {
    component: Section,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    title: 'Blocks/Section',
}

export default meta
type Story = StoryObj<typeof Section>

export const Default: Story = {
    args: {
        children: (
            <div>
                <Heading level="h2" size="xl">
                    Welcome to The View
                </Heading>
                <Text className="mt-4">
                    This is a section with default styling.
                </Text>
            </div>
        ),
    },
}

export const CreamBackground: Story = {
    args: {
        background: 'cream',
        children: (
            <div>
                <Heading level="h2" size="xl">
                    Cream Background
                </Heading>
                <Text className="mt-4">
                    This section has a cream background.
                </Text>
            </div>
        ),
    },
}

export const NoPadding: Story = {
    args: {
        children: (
            <div className="p-8 bg-sage/20 rounded">
                <Heading level="h2" size="lg">
                    No Default Padding
                </Heading>
                <Text className="mt-4">
                    This section has no padding applied.
                </Text>
            </div>
        ),
        padding: 'none',
    },
}
