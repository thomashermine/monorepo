import React, { useState } from 'react'
import { Button } from '../../primitives/Button'

export interface GalleryImage {
    src: string
    alt: string
    aspectRatio?: string
}

export interface GalleryProps {
    images: GalleryImage[]
    foldable?: boolean
}

export const Gallery: React.FC<GalleryProps> = ({
    images,
    foldable = true,
}) => {
    const [isUnfolded, setIsUnfolded] = useState(false)

    const handleToggle = () => {
        if (isUnfolded) {
            // Scroll back to gallery top when closing
            const gallery = document.getElementById('gallery-masonry')
            if (gallery) {
                gallery.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }
        setIsUnfolded(!isUnfolded)
    }

    const aspectRatioClasses: Record<string, string> = {
        '3/4': 'aspect-[3/4]',
        square: 'aspect-square',
        '4/3': 'aspect-[4/3]',
        '2/3': 'aspect-[2/3]',
        '16/10': 'aspect-[16/10]',
        '3/5': 'aspect-[3/5]',
        '4/5': 'aspect-[4/5]',
        '5/3': 'aspect-[5/3]',
        '3/2': 'aspect-[3/2]',
    }

    return (
        <div className="relative">
            <div
                id="gallery-masonry"
                className={`columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 transition-all duration-500 ${
                    foldable && !isUnfolded ? 'gallery-folded' : ''
                }`}
            >
                {images.map((image, index) => {
                    const aspectClass = image.aspectRatio
                        ? aspectRatioClasses[image.aspectRatio] ||
                          'aspect-square'
                        : 'aspect-square'

                    return (
                        <div key={index} className="break-inside-avoid">
                            <div
                                className={`${aspectClass} bg-gradient-to-br from-sage/40 to-stone/50 rounded-xl overflow-hidden`}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            {foldable && (
                <>
                    {!isUnfolded && (
                        <>
                            <div className="gallery-fold-gradient"></div>
                            <div className="gallery-see-more-btn">
                                <Button
                                    variant="sage"
                                    size="md"
                                    onClick={handleToggle}
                                >
                                    See more
                                </Button>
                            </div>
                        </>
                    )}

                    {isUnfolded && (
                        <button
                            onClick={handleToggle}
                            className="gallery-close-btn show bg-charcoal text-white px-6 py-3 text-base font-medium rounded-full hover:bg-charcoal/80 transition-colors flex items-center gap-2"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            Close Gallery
                        </button>
                    )}
                </>
            )}

            <style>{`
        .gallery-fold-gradient {
          pointer-events: none;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 7rem;
          z-index: 10;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #fff 90%);
        }
        .gallery-folded {
          position: relative;
          max-height: 60vh;
          overflow: hidden;
          transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (min-width: 640px) {
          .gallery-folded {
            max-height: 32vw;
          }
        }
        @media (min-width: 1024px) {
          .gallery-folded {
            max-height: 22vw;
          }
        }
        .gallery-see-more-btn {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 2.5rem;
          z-index: 20;
          pointer-events: auto;
        }
        .gallery-close-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 30;
          pointer-events: auto;
          display: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        @media (min-width: 768px) {
          .gallery-close-btn {
            top: 50%;
            bottom: auto;
            transform: translateY(-50%);
          }
        }
        .gallery-close-btn.show {
          display: flex;
        }
      `}</style>
        </div>
    )
}
