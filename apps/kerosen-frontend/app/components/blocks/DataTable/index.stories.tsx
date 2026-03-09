import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '../../primitives/Badge'
import { DataTable } from './index'

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

const dayColumns: { key: DayKey; label: string }[] = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' },
]

function badgeFor(count: number) {
    const variant =
        count > 100 ? 'danger' : count > 50 ? 'warning' : 'success'
    return <Badge variant={variant}>{count}</Badge>
}

const sampleRows: { label: string; cells: Record<DayKey, React.ReactNode> }[] =
    [
        {
            label: 'Early Morning (00–06)',
            cells: {
                mon: badgeFor(12),
                tue: badgeFor(8),
                wed: badgeFor(15),
                thu: badgeFor(10),
                fri: badgeFor(14),
                sat: badgeFor(5),
                sun: badgeFor(4),
            },
        },
        {
            label: 'Morning (06–09)',
            cells: {
                mon: badgeFor(85),
                tue: badgeFor(92),
                wed: badgeFor(78),
                thu: badgeFor(88),
                fri: badgeFor(95),
                sat: badgeFor(42),
                sun: badgeFor(35),
            },
        },
        {
            label: 'Midday (09–12)',
            cells: {
                mon: badgeFor(120),
                tue: badgeFor(115),
                wed: badgeFor(130),
                thu: badgeFor(125),
                fri: badgeFor(140),
                sat: badgeFor(65),
                sun: badgeFor(55),
            },
        },
        {
            label: 'Afternoon (12–15)',
            cells: {
                mon: badgeFor(110),
                tue: badgeFor(105),
                wed: badgeFor(108),
                thu: badgeFor(112),
                fri: badgeFor(125),
                sat: badgeFor(70),
                sun: badgeFor(60),
            },
        },
        {
            label: 'Late Afternoon (15–18)',
            cells: {
                mon: badgeFor(95),
                tue: badgeFor(90),
                wed: badgeFor(98),
                thu: badgeFor(92),
                fri: badgeFor(105),
                sat: badgeFor(55),
                sun: badgeFor(50),
            },
        },
        {
            label: 'Evening (18–21)',
            cells: {
                mon: badgeFor(60),
                tue: badgeFor(55),
                wed: badgeFor(65),
                thu: badgeFor(58),
                fri: badgeFor(72),
                sat: badgeFor(40),
                sun: badgeFor(38),
            },
        },
        {
            label: 'Night (21–00)',
            cells: {
                mon: badgeFor(25),
                tue: badgeFor(20),
                wed: badgeFor(28),
                thu: badgeFor(22),
                fri: badgeFor(35),
                sat: badgeFor(18),
                sun: badgeFor(15),
            },
        },
    ]

import React from 'react'

const meta: Meta<typeof DataTable<DayKey>> = {
    component: DataTable,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    title: 'Blocks/DataTable',
}

export default meta
type Story = StoryObj<typeof DataTable<DayKey>>

export const FlightDensity: Story = {
    args: {
        columns: dayColumns,
        rows: sampleRows,
        caption: 'Flight Density — Liège area',
    },
}

export const EmptyTable: Story = {
    args: {
        columns: dayColumns,
        rows: [],
        caption: 'No data available',
    },
}
