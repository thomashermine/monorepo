import type { Meta, StoryObj } from '@storybook/react'
import { AmenityCard } from './index'

const meta: Meta<typeof AmenityCard> = {
    title: 'Blocks/AmenityCard',
    component: AmenityCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AmenityCard>

export const WiFi: Story = {
    args: {
        icon: 'wifi',
        title: 'Free WiFi',
        description: 'High-speed internet throughout the lodge',
    },
}

export const Parking: Story = {
    args: {
        icon: 'parking',
        title: 'Private Parking',
        description: 'Dedicated parking space for your vehicle',
    },
}

export const SmartHome: Story = {
    args: {
        icon: 'smart-home',
        title: 'Smart Home',
        description: 'Multiroom audio, personal greeting, romance mode',
    },
}
