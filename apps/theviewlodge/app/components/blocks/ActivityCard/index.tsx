import React from 'react'

export interface ActivityCardProps {
    image: string
    badge: string
    title: string
    subtitle: string
    description: string
    location: string
    locationUrl?: string
    imageAlt?: string
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
    image,
    badge,
    title,
    subtitle,
    description,
    location,
    locationUrl,
    imageAlt,
}) => {
    return (
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row-reverse">
                {/* Image Section */}
                <div className="lg:w-1/2 relative overflow-hidden">
                    <div
                        className="h-80 lg:h-96 bg-cover bg-center"
                        style={{ backgroundImage: `url('${image}')` }}
                    />
                    <div className="absolute top-6 left-6">
                        <div className="bg-sage/90 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium text-lg shadow-lg">
                            {badge}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 p-12 flex flex-col justify-center">
                    <h3 className="text-4xl font-light mb-4 font-baskerville text-charcoal">
                        {title}
                    </h3>
                    <p className="text-xl text-sage mb-6 font-medium tracking-wide">
                        {subtitle}
                    </p>
                    <p className="text-stone text-lg leading-relaxed mb-8">
                        {description}
                    </p>
                    <div className="flex items-center gap-3">
                        <svg
                            className="w-6 h-6 text-sage"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <span className="text-stone font-medium text-lg">
                            {locationUrl ? (
                                <a
                                    href={locationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-charcoal transition-colors"
                                >
                                    {location}
                                </a>
                            ) : (
                                location
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
