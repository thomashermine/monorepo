import type { Meta, StoryObj } from '@storybook/react-vite'

import { BookingWidget } from './index'

const meta: Meta<typeof BookingWidget> = {
    component: BookingWidget,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    title: 'Components/BookingWidget',
}

export default meta
type Story = StoryObj<typeof BookingWidget>

export const Default: Story = {
    args: {},
}
