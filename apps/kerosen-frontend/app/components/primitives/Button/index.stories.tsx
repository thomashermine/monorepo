import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './index'

const meta: Meta<typeof Button> = {
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'ghost', 'danger'],
        },
    },
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    title: 'Primitives/Button',
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
    args: {
        children: 'Search flights',
        variant: 'primary',
    },
}

export const Secondary: Story = {
    args: {
        children: 'Reset',
        variant: 'secondary',
    },
}

export const Ghost: Story = {
    args: {
        children: 'Cancel',
        variant: 'ghost',
    },
}

export const Danger: Story = {
    args: {
        children: 'Delete',
        variant: 'danger',
    },
}

export const Small: Story = {
    args: {
        children: 'Apply',
        size: 'sm',
        variant: 'primary',
    },
}

export const Large: Story = {
    args: {
        children: 'Search flights',
        size: 'lg',
        variant: 'primary',
    },
}

export const FullWidth: Story = {
    args: {
        children: 'Search flights',
        fullWidth: true,
        variant: 'primary',
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
        children: 'Disabled',
        disabled: true,
        variant: 'primary',
    },
}
