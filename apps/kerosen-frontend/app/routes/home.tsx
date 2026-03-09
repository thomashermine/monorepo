import type { Route } from './+types/home'

import React, { useCallback } from 'react'
import { useNavigate } from 'react-router'

import { Dashboard } from '@/components/composites/Dashboard'
import { fetchLiveFlights } from '@/server/flightradar.server'
import { generateMockFlights } from '@/server/mock-data.server'

// ============================================================================================================
// Defaults (Liège, Belgium)
// ============================================================================================================

const DEFAULT_LAT = 50.63
const DEFAULT_LON = 5.57
const DEFAULT_RADIUS_KM = 10

// ============================================================================================================
// Server-side loader
// ============================================================================================================

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url)
    const lat = parseFloat(url.searchParams.get('lat') ?? String(DEFAULT_LAT))
    const lon = parseFloat(url.searchParams.get('lon') ?? String(DEFAULT_LON))
    const radiusKm = parseFloat(
        url.searchParams.get('radius') ?? String(DEFAULT_RADIUS_KM),
    )

    let flights
    try {
        flights = await fetchLiveFlights(lat, lon, radiusKm)
    } catch (error) {
        console.error('FR24 fetch failed, falling back to mock data:', error)
        flights = generateMockFlights()
    }

    return {
        lat,
        lon,
        radiusKm,
        flights,
        mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN ?? '',
        meta: {
            title: 'Kerosen — Live Flights',
            description: `Live flights around ${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
        },
    }
}

// ============================================================================================================
// Meta
// ============================================================================================================

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: data?.meta.title ?? 'Kerosen' },
        { name: 'description', content: data?.meta.description ?? '' },
    ]
}

// ============================================================================================================
// Component
// ============================================================================================================

export default function Home({ loaderData }: Route.ComponentProps) {
    const { lat, lon, radiusKm, flights, mapboxAccessToken } = loaderData
    const navigate = useNavigate()

    const handleCenterChange = useCallback(
        (center: [number, number]) => {
            const params = new URLSearchParams(window.location.search)
            params.set('lon', center[0].toFixed(4))
            params.set('lat', center[1].toFixed(4))
            navigate(`?${params.toString()}`, { replace: true })
        },
        [navigate],
    )

    const handleRadiusChange = useCallback(
        (radiusMeters: number) => {
            const params = new URLSearchParams(window.location.search)
            params.set('radius', (radiusMeters / 1000).toFixed(1))
            navigate(`?${params.toString()}`, { replace: true })
        },
        [navigate],
    )

    return (
        <main className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-sky-deep">Kerosen</h1>
            <Dashboard
                center={[lon, lat]}
                radiusMeters={radiusKm * 1000}
                flights={flights}
                accessToken={mapboxAccessToken}
                onCenterChange={handleCenterChange}
                onRadiusChange={handleRadiusChange}
            />
        </main>
    )
}
