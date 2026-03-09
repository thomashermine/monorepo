import React, { useState, useRef, useCallback } from 'react'

import { Input } from '../../primitives/Input'

export interface PlaceResult {
    id: string
    name: string
    lng: number
    lat: number
}

export interface PlaceSearchProps {
    accessToken: string
    onSelect: (place: PlaceResult) => void
    placeholder?: string
    label?: string
    className?: string
}

export const PlaceSearch: React.FC<PlaceSearchProps> = ({
    accessToken,
    onSelect,
    placeholder = 'Search for a place...',
    label = 'Location',
    className = '',
}) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<PlaceResult[]>([])
    const [open, setOpen] = useState(false)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const search = useCallback(
        (value: string) => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
            if (value.length < 2) {
                setResults([])
                setOpen(false)
                return
            }

            debounceRef.current = setTimeout(async () => {
                try {
                    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${accessToken}&limit=5`
                    const res = await fetch(url)
                    if (!res.ok) return
                    const data = await res.json()
                    const features: PlaceResult[] = (
                        data.features ?? []
                    ).map(
                        (f: {
                            id: string
                            place_name: string
                            center: [number, number]
                        }) => ({
                            id: f.id,
                            name: f.place_name,
                            lng: f.center[0],
                            lat: f.center[1],
                        })
                    )
                    setResults(features)
                    setOpen(features.length > 0)
                } catch {
                    setResults([])
                    setOpen(false)
                }
            }, 300)
        },
        [accessToken]
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value)
        search(value)
    }

    const handleSelect = (place: PlaceResult) => {
        setQuery(place.name)
        setOpen(false)
        setResults([])
        onSelect(place)
    }

    return (
        <div className={`relative ${className}`}>
            <Input
                label={label}
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                autoComplete="off"
            />
            {open && results.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full rounded-lg border border-slate-mid/20 bg-white shadow-lg max-h-60 overflow-auto">
                    {results.map((place) => (
                        <li key={place.id}>
                            <button
                                type="button"
                                className="w-full px-3 py-2.5 text-left text-sm text-slate-dark hover:bg-sky-light/40 transition-colors cursor-pointer"
                                onClick={() => handleSelect(place)}
                            >
                                {place.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
