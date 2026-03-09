import React from 'react'

import type { LiveFlight } from '@/server/flightradar.server'
import { Badge } from '../../primitives/Badge'
import { Card, CardBody, CardHeader } from '../../primitives/Card'

// ============================================================================================================
// Public types
// ============================================================================================================

export interface LiveFlightsTableProps {
    readonly flights: LiveFlight[]
    readonly caption?: string
    readonly className?: string
}

// ============================================================================================================
// Helpers
// ============================================================================================================

function formatAltitude(ft: number): string {
    if (ft === 0) return '—'
    return `FL${Math.round(ft / 100)}`
}

function formatSpeed(kts: number): string {
    if (kts === 0) return '—'
    return `${kts} kt`
}

function formatVerticalSpeed(ftPerMin: number): string {
    if (ftPerMin === 0) return '—'
    const sign = ftPerMin > 0 ? '+' : ''
    return `${sign}${ftPerMin} ft/min`
}

function formatRoute(origin: string, destination: string): string {
    if (!origin && !destination) return '—'
    return `${origin || '?'} → ${destination || '?'}`
}

// ============================================================================================================
// Component
// ============================================================================================================

export const LiveFlightsTable: React.FC<LiveFlightsTableProps> = ({
    flights,
    caption,
    className = '',
}) => {
    return (
        <Card className={className}>
            {caption && (
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{caption}</h3>
                        <Badge variant={flights.length > 0 ? 'default' : 'secondary'}>
                            {flights.length} flight{flights.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </CardHeader>
            )}
            <CardBody>
                {flights.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-4 text-center">
                        No flights found in this area.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-3 py-2">Callsign</th>
                                    <th className="px-3 py-2">Aircraft</th>
                                    <th className="px-3 py-2">Route</th>
                                    <th className="px-3 py-2 text-right">Altitude</th>
                                    <th className="px-3 py-2 text-right">Speed</th>
                                    <th className="px-3 py-2 text-right">Hdg</th>
                                    <th className="px-3 py-2 text-right">V/S</th>
                                    <th className="px-3 py-2 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {flights.map((f) => (
                                    <tr
                                        key={f.icao24}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                                    >
                                        <td className="px-3 py-2 font-mono font-medium whitespace-nowrap">
                                            {f.callsign || f.icao24}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            {f.aircraft || '—'}
                                            {f.registration && (
                                                <span className="ml-1 text-gray-400 text-xs">
                                                    ({f.registration})
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            {formatRoute(f.origin, f.destination)}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono whitespace-nowrap">
                                            {formatAltitude(f.altitude)}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono whitespace-nowrap">
                                            {formatSpeed(f.speed)}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono whitespace-nowrap">
                                            {f.heading}°
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono whitespace-nowrap">
                                            {formatVerticalSpeed(f.verticalSpeed)}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <Badge
                                                variant={f.onGround ? 'secondary' : 'default'}
                                            >
                                                {f.onGround ? 'GND' : 'AIR'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardBody>
        </Card>
    )
}
