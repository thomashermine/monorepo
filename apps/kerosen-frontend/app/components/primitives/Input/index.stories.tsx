import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from './index'

const meta: Meta<typeof Input> = {
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    title: 'Primitives/Input',
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
    args: {
        label: 'Location',
        placeholder: 'Search for a place...',
    },
    decorators: [
        (Story) => (
            <div style={{ width: 320 }}>
                <Story />
            </div>
        ),
    ],
}

export const WithValue: Story = {
    args: {
        label: 'Location',
        value: 'Paris, France',
    },
    decorators: [
        (Story) => (
            <div style={{ width: 320 }}>
                <Story />
            </div>
        ),
    ],
}

export const WithError: Story = {
    args: {
        error: 'Please enter a valid location',
        label: 'Location',
        value: '',
    },
    decorators: [
        (Story) => (
            <div style={{ width: 320 }}>
                <Story />
            </div>
        ),
    ],
}

export const NumberInput: Story = {
    args: {
        label: 'Radius (meters)',
        min: 0,
        placeholder: '5000',
        type: 'number',
    },
    decorators: [
        (Story) => (
            <div style={{ width: 320 }}>
                <Story />
            </div>
        ),
    ],
}

export const Disabled: Story = {
    args: {
        disabled: true,
        label: 'Location',
        value: 'Loading...',
    },
    decorators: [
        (Story) => (
            <div style={{ width: 320 }}>
                <Story />
            </div>
        ),
    ],
}

export const WithoutLabel: Story = {
    args: {
        placeholder: 'Search...',
    },
    decorators: [
        (Story) => (
            <div style={{ width: 320 }}>
                <Story />
            </div>
        ),
    ],
}
