import React from 'react'

export interface ContainerProps {
    children: React.ReactNode
    className?: string
    maxWidth?:
        | 'sm'
        | 'md'
        | 'lg'
        | 'xl'
        | '2xl'
        | '4xl'
        | '6xl'
        | '7xl'
        | 'full'
    padding?: boolean
}

const maxWidthStyles: Record<string, string> = {
    sm: 'max-w-2xl',
    md: 'max-w-3xl',
    lg: 'max-w-4xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-6xl',
    '4xl': 'max-w-7xl',
    '6xl': 'max-w-[1400px]',
    '7xl': 'max-w-[1600px]',
    full: 'max-w-full',
}

export const Container: React.FC<ContainerProps> = ({
    children,
    className = '',
    maxWidth = '7xl',
    padding = true,
}) => {
    const paddingStyle = padding ? 'px-6' : ''
    const combinedClassName = `container mx-auto ${maxWidthStyles[maxWidth]} ${paddingStyle} ${className}`

    return <div className={combinedClassName}>{children}</div>
}
