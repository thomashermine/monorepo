import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from '@storybook/test'

import { PlaceSearch } from './index'

const MAPBOX_TOKEN = import.meta.env.STORYBOOK_MAPBOX_TOKEN ?? ''

const meta: Meta<typeof PlaceSearch> = {
    component: PlaceSearch,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    title: 'Blocks/PlaceSearch',
    decorators: [
        (Story) => (
            <div style={{ width: 360 }}>
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof PlaceSearch>

export const Default: Story = {
    args: {
        accessToken: MAPBOX_TOKEN,
        onSelect: fn(),
        placeholder: 'Search for a place...',
        label: 'Location',
    },
}

export const CustomPlaceholder: Story = {
    args: {
        accessToken: MAPBOX_TOKEN,
        onSelect: fn(),
        placeholder: 'Enter an airport or city...',
        label: 'Departure',
    },
}
