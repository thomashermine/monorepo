import React from 'react'

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'sage'
    | 'charcoal'
    | 'stone'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
    as?: 'button' | 'a'
    href?: string
    target?: string
    children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
    charcoal: 'bg-charcoal text-white hover:bg-charcoal/80',
    primary: 'bg-white text-charcoal hover:bg-cream',
    sage: 'bg-sage text-white hover:bg-sage/80',
    secondary: 'bg-cream text-charcoal hover:bg-cream/80',
    stone: 'bg-stone text-white hover:bg-stone/80',
}

const sizeStyles: Record<ButtonSize, string> = {
    lg: 'px-12 py-6 text-xl',
    md: 'px-8 py-4 text-base',
    sm: 'px-6 py-3 text-sm',
    xl: 'px-16 py-8 text-2xl',
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'lg',
    fullWidth = false,
    as = 'button',
    href,
    target,
    className = '',
    children,
    ...props
}) => {
    const baseStyles =
        'font-medium transition-colors rounded-full shadow-lg inline-block text-center cursor-pointer'
    const widthStyle = fullWidth ? 'w-full block' : 'inline-block'
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`

    if (as === 'a' && href) {
        return (
            <a href={href} target={target} className={combinedClassName}>
                {children}
            </a>
        )
    }

    return (
        <button className={combinedClassName} {...props}>
            {children}
        </button>
    )
}
