import React, { useState, useCallback } from 'react'

import { Card, CardBody, CardHeader } from '../../primitives/Card'
import { MapView } from '../../blocks/MapView'
import { PlaceSearch, type PlaceResult } from '../../blocks/PlaceSearch'
import { RadiusInput } from '../../blocks/RadiusInput'

export interface MapSectionProps {
    center: [number, number]
    radiusMeters: number
    accessToken: string
    onCenterChange?: (center: [number, number]) => void
    onRadiusChange?: (radius: number) => void
    className?: string
}

export const MapSection: React.FC<MapSectionProps> = ({
    center: initialCenter,
    radiusMeters: initialRadius,
    accessToken,
    onCenterChange,
    onRadiusChange,
    className = '',
}) => {
    const [center, setCenter] = useState<[number, number]>(initialCenter)
    const [radius, setRadius] = useState(initialRadius)

    const handlePlaceSelect = useCallback(
        (place: PlaceResult) => {
            const next: [number, number] = [place.lng, place.lat]
            setCenter(next)
            onCenterChange?.(next)
        },
        [onCenterChange],
    )

    const handleMapClick = useCallback(
        (lngLat: { lng: number; lat: number }) => {
            const next: [number, number] = [lngLat.lng, lngLat.lat]
            setCenter(next)
            onCenterChange?.(next)
        },
        [onCenterChange],
    )

    const handleRadiusChange = useCallback(
        (value: number) => {
            setRadius(value)
            onRadiusChange?.(value)
        },
        [onRadiusChange],
    )

    return (
        <Card className={className}>
            <CardHeader>
                <h2 className="text-lg font-semibold text-slate-dark">
                    Location & Radius
                </h2>
            </CardHeader>
            <CardBody>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                    <PlaceSearch
                        accessToken={accessToken}
                        onSelect={handlePlaceSelect}
                        className="flex-1"
                    />
                    <RadiusInput
                        value={radius}
                        onChange={handleRadiusChange}
                        className="w-full lg:w-48"
                    />
                </div>

                <div className="mt-4 h-[400px] lg:h-[500px]">
                    <MapView
                        accessToken={accessToken}
                        center={center}
                        radiusMeters={radius}
                        onMapClick={handleMapClick}
                    />
                </div>

                <p className="mt-2 text-xs text-slate-mid">
                    Click the map or search for a place to update the center.
                    Coordinates: {center[1].toFixed(4)}°N,{' '}
                    {center[0].toFixed(4)}°E
                </p>
            </CardBody>
        </Card>
    )
}
