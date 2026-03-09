import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
    children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-sky-deep text-white hover:bg-sky-deep/90 focus-visible:ring-sky-deep',
    secondary:
        'bg-sky-light text-sky-deep hover:bg-sky-light/80 focus-visible:ring-sky-light',
    ghost: 'bg-transparent text-slate-dark hover:bg-slate-dark/5 focus-visible:ring-slate-mid',
    danger: 'bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger',
}

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    children,
    ...props
}) => {
    const base =
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'
    const width = fullWidth ? 'w-full' : ''

    return (
        <button
            className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${width} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
