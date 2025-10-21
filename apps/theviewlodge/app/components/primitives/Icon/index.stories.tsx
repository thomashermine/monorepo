import type { Meta, StoryObj } from '@storybook/react'

import { Icon } from './index'

const meta: Meta<typeof Icon> = {
    component: Icon,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    title: 'Primitives/Icon',
}

export default meta
type Story = StoryObj<typeof Icon>

export const WiFi: Story = {
    args: {
        name: 'wifi',
        size: 'lg',
    },
}

export const Star: Story = {
    args: {
        name: 'star',
        size: 'lg',
    },
}

export const Location: Story = {
    args: {
        name: 'location',
        size: 'lg',
    },
}

export const AllIcons: Story = {
    render: () => (
        <div className="grid grid-cols-5 gap-6">
            {(
                [
                    'wifi',
                    'star',
                    'parking',
                    'smart-home',
                    'moon',
                    'bottle',
                    'email',
                    'phone',
                    'location',
                    'chevron-down',
                    'menu',
                    'close',
                    'external-link',
                    'clock',
                ] as const
            ).map((iconName) => (
                <div
                    key={iconName}
                    className="flex flex-col items-center gap-2"
                >
                    <Icon name={iconName} size="lg" />
                    <span className="text-xs text-stone">{iconName}</span>
                </div>
            ))}
        </div>
    ),
}
