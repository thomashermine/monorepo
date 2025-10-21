import React from 'react'
import { Card } from '../Card'

export interface FeatureCardProps {
    image: string
    title: string
    subtitle?: string
    size?: 'small' | 'medium' | 'large'
}

const sizeStyles = {
    small: 'w-[400px] h-[350px]',
    medium: 'w-[450px] h-[350px]',
    large: 'w-[500px] h-[350px]',
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    image,
    title,
    subtitle,
    size = 'small',
}) => {
    return (
        <div
            className={`${sizeStyles[size]} bg-gradient-to-br from-sage/40 to-stone/50 rounded-2xl overflow-hidden relative flex-shrink-0`}
        >
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-3xl font-light font-baskerville mb-2">
                    {title}
                </h3>
                {subtitle && <p className="text-lg opacity-90">{subtitle}</p>}
            </div>
        </div>
    )
}
