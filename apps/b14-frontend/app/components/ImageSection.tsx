interface ImageSectionProps {
    src: string;
    alt: string;
    caption?: string;
    fullBleed?: boolean;
}

export function ImageSection({ src, alt, caption, fullBleed = false }: ImageSectionProps) {
    return (
        <section className={`${fullBleed ? "" : "py-4 md:py-8"} bg-ink`}>
            <div className={fullBleed ? "" : "max-w-7xl mx-auto px-0 md:px-8"}>
                <div className="relative overflow-hidden">
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-auto block"
                        loading="lazy"
                    />
                </div>
                {caption && (
                    <p className="text-xs uppercase tracking-[0.15em] text-steel-light px-6 md:px-8 py-4">
                        {caption}
                    </p>
                )}
            </div>
        </section>
    );
}
