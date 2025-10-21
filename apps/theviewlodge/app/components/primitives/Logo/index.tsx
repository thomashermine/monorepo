import React from 'react'

export interface LogoProps {
    size?: 'sm' | 'md' | 'lg'
    showText?: boolean
    className?: string
    href?: string
}

const sizeStyles = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
}

const textSizeStyles = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
}

export const Logo: React.FC<LogoProps> = ({
    size = 'md',
    showText = true,
    className = '',
    href = '/',
}) => {
    const content = (
        <div className={`flex items-center gap-3 ${className}`}>
            <img
                src="/images/logo-full-cropped-bordered.png"
                alt="The View Logo"
                className={sizeStyles[size]}
            />
            {showText && (
                <div
                    className={`text-charcoal ${textSizeStyles[size]} font-bold font-baskerville`}
                >
                    The View
                </div>
            )}
        </div>
    )

    if (href) {
        return (
            <a href={href} className="inline-block">
                {content}
            </a>
        )
    }

    return content
}
