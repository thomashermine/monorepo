import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

import { fadeInUp } from '@/hooks/useAnimation'

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
export type TextColor = 'charcoal' | 'stone' | 'sage' | 'cream' | 'white'
export type TextWeight = 'light' | 'normal' | 'medium' | 'bold'

export interface TextProps {
    children: React.ReactNode
    size?: TextSize
    color?: TextColor
    weight?: TextWeight
    className?: string
    as?: 'p' | 'span' | 'div' | 'li'
    italic?: boolean
    animate?: boolean | 'immediate'
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
    animate = false,
}) => {
    const Component = as
    const italicClass = italic ? 'italic' : ''
    const combinedClassName = `${sizeStyles[size]} ${colorStyles[color]} ${weightStyles[weight]} ${italicClass} leading-relaxed ${className}`

    const ref = useRef<HTMLElement | null>(null)
    const [isInitiallyVisible, setIsInitiallyVisible] = useState(false)
    const [hasChecked, setHasChecked] = useState(false)

    useEffect(() => {
        if (animate === true && ref.current && !hasChecked) {
            // Check if element is in viewport on mount
            const rect = ref.current.getBoundingClientRect()
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0
            setIsInitiallyVisible(isVisible)
            setHasChecked(true)
        }
    }, [animate, hasChecked])

    if (animate === 'immediate') {
        // Animate immediately on mount (for above-the-fold content)
        const MotionComponent = motion.create(Component)
        return (
            <MotionComponent
                className={combinedClassName}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                {children}
            </MotionComponent>
        )
    }

    if (animate === true) {
        const MotionComponent = motion.create(Component)

        // If initially visible, animate immediately instead of waiting for scroll
        if (isInitiallyVisible) {
            return (
                <MotionComponent
                    ref={ref}
                    className={combinedClassName}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    {children}
                </MotionComponent>
            )
        }

        // Otherwise use scroll-based animation
        return (
            <MotionComponent
                ref={ref}
                className={combinedClassName}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.3, once: true }}
                variants={fadeInUp}
            >
                {children}
            </MotionComponent>
        )
    }

    return <Component className={combinedClassName}>{children}</Component>
}
