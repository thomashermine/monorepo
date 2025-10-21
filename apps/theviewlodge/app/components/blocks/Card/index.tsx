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
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
}

const shadowStyles: Record<string, string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
}

const roundedStyles: Record<string, string> = {
    none: '',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
}

const backgroundStyles: Record<string, string> = {
    white: 'bg-white',
    cream: 'bg-cream/40',
    transparent: 'bg-transparent',
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
