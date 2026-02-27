interface ImageSectionProps {
    src: string;
    alt: string;
    caption?: string;
}

export function ImageSection({ src, alt, caption }: ImageSectionProps) {
    return (
        <section className="relative h-screen overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${src})` }}
            />
            <div className="absolute inset-0 bg-ink/20" />
            {caption && (
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-ink/70 to-transparent">
                    <p className="text-white/90 text-sm uppercase tracking-[0.2em]">
                        {caption}
                    </p>
                </div>
            )}
        </section>
    );
}
