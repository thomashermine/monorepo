import React from 'react'

import { Input } from '../../primitives/Input'

export interface RadiusInputProps {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    step?: number
    label?: string
    className?: string
}

export const RadiusInput: React.FC<RadiusInputProps> = ({
    value,
    onChange,
    min = 1000,
    max = 200_000,
    step = 1000,
    label = 'Radius (meters)',
    className = '',
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = parseInt(e.target.value, 10)
        if (!Number.isNaN(raw)) {
            onChange(Math.max(min, Math.min(max, raw)))
        }
    }

    const error =
        value < min
            ? `Minimum ${min.toLocaleString()}m`
            : value > max
              ? `Maximum ${max.toLocaleString()}m`
              : undefined

    return (
        <div className={className}>
            <Input
                type="number"
                label={label}
                value={String(value)}
                onChange={handleChange}
                min={min}
                max={max}
                step={step}
                error={error}
            />
            <p className="mt-1 text-xs text-slate-mid">
                {(value / 1000).toFixed(1)} km
            </p>
        </div>
    )
}
