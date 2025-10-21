import React from 'react'
import { Container } from '../../primitives/Container'

export interface SectionProps {
    children: React.ReactNode
    className?: string
    background?: 'white' | 'cream' | 'sage' | 'transparent'
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    containerWidth?:
        | 'sm'
        | 'md'
        | 'lg'
        | 'xl'
        | '2xl'
        | '4xl'
        | '6xl'
        | '7xl'
        | 'full'
    fullWidth?: boolean
}

const backgroundStyles: Record<string, string> = {
    white: 'bg-white',
    cream: 'bg-cream/30',
    sage: 'bg-sage/10',
    transparent: 'bg-transparent',
}

const paddingStyles: Record<string, string> = {
    none: '',
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
    xl: 'py-24',
}

export const Section: React.FC<SectionProps> = ({
    children,
    className = '',
    background = 'white',
    padding = 'lg',
    containerWidth = '7xl',
    fullWidth = false,
}) => {
    const combinedClassName = `${backgroundStyles[background]} ${paddingStyles[padding]} ${className}`

    if (fullWidth) {
        return <section className={combinedClassName}>{children}</section>
    }

    return (
        <section className={combinedClassName}>
            <Container maxWidth={containerWidth}>{children}</Container>
        </section>
    )
}
