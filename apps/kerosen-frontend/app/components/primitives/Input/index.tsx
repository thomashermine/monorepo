import React from 'react'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, fullWidth = true, className = '', id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
        const width = fullWidth ? 'w-full' : ''

        return (
            <div className={`flex flex-col gap-1.5 ${width}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-slate-dark"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`rounded-lg border border-slate-mid/30 bg-white px-3 py-2 text-sm text-slate-dark placeholder:text-slate-mid/60 focus:border-sky-deep focus:outline-none focus:ring-2 focus:ring-sky-deep/20 disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''} ${className}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="text-xs text-danger"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
