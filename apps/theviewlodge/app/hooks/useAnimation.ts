import { useEffect, useState } from 'react'
import type { Variants } from 'framer-motion'

/**
 * Animation variants for common animations
 */
export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

export const fadeIn: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
}

export const slideInFromLeft: Variants = {
    hidden: {
        opacity: 0,
        x: -50,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

export const slideInFromRight: Variants = {
    hidden: {
        opacity: 0,
        x: 50,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

export const scaleIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
}

/**
 * Hook to detect if element is in viewport for scroll animations
 */
export function useInView(threshold = 0.1) {
    const [ref, setRef] = useState<HTMLElement | null>(null)
    const [isInView, setIsInView] = useState(false)

    useEffect(() => {
        if (!ref) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isInView) {
                    setIsInView(true)
                }
            },
            { threshold }
        )

        observer.observe(ref)

        return () => observer.disconnect()
    }, [ref, threshold, isInView])

    return { ref: setRef, isInView }
}

/**
 * Hover animation variants
 */
export const hoverScale = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
}

export const hoverLift = {
    rest: { y: 0, boxShadow: '0 10px 30px -15px rgba(0,0,0,0.2)' },
    hover: {
        y: -8,
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)',
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
}

