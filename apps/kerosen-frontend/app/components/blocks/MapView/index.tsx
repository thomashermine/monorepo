import React, { useRef, useEffect } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'

export interface MapViewProps {
    center: [number, number]
    radiusMeters: number
    zoom?: number
    accessToken: string
    className?: string
    onMapClick?: (lngLat: { lng: number; lat: number }) => void
}

export const MapView: React.FC<MapViewProps> = ({
    center,
    radiusMeters,
    zoom = 10,
    accessToken,
    className = '',
    onMapClick,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const sourceId = 'radius-circle'
    const layerId = 'radius-circle-fill'
    const outlineLayerId = 'radius-circle-outline'

    useEffect(() => {
        if (!containerRef.current || !accessToken) return

        let cancelled = false

        import('mapbox-gl').then((mapboxgl) => {
            if (cancelled || !containerRef.current) return
            mapboxgl.default.accessToken = accessToken

            const map = new mapboxgl.default.Map({
                container: containerRef.current,
                style: 'mapbox://styles/mapbox/light-v11',
                center,
                zoom,
            })

            map.addControl(
                new mapboxgl.default.NavigationControl(),
                'top-right'
            )

            map.on('load', () => {
                addCircleLayer(map, center, radiusMeters)
            })

            if (onMapClick) {
                map.on('click', (e) => {
                    onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat })
                })
            }

            mapRef.current = map
        })

        return () => {
            cancelled = true
            mapRef.current?.remove()
            mapRef.current = null
        }
        // Only re-create the map when the access token changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken])

    useEffect(() => {
        const map = mapRef.current
        if (!map || !map.isStyleLoaded()) return

        map.flyTo({ center, zoom })

        const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined
        if (source) {
            source.setData(buildCircleGeoJSON(center, radiusMeters))
        }
    }, [center, radiusMeters, zoom])

    return (
        <div
            ref={containerRef}
            className={`w-full h-full min-h-[300px] rounded-lg overflow-hidden ${className}`}
        />
    )
}

// ============================================================
// Helpers
// ============================================================

function buildCircleGeoJSON(
    center: [number, number],
    radiusMeters: number,
    steps = 64
): GeoJSON.Feature<GeoJSON.Polygon> {
    const [lng, lat] = center
    const km = radiusMeters / 1000
    const coords: [number, number][] = []

    for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * 2 * Math.PI
        const dx = km / (111.32 * Math.cos((lat * Math.PI) / 180))
        const dy = km / 110.574
        coords.push([lng + dx * Math.cos(angle), lat + dy * Math.sin(angle)])
    }

    return {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [coords] },
    }
}

function addCircleLayer(
    map: mapboxgl.Map,
    center: [number, number],
    radiusMeters: number
) {
    if (map.getSource('radius-circle')) return

    map.addSource('radius-circle', {
        type: 'geojson',
        data: buildCircleGeoJSON(center, radiusMeters),
    })

    map.addLayer({
        id: 'radius-circle-fill',
        type: 'fill',
        source: 'radius-circle',
        paint: {
            'fill-color': '#0369a1',
            'fill-opacity': 0.12,
        },
    })

    map.addLayer({
        id: 'radius-circle-outline',
        type: 'line',
        source: 'radius-circle',
        paint: {
            'line-color': '#0369a1',
            'line-width': 2,
        },
    })
}
