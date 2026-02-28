export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center bg-leaf-dark overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0">
                <img
                    src="/images/hero-product.png"
                    alt=""
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-leaf-dark via-leaf-dark/90 to-leaf-dark/40" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="inline-block px-3 py-1 bg-leaf/30 text-honey-light text-xs uppercase tracking-[0.2em] rounded-full mb-6">
                        🌿 Précommande ouverte
                    </div>
                    <h1 className="font-[Fraunces] text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-6">
                        Frel'<span className="text-honey">NON!</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-4 max-w-lg">
                        Le petit geste qui peut faire une grande différence pour la biodiversité.
                    </p>
                    <p className="text-base text-white/50 mb-8 max-w-md">
                        Un piège anti-frelon asiatique simple, local et responsable. Fabriqué en Belgique en PLA d'origine végétale.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="#precommande"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-honey text-bark text-sm font-bold uppercase tracking-[0.1em] rounded-lg hover:bg-honey-light transition-colors"
                        >
                            Précommander — 4,20 € le lot de 2
                        </a>
                        <a
                            href="#comment-ca-marche"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white text-sm uppercase tracking-[0.1em] rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Comment ça marche ↓
                        </a>
                    </div>
                </div>
                <div className="hidden md:flex justify-center">
                    <img
                        src="/images/hero-product.png"
                        alt="Frel'NON! piège anti-frelon"
                        className="w-80 lg:w-96 drop-shadow-2xl"
                    />
                </div>
            </div>
        </section>
    );
}
