import React from 'react'

import { Badge } from '../../primitives/Badge'
import { Card, CardBody, CardHeader } from '../../primitives/Card'
import { DataTable, type DataTableColumn, type DataTableRow } from '../../blocks/DataTable'

// ============================================================
// Public types
// ============================================================

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface FlightDensityEntry {
    readonly period: string
    readonly cells: Record<DayKey, number>
}

export interface FlightDensityTableProps {
    data: FlightDensityEntry[]
    caption?: string
    className?: string
}

// ============================================================
// Constants
// ============================================================

const DAY_COLUMNS: DataTableColumn<DayKey>[] = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' },
]

export const PERIODS = [
    'Early Morning (00–06)',
    'Morning (06–09)',
    'Midday (09–12)',
    'Afternoon (12–15)',
    'Late Afternoon (15–18)',
    'Evening (18–21)',
    'Night (21–00)',
] as const

// ============================================================
// Helpers
// ============================================================

function badgeVariant(count: number): 'success' | 'warning' | 'danger' {
    if (count > 100) return 'danger'
    if (count > 50) return 'warning'
    return 'success'
}

function toRows(data: FlightDensityEntry[]): DataTableRow<DayKey>[] {
    return data.map((entry) => {
        const cells = {} as Record<DayKey, React.ReactNode>
        for (const col of DAY_COLUMNS) {
            const count = entry.cells[col.key] ?? 0
            cells[col.key] = <Badge variant={badgeVariant(count)}>{count}</Badge>
        }
        return { label: entry.period, cells }
    })
}

// ============================================================
// Component
// ============================================================

export const FlightDensityTable: React.FC<FlightDensityTableProps> = ({
    data,
    caption = 'Flight Density',
    className = '',
}) => {
    const rows = toRows(data)

    return (
        <Card className={className}>
            <CardHeader>
                <h2 className="text-lg font-semibold text-slate-dark">
                    {caption}
                </h2>
            </CardHeader>
            <CardBody padding="none">
                {data.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-slate-mid">
                        No flight data available for this area.
                    </p>
                ) : (
                    <DataTable<DayKey> columns={DAY_COLUMNS} rows={rows} />
                )}
            </CardBody>
        </Card>
    )
}
