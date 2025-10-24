import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()
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
        '16/10': 'aspect-[16/10]',
        '2/3': 'aspect-[2/3]',
        '3/2': 'aspect-[3/2]',
        '3/4': 'aspect-[3/4]',
        '3/5': 'aspect-[3/5]',
        '4/3': 'aspect-[4/3]',
        '4/5': 'aspect-[4/5]',
        '5/3': 'aspect-[5/3]',
        square: 'aspect-square',
    }

    return (
        <div className="relative">
            <div
                className={`gallery-wrapper ${foldable && !isUnfolded ? 'gallery-wrapper-folded' : ''}`}
            >
                {foldable && isUnfolded && (
                    <button
                        onClick={handleToggle}
                        className="gallery-close-btn show bg-charcoal text-white px-6 py-3 text-base font-medium rounded-full hover:bg-charcoal/80 transition-colors flex items-center gap-2 cursor-pointer"
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
                        {t('gallery.closeGallery')}
                    </button>
                )}

                <div
                    id="gallery-masonry"
                    className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                >
                    {images.map((image, index) => {
                        const aspectClass = image.aspectRatio
                            ? aspectRatioClasses[image.aspectRatio] ||
                              'aspect-square'
                            : 'aspect-square'

                        return (
                            <div
                                key={`${image.src}-${index}`}
                                className="break-inside-avoid"
                            >
                                <div
                                    className={`${aspectClass} bg-gradient-to-br from-sage/40 to-stone/50 rounded-xl overflow-hidden`}
                                >
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {foldable && !isUnfolded && (
                    <div className="gallery-fold-overlay"></div>
                )}
            </div>

            {foldable && !isUnfolded && (
                <div className="gallery-see-more-btn">
                    <Button variant="sage" size="md" onClick={handleToggle}>
                        {t('gallery.seeMore')}
                    </Button>
                </div>
            )}

            <style>{`
        .gallery-wrapper {
          position: relative;
        }
        .gallery-wrapper-folded {
          max-height: 60vh;
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .gallery-wrapper-folded {
            max-height: 38vw;
          }
        }
        @media (min-width: 1024px) {
          .gallery-wrapper-folded {
            max-height: 28vw;
          }
        }
        .gallery-fold-overlay {
          pointer-events: none;
          position: absolute;
          left: 0;
          right: 0;
          height: 16rem;
          bottom: 0;
          z-index: 10;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 30%, rgba(255, 255, 255, 0.85) 60%, #fff 100%);
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
          position: sticky;
          top: 90vh;
          z-index: 30;
          pointer-events: auto;
          display: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          margin-left: auto;
          margin-right: auto;
          width: fit-content;
        }
        .gallery-close-btn.show {
          display: flex;
        }
      `}</style>
        </div>
    )
}
