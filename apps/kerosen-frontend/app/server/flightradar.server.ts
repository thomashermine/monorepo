// ============================================================================================================
// FlightRadar24 authenticated API — server-only helper
// ============================================================================================================

const FR24_API_BASE = 'https://fr24api.flightradar24.com/api'

// ============================================================================================================
// Types
// ============================================================================================================

/** Shape returned by the FR24 /api/live/flight-positions/full endpoint. */
interface Fr24FlightRecord {
    readonly fr24_id: string
    readonly flight: string
    readonly callsign: string
    readonly lat: number
    readonly lon: number
    readonly track: number
    readonly alt: number
    readonly gspeed: number
    readonly vspeed: number
    readonly squawk: string
    readonly timestamp: string
    readonly source: string
    readonly hex: string
    readonly type: string
    readonly reg: string
    readonly painted_as: string
    readonly operating_as: string
    readonly orig_iata: string
    readonly orig_icao: string
    readonly dest_iata: string
    readonly dest_icao: string
    readonly eta: string | null
}

/** Normalised flight record used throughout the app. */
export interface LiveFlight {
    readonly fr24Id: string
    readonly flightNumber: string
    readonly callsign: string
    readonly latitude: number
    readonly longitude: number
    readonly heading: number
    readonly altitude: number
    readonly speed: number
    readonly verticalSpeed: number
    readonly squawk: string
    readonly timestamp: string
    readonly source: string
    readonly icao24: string
    readonly aircraft: string
    readonly registration: string
    readonly paintedAs: string
    readonly operatingAs: string
    readonly origin: string
    readonly originIcao: string
    readonly destination: string
    readonly destinationIcao: string
    readonly eta: string | null
    readonly onGround: boolean
}

// ============================================================================================================
// Helpers
// ============================================================================================================

const KM_PER_DEGREE_LAT = 111.32

function toBoundingBox(
    lat: number,
    lon: number,
    radiusKm: number,
): { latMax: number; latMin: number; lonMin: number; lonMax: number } {
    const dLat = radiusKm / KM_PER_DEGREE_LAT
    const dLon = radiusKm / (KM_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180))

    return {
        latMax: lat + dLat,
        latMin: lat - dLat,
        lonMin: lon - dLon,
        lonMax: lon + dLon,
    }
}

function toFlight(r: Fr24FlightRecord): LiveFlight {
    return {
        fr24Id: r.fr24_id,
        flightNumber: r.flight ?? '',
        callsign: r.callsign ?? '',
        latitude: r.lat,
        longitude: r.lon,
        heading: r.track,
        altitude: r.alt,
        speed: r.gspeed,
        verticalSpeed: r.vspeed,
        squawk: r.squawk ?? '',
        timestamp: r.timestamp,
        source: r.source ?? '',
        icao24: r.hex ?? '',
        aircraft: r.type ?? '',
        registration: r.reg ?? '',
        paintedAs: r.painted_as ?? '',
        operatingAs: r.operating_as ?? '',
        origin: r.orig_iata ?? '',
        originIcao: r.orig_icao ?? '',
        destination: r.dest_iata ?? '',
        destinationIcao: r.dest_icao ?? '',
        eta: r.eta ?? null,
        onGround: r.alt === 0,
    }
}

function getApiKey(): string {
    const key = process.env.FR24_API_KEY
    if (!key) throw new Error('FR24_API_KEY is not set')
    return key
}

// ============================================================================================================
// Public API
// ============================================================================================================

export async function fetchLiveFlights(
    lat: number,
    lon: number,
    radiusKm: number,
): Promise<LiveFlight[]> {
    const { latMax, latMin, lonMin, lonMax } = toBoundingBox(lat, lon, radiusKm)
    const bounds = `${latMax.toFixed(2)},${latMin.toFixed(2)},${lonMin.toFixed(2)},${lonMax.toFixed(2)}`

    const url = `${FR24_API_BASE}/live/flight-positions/full?bounds=${bounds}`

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${getApiKey()}`,
            Accept: 'application/json',
            'Accept-Version': 'v1',
        },
    })

    if (!res.ok) {
        throw new Error(`FR24 API responded with ${res.status}: ${res.statusText}`)
    }

    const json = (await res.json()) as { data: Fr24FlightRecord[] }
    const flights = (json.data ?? []).map(toFlight)

    flights.sort((a, b) => b.altitude - a.altitude)
    return flights
}
