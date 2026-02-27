interface TextSectionProps {
    label?: string;
    title: string;
    body: string | React.ReactNode;
    id?: string;
    dark?: boolean;
}

export function TextSection({ label, title, body, id, dark = false }: TextSectionProps) {
    return (
        <section
            id={id}
            className={`relative z-10 py-32 md:py-44 ${dark ? "bg-ink" : "bg-white"}`}
        >
            <div className="max-w-3xl mx-auto px-6 text-center">
                {label && (
                    <p className={`text-xs uppercase tracking-[0.3em] mb-8 ${dark ? "text-corten" : "text-corten"}`}>
                        {label}
                    </p>
                )}
                <h2 className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-10 ${dark ? "text-white" : "text-ink"}`}>
                    {title}
                </h2>
                <div className="w-16 h-0.5 bg-corten mb-10 mx-auto" />
                <div className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${dark ? "text-steel-light" : "text-steel"}`}>
                    {body}
                </div>
            </div>
        </section>
    );
}
