import type { Meta, StoryObj } from '@storybook/react-vite'

import { FlightDensityTable, type DayKey, type FlightDensityEntry } from './index'

const meta: Meta<typeof FlightDensityTable> = {
    component: FlightDensityTable,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    title: 'Composites/FlightDensityTable',
}

export default meta
type Story = StoryObj<typeof FlightDensityTable>

const sampleData: FlightDensityEntry[] = [
    {
        period: 'Early Morning (00–06)',
        cells: { mon: 12, tue: 8, wed: 15, thu: 10, fri: 14, sat: 5, sun: 4 },
    },
    {
        period: 'Morning (06–09)',
        cells: { mon: 85, tue: 92, wed: 78, thu: 88, fri: 95, sat: 42, sun: 35 },
    },
    {
        period: 'Midday (09–12)',
        cells: { mon: 120, tue: 115, wed: 130, thu: 125, fri: 140, sat: 65, sun: 55 },
    },
    {
        period: 'Afternoon (12–15)',
        cells: { mon: 110, tue: 105, wed: 108, thu: 112, fri: 125, sat: 70, sun: 60 },
    },
    {
        period: 'Late Afternoon (15–18)',
        cells: { mon: 95, tue: 90, wed: 98, thu: 92, fri: 105, sat: 55, sun: 50 },
    },
    {
        period: 'Evening (18–21)',
        cells: { mon: 60, tue: 55, wed: 65, thu: 58, fri: 72, sat: 40, sun: 38 },
    },
    {
        period: 'Night (21–00)',
        cells: { mon: 25, tue: 20, wed: 28, thu: 22, fri: 35, sat: 18, sun: 15 },
    },
]

export const Default: Story = {
    args: {
        data: sampleData,
        caption: 'Flight Density — Liège area',
    },
}

export const Empty: Story = {
    args: {
        data: [],
        caption: 'Flight Density',
    },
}

export const LowTraffic: Story = {
    args: {
        data: sampleData.map((entry) => ({
            ...entry,
            cells: Object.fromEntries(
                Object.entries(entry.cells).map(([k, v]) => [k, Math.round(v * 0.2)])
            ) as Record<DayKey, number>,
        })),
        caption: 'Flight Density — Rural area',
    },
}
