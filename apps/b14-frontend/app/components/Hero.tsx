export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-ink overflow-hidden">
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white" />
                <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-4xl">
                <img
                    src="/images/b14-logo.png"
                    alt="B14"
                    className="w-32 md:w-40 mb-2 invert brightness-200"
                />
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-none">
                    B14
                </h1>
                <p className="text-xl md:text-2xl text-steel-light font-light tracking-wide">
                    Le Loft
                </p>
                <div className="w-20 h-0.5 bg-corten my-4" />
                <p className="text-base md:text-lg text-steel max-w-lg leading-relaxed">
                    400m² de loft industriel à Schaerbeek.
                    <br />
                    En phase de conception — on veut vos avis.
                </p>
                <a
                    href="#galerie"
                    className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-corten text-white text-sm font-bold uppercase tracking-[0.15em] hover:bg-corten-dark transition-colors"
                >
                    Donner mon avis →
                </a>
                <a
                    href="#projet"
                    className="mt-4 text-xs uppercase tracking-[0.2em] text-steel/50 hover:text-steel transition-colors"
                >
                    Découvrir le projet ↓
                </a>
            </div>
        </section>
    );
}
