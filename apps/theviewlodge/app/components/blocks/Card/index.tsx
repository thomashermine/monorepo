import React from 'react'

export interface CardProps {
    children: React.ReactNode
    className?: string
    padding?: 'none' | 'sm' | 'md' | 'lg'
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    rounded?: 'none' | 'md' | 'lg' | 'xl' | '2xl'
    background?: 'white' | 'cream' | 'transparent'
    hover?: boolean
}

const paddingStyles: Record<string, string> = {
    lg: 'p-8',
    md: 'p-6',
    none: '',
    sm: 'p-4',
}

const shadowStyles: Record<string, string> = {
    lg: 'shadow-lg',
    md: 'shadow-md',
    none: '',
    sm: 'shadow-sm',
    xl: 'shadow-xl',
}

const roundedStyles: Record<string, string> = {
    '2xl': 'rounded-2xl',
    lg: 'rounded-lg',
    md: 'rounded-md',
    none: '',
    xl: 'rounded-xl',
}

const backgroundStyles: Record<string, string> = {
    cream: 'bg-cream/40',
    transparent: 'bg-transparent',
    white: 'bg-white',
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'lg',
    shadow = 'sm',
    rounded = '2xl',
    background = 'white',
    hover = false,
}) => {
    const hoverClass = hover
        ? 'hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
        : ''
    const combinedClassName = `${backgroundStyles[background]} ${paddingStyles[padding]} ${shadowStyles[shadow]} ${roundedStyles[rounded]} ${hoverClass} ${className}`

    return <div className={combinedClassName}>{children}</div>
}
