import React from 'react'

import { Container } from '../../primitives/Container'

export interface SectionProps {
    children: React.ReactNode
    className?: string
    id?: string
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
    cream: 'bg-cream/30',
    sage: 'bg-sage/10',
    transparent: 'bg-transparent',
    white: 'bg-white',
}

const paddingStyles: Record<string, string> = {
    lg: 'py-20',
    md: 'py-16',
    none: '',
    sm: 'py-12',
    xl: 'py-24',
}

export const Section: React.FC<SectionProps> = ({
    children,
    className = '',
    id,
    background = 'white',
    padding = 'lg',
    containerWidth = '7xl',
    fullWidth = false,
}) => {
    const combinedClassName = `${backgroundStyles[background]} ${paddingStyles[padding]} ${className}`

    if (fullWidth) {
        return (
            <section id={id} className={combinedClassName}>
                {children}
            </section>
        )
    }

    return (
        <section id={id} className={combinedClassName}>
            <Container maxWidth={containerWidth}>{children}</Container>
        </section>
    )
}
