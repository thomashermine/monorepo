import React from 'react'

export interface LogoProps {
    size?: 'sm' | 'md' | 'lg'
    showText?: boolean
    className?: string
    href?: string
}

const sizeStyles = {
    lg: 'h-12',
    md: 'h-10',
    sm: 'h-8',
}

const textSizeStyles = {
    lg: 'text-2xl',
    md: 'text-xl',
    sm: 'text-lg',
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
