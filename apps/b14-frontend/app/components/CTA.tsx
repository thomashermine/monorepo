export function CTA() {
    return (
        <section className="relative z-10 py-24 md:py-32 bg-corten">
            <div className="max-w-3xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
                    On construit ce lieu ensemble.
                </h2>
                <p className="text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
                    On est en pleine phase de conception. Chaque image ci-dessous
                    est commentable — cliquez, placez un pin, dites-nous ce que
                    vous en pensez. Vos retours comptent vraiment.
                </p>
                <a
                    href="#galerie"
                    className="inline-flex items-center gap-2 px-10 py-4 bg-white text-ink text-sm font-bold uppercase tracking-[0.15em] hover:bg-concrete transition-colors"
                >
                    Commenter les images ↓
                </a>
            </div>
        </section>
    );
}
