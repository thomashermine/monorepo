import type { Meta, StoryObj } from '@storybook/react-vite'

import { Text } from './index'

const meta: Meta<typeof Text> = {
    component: Text,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    title: 'Primitives/Text',
}

export default meta
type Story = StoryObj<typeof Text>

export const Default: Story = {
    args: {
        children: 'This is regular body text in the stone color.',
    },
}

export const Large: Story = {
    args: {
        children: 'Wellness Forest Lodge in the Heart of the Belgian Ardennes.',
        size: 'xl',
    },
}

export const Bold: Story = {
    args: {
        children: 'Important information displayed in bold charcoal.',
        color: 'charcoal',
        weight: 'medium',
    },
}

export const Italic: Story = {
    args: {
        children: 'Beautiful review quoted in italic style.',
        italic: true,
    },
}

export const Sage: Story = {
    args: {
        children: 'Give the gift of serenity today.',
        color: 'sage',
        weight: 'medium',
    },
}
