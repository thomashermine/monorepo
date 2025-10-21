import React from 'react'

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type HeadingSize =
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | 'hero'

export interface HeadingProps {
    level: HeadingLevel
    size?: HeadingSize
    children: React.ReactNode
    className?: string
    fontFamily?: 'baskerville' | 'sans'
    weight?: 'light' | 'normal' | 'medium' | 'bold'
}

const sizeStyles: Record<HeadingSize, string> = {
    xs: 'text-lg md:text-xl',
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl lg:text-5xl',
    xl: 'text-4xl md:text-5xl lg:text-6xl',
    '2xl': 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
    '3xl': 'text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
    '4xl': 'text-5xl md:text-7xl lg:text-8xl xl:text-9xl',
    hero: 'text-5xl md:text-7xl lg:text-8xl xl:text-[8rem]',
}

const weightStyles: Record<string, string> = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
}

export const Heading: React.FC<HeadingProps> = ({
    level,
    size = 'lg',
    children,
    className = '',
    fontFamily = 'baskerville',
    weight = 'light',
}) => {
    const Component = level
    const fontFamilyClass =
        fontFamily === 'baskerville' ? 'font-baskerville' : ''
    const combinedClassName = `${sizeStyles[size]} ${weightStyles[weight]} ${fontFamilyClass} leading-tight text-charcoal ${className}`

    return <Component className={combinedClassName}>{children}</Component>
}
