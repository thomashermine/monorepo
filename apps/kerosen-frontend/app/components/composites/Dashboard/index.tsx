import React from 'react'

import type { LiveFlight } from '@/server/flightradar.server'
import { MapSection } from '../MapSection'
import { LiveFlightsTable } from '../LiveFlightsTable'

// ============================================================================================================
// Public types
// ============================================================================================================

export interface DashboardProps {
    center: [number, number]
    radiusMeters: number
    flights: LiveFlight[]
    accessToken: string
    onCenterChange?: (center: [number, number]) => void
    onRadiusChange?: (radius: number) => void
    className?: string
}

// ============================================================================================================
// Component
// ============================================================================================================

export const Dashboard: React.FC<DashboardProps> = ({
    center,
    radiusMeters,
    flights,
    accessToken,
    onCenterChange,
    onRadiusChange,
    className = '',
}) => {
    return (
        <div className={`flex flex-col gap-6 ${className}`}>
            <MapSection
                center={center}
                radiusMeters={radiusMeters}
                accessToken={accessToken}
                onCenterChange={onCenterChange}
                onRadiusChange={onRadiusChange}
            />

            <LiveFlightsTable
                flights={flights}
                caption={`Live Flights — ${center[1].toFixed(2)}°N, ${center[0].toFixed(2)}°E (${(radiusMeters / 1000).toFixed(0)} km)`}
            />
        </div>
    )
}
