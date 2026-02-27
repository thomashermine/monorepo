interface TextSectionProps {
    label?: string;
    title: string;
    body: string | React.ReactNode;
    align?: "left" | "center";
    id?: string;
}

export function TextSection({ label, title, body, align = "center", id }: TextSectionProps) {
    const isCenter = align === "center";
    return (
        <section id={id} className="py-24 md:py-36 bg-white">
            <div className={`max-w-3xl mx-auto px-6 ${isCenter ? "text-center" : ""}`}>
                {label && (
                    <p className="text-sm uppercase tracking-[0.2em] text-corten mb-6">
                        {label}
                    </p>
                )}
                <h2 className="text-3xl md:text-5xl font-bold text-ink leading-tight mb-8">
                    {title}
                </h2>
                <div className="w-16 h-0.5 bg-corten mb-8 mx-auto" />
                <div className="text-lg md:text-xl leading-relaxed text-steel">
                    {body}
                </div>
            </div>
        </section>
    );
}
