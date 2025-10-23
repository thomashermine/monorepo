import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

import { fadeInUp } from '@/hooks/useAnimation'

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
    animate?: boolean | 'immediate'
}

const sizeStyles: Record<HeadingSize, string> = {
    '2xl': 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
    '3xl': 'text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
    '4xl': 'text-5xl md:text-7xl lg:text-8xl xl:text-9xl',
    hero: 'text-5xl md:text-7xl lg:text-8xl xl:text-[8rem]',
    lg: 'text-3xl md:text-4xl lg:text-5xl',
    md: 'text-2xl md:text-3xl',
    sm: 'text-xl md:text-2xl',
    xl: 'text-4xl md:text-5xl lg:text-6xl',
    xs: 'text-lg md:text-xl',
}

const weightStyles: Record<string, string> = {
    bold: 'font-bold',
    light: 'font-light',
    medium: 'font-medium',
    normal: 'font-normal',
}

export const Heading: React.FC<HeadingProps> = ({
    level,
    size = 'lg',
    children,
    className = '',
    fontFamily = 'baskerville',
    weight = 'light',
    animate = true,
}) => {
    const Component = level
    const fontFamilyClass =
        fontFamily === 'baskerville' ? 'font-baskerville' : ''
    const combinedClassName = `${sizeStyles[size]} ${weightStyles[weight]} ${fontFamilyClass} leading-tight text-charcoal ${className}`

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
