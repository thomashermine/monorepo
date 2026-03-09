import React from 'react'

export type BadgeVariant = 'default' | 'info' | 'success' | 'warning' | 'danger'

export interface BadgeProps {
    variant?: BadgeVariant
    children: React.ReactNode
    className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-slate-mid/10 text-slate-dark',
    info: 'bg-sky-light text-sky-deep',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-danger',
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    className = '',
    children,
}) => {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
        >
            {children}
        </span>
    )
}
