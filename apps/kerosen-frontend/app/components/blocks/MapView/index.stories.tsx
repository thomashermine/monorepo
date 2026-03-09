import type { Meta, StoryObj } from '@storybook/react-vite'

import { MapView } from './index'

const MAPBOX_TOKEN = import.meta.env.STORYBOOK_MAPBOX_TOKEN ?? ''

const meta: Meta<typeof MapView> = {
    component: MapView,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    title: 'Blocks/MapView',
    decorators: [
        (Story) => (
            <div style={{ height: 500 }}>
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof MapView>

export const Default: Story = {
    args: {
        accessToken: MAPBOX_TOKEN,
        center: [5.57, 50.63],
        radiusMeters: 10_000,
        zoom: 10,
    },
}

export const LargeRadius: Story = {
    args: {
        accessToken: MAPBOX_TOKEN,
        center: [2.35, 48.86],
        radiusMeters: 50_000,
        zoom: 8,
    },
}

export const SmallRadius: Story = {
    args: {
        accessToken: MAPBOX_TOKEN,
        center: [-0.12, 51.51],
        radiusMeters: 2_000,
        zoom: 13,
    },
}
