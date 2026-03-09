import React from 'react'

export interface CardProps {
    children: React.ReactNode
    className?: string
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
}) => {
    return (
        <div
            className={`rounded-xl border border-slate-mid/15 bg-white shadow-sm ${paddingStyles[padding]} ${className}`}
        >
            {children}
        </div>
    )
}

// ============================================================

export interface CardHeaderProps {
    children: React.ReactNode
    className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    children,
    className = '',
}) => {
    return (
        <div
            className={`border-b border-slate-mid/15 px-5 py-4 ${className}`}
        >
            {children}
        </div>
    )
}

// ============================================================

export interface CardBodyProps {
    children: React.ReactNode
    className?: string
}

export const CardBody: React.FC<CardBodyProps> = ({
    children,
    className = '',
}) => {
    return <div className={`p-5 ${className}`}>{children}</div>
}
