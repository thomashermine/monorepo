interface ImageSectionProps {
    src: string;
    alt: string;
    caption?: string;
}

export function ImageSection({ src, alt, caption }: ImageSectionProps) {
    return (
        <section className="relative h-screen overflow-hidden">
            {/* Sticky image that stays in view */}
            <div className="sticky top-0 h-screen w-full">
                <img
                    src={src}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
                {caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <p className="text-white/70 text-xs uppercase tracking-[0.25em]">
                            {caption}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
