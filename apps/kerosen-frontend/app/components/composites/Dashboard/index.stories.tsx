import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from '@storybook/test'

import { Dashboard } from './index'
import type { FlightDensityEntry } from '../FlightDensityTable'

const MAPBOX_TOKEN = import.meta.env.STORYBOOK_MAPBOX_TOKEN ?? ''

const sampleData: FlightDensityEntry[] = [
    {
        period: 'Early Morning (00–06)',
        cells: { mon: 12, tue: 8, wed: 15, thu: 10, fri: 14, sat: 5, sun: 4 },
    },
    {
        period: 'Morning (06–09)',
        cells: {
            mon: 85,
            tue: 92,
            wed: 78,
            thu: 88,
            fri: 95,
            sat: 42,
            sun: 35,
        },
    },
    {
        period: 'Midday (09–12)',
        cells: {
            mon: 120,
            tue: 115,
            wed: 130,
            thu: 125,
            fri: 140,
            sat: 65,
            sun: 55,
        },
    },
    {
        period: 'Afternoon (12–15)',
        cells: {
            mon: 110,
            tue: 105,
            wed: 108,
            thu: 112,
            fri: 125,
            sat: 70,
            sun: 60,
        },
    },
    {
        period: 'Late Afternoon (15–18)',
        cells: {
            mon: 95,
            tue: 90,
            wed: 98,
            thu: 92,
            fri: 105,
            sat: 55,
            sun: 50,
        },
    },
    {
        period: 'Evening (18–21)',
        cells: {
            mon: 60,
            tue: 55,
            wed: 65,
            thu: 58,
            fri: 72,
            sat: 40,
            sun: 38,
        },
    },
    {
        period: 'Night (21–00)',
        cells: {
            mon: 25,
            tue: 20,
            wed: 28,
            thu: 22,
            fri: 35,
            sat: 18,
            sun: 15,
        },
    },
]

const meta: Meta<typeof Dashboard> = {
    component: Dashboard,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    title: 'Composites/Dashboard',
}

export default meta
type Story = StoryObj<typeof Dashboard>

export const Default: Story = {
    args: {
        accessToken: MAPBOX_TOKEN,
        center: [5.57, 50.63],
        radiusMeters: 10_000,
        flightData: sampleData,
        onCenterChange: fn(),
        onRadiusChange: fn(),
    },
}

export const ParisArea: Story = {
    args: {
        accessToken: MAPBOX_TOKEN,
        center: [2.35, 48.86],
        radiusMeters: 30_000,
        flightData: sampleData,
        onCenterChange: fn(),
        onRadiusChange: fn(),
    },
}

export const NoData: Story = {
    args: {
        accessToken: MAPBOX_TOKEN,
        center: [0, 0],
        radiusMeters: 5_000,
        flightData: [],
        onCenterChange: fn(),
        onRadiusChange: fn(),
    },
}
