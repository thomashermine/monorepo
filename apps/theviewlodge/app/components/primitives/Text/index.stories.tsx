import type { Meta, StoryObj } from '@storybook/react'
import { Text } from './index'

const meta: Meta<typeof Text> = {
    title: 'Primitives/Text',
    component: Text,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
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
        size: 'xl',
        children: 'Wellness Forest Lodge in the Heart of the Belgian Ardennes.',
    },
}

export const Bold: Story = {
    args: {
        weight: 'medium',
        color: 'charcoal',
        children: 'Important information displayed in bold charcoal.',
    },
}

export const Italic: Story = {
    args: {
        italic: true,
        children: 'Beautiful review quoted in italic style.',
    },
}

export const Sage: Story = {
    args: {
        color: 'sage',
        weight: 'medium',
        children: 'Give the gift of serenity today.',
    },
}
