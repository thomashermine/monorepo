import React from 'react'

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
export type TextColor = 'charcoal' | 'stone' | 'sage' | 'cream' | 'white'
export type TextWeight = 'light' | 'normal' | 'medium' | 'bold'

export interface TextProps {
    children: React.ReactNode
    size?: TextSize
    color?: TextColor
    weight?: TextWeight
    className?: string
    as?: 'p' | 'span' | 'div'
    italic?: boolean
}

const sizeStyles: Record<TextSize, string> = {
    '2xl': 'text-2xl',
    base: 'text-base',
    lg: 'text-lg',
    sm: 'text-sm',
    xl: 'text-xl',
    xs: 'text-xs',
}

const colorStyles: Record<TextColor, string> = {
    charcoal: 'text-charcoal',
    cream: 'text-cream',
    sage: 'text-sage',
    stone: 'text-stone',
    white: 'text-white',
}

const weightStyles: Record<TextWeight, string> = {
    bold: 'font-bold',
    light: 'font-light',
    medium: 'font-medium',
    normal: 'font-normal',
}

export const Text: React.FC<TextProps> = ({
    children,
    size = 'base',
    color = 'stone',
    weight = 'normal',
    className = '',
    as = 'p',
    italic = false,
}) => {
    const Component = as
    const italicClass = italic ? 'italic' : ''
    const combinedClassName = `${sizeStyles[size]} ${colorStyles[color]} ${weightStyles[weight]} ${italicClass} leading-relaxed ${className}`

    return <Component className={combinedClassName}>{children}</Component>
}
