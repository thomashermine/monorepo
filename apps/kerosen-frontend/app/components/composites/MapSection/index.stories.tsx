import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from '@storybook/test'

import { MapSection } from './index'

const MAPBOX_TOKEN = import.meta.env.STORYBOOK_MAPBOX_TOKEN ?? ''

const meta: Meta<typeof MapSection> = {
    component: MapSection,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    title: 'Composites/MapSection',
}

export default meta
type Story = StoryObj<typeof MapSection>

export const Default: Story = {
    args: {
        accessToken: MAPBOX_TOKEN,
        center: [5.57, 50.63],
        radiusMeters: 10_000,
        onCenterChange: fn(),
        onRadiusChange: fn(),
    },
}

export const ParisArea: Story = {
    args: {
        accessToken: MAPBOX_TOKEN,
        center: [2.35, 48.86],
        radiusMeters: 30_000,
        onCenterChange: fn(),
        onRadiusChange: fn(),
    },
}
