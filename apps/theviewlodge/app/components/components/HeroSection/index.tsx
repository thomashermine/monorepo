import React, { useEffect, useRef,useState } from 'react'

import { Button } from '../../primitives/Button'
import { Heading } from '../../primitives/Heading'
import { Text } from '../../primitives/Text'

export interface HeroSectionProps {
    title: React.ReactNode
    subtitle: string
    ctaText: string
    ctaHref: string
    videos?: string[]
    backgroundImage?: string
    cycleInterval?: number
}

export const HeroSection: React.FC<HeroSectionProps> = ({
    title,
    subtitle,
    ctaText,
    ctaHref,
    videos = [],
    backgroundImage,
    cycleInterval = 4000,
}) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
    const [activeVideoElement, setActiveVideoElement] = useState(1)
    const video1Ref = useRef<HTMLVideoElement>(null)
    const video2Ref = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videos.length <= 1) return

        const interval = setInterval(() => {
            setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
            setActiveVideoElement((prev) => (prev === 1 ? 2 : 1))
        }, cycleInterval)

        return () => clearInterval(interval)
    }, [videos.length, cycleInterval])

    const hasVideos = videos.length > 0

    return (
        <section className="relative h-screen flex items-center justify-center pt-16 overflow-hidden">
            {/* Background */}
            {hasVideos ? (
                <div className="absolute inset-0 w-full h-full">
                    <video
                        ref={video1Ref}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            activeVideoElement === 1
                                ? 'opacity-100'
                                : 'opacity-0'
                        }`}
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source
                            src={videos[currentVideoIndex % videos.length]}
                            type="video/mp4"
                        />
                    </video>
                    {videos.length > 1 && (
                        <video
                            ref={video2Ref}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                                activeVideoElement === 2
                                    ? 'opacity-100'
                                    : 'opacity-0'
                            }`}
                            muted
                            loop
                            playsInline
                        >
                            <source
                                src={
                                    videos[
                                        (currentVideoIndex + 1) % videos.length
                                    ]
                                }
                                type="video/mp4"
                            />
                        </video>
                    )}
                </div>
            ) : backgroundImage ? (
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src={backgroundImage}
                        alt="Hero background"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            ) : null}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative text-center text-white px-6 max-w-7xl w-full z-10">
                <Heading
                    level="h1"
                    size="hero"
                    className="mb-6 leading-[0.9] tracking-tight text-white"
                >
                    {title}
                </Heading>
                <Text
                    size="xl"
                    className="mb-8 opacity-90 text-white"
                    weight="light"
                >
                    {subtitle}
                </Text>
                <Button as="a" href={ctaHref} variant="primary" size="lg">
                    {ctaText}
                </Button>
            </div>
        </section>
    )
}
