import type { Meta, StoryObj } from '@storybook/react'

import { AmenityCard } from './index'

const meta: Meta<typeof AmenityCard> = {
    component: AmenityCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    title: 'Blocks/AmenityCard',
}

export default meta
type Story = StoryObj<typeof AmenityCard>

export const WiFi: Story = {
    args: {
        description: 'High-speed internet throughout the lodge',
        icon: 'wifi',
        title: 'Free WiFi',
    },
}

export const Parking: Story = {
    args: {
        description: 'Dedicated parking space for your vehicle',
        icon: 'parking',
        title: 'Private Parking',
    },
}

export const SmartHome: Story = {
    args: {
        description: 'Multiroom audio, personal greeting, romance mode',
        icon: 'smart-home',
        title: 'Smart Home',
    },
}
