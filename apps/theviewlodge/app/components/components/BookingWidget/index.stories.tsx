import type { Meta, StoryObj } from '@storybook/react'
import { BookingWidget } from './index'

const meta: Meta<typeof BookingWidget> = {
    title: 'Components/BookingWidget',
    component: BookingWidget,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BookingWidget>

export const Default: Story = {
    args: {},
}
