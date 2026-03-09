import React from 'react'

export interface DataTableColumn<K extends string = string> {
    key: K
    label: string
}

export interface DataTableRow<K extends string = string> {
    label: string
    cells: Record<K, React.ReactNode>
}

export interface DataTableProps<K extends string = string> {
    columns: DataTableColumn<K>[]
    rows: DataTableRow<K>[]
    caption?: string
    className?: string
}

export function DataTable<K extends string = string>({
    columns,
    rows,
    caption,
    className = '',
}: DataTableProps<K>) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full border-collapse text-sm">
                {caption && (
                    <caption className="mb-3 text-left text-base font-semibold text-slate-dark">
                        {caption}
                    </caption>
                )}
                <thead>
                    <tr>
                        <th className="sticky left-0 z-10 bg-surface px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-mid">
                            Period
                        </th>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-mid"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-mid/10">
                    {rows.map((row, i) => (
                        <tr
                            key={row.label}
                            className={
                                i % 2 === 0 ? 'bg-white' : 'bg-surface/50'
                            }
                        >
                            <td className="sticky left-0 z-10 whitespace-nowrap bg-inherit px-3 py-2.5 text-sm font-medium text-slate-dark">
                                {row.label}
                            </td>
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className="px-3 py-2.5 text-center text-sm text-slate-dark"
                                >
                                    {row.cells[col.key] ?? '—'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
