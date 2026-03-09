import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from '@storybook/test'

import { RadiusInput } from './index'

const meta: Meta<typeof RadiusInput> = {
    component: RadiusInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    title: 'Blocks/RadiusInput',
    decorators: [
        (Story) => (
            <div style={{ width: 320 }}>
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof RadiusInput>

export const Default: Story = {
    args: {
        value: 10_000,
        onChange: fn(),
    },
}

export const SmallRadius: Story = {
    args: {
        value: 2_000,
        onChange: fn(),
    },
}

export const LargeRadius: Story = {
    args: {
        value: 100_000,
        onChange: fn(),
    },
}

export const CustomRange: Story = {
    args: {
        value: 5_000,
        onChange: fn(),
        min: 500,
        max: 50_000,
        step: 500,
        label: 'Search radius',
    },
}
