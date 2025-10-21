import { useEffect, useRef } from 'react'

export interface MapProps {
    longitude: number
    latitude: number
    zoom?: number
    className?: string
}

export function Map({
    longitude,
    latitude,
    zoom = 13,
    className = '',
}: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<any>(null)

    useEffect(() => {
        if (map.current) return // Initialize map only once

        const initializeMap = async () => {
            // Dynamically import mapbox-gl
            const mapboxgl = await import('mapbox-gl')

            if (!mapContainer.current) return

            // Set the access token
            mapboxgl.default.accessToken =
                'pk.eyJ1IjoibmV4dHJpZGUiLCJhIjoiTXZQZW5lMCJ9.9EOiNzi_IX83-gqGgkmTDg'

            map.current = new mapboxgl.default.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/light-v11',
                center: [longitude, latitude],
                zoom: zoom,
                attributionControl: true,
            })

            // Add a marker
            new mapboxgl.default.Marker({ color: '#6B7280' })
                .setLngLat([longitude, latitude])
                .addTo(map.current)

            // Disable map rotation
            map.current.dragRotate.disable()
            map.current.touchZoomRotate.disableRotation()
        }

        initializeMap()

        return () => {
            if (map.current) {
                map.current.remove()
            }
        }
    }, [longitude, latitude, zoom])

    return (
        <>
            <link
                href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css"
                rel="stylesheet"
            />
            <div ref={mapContainer} className={className} />
        </>
    )
}
