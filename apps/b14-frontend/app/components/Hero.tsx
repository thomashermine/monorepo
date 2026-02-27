export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
            {/* Architectural grid lines */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                <div className="absolute left-1/4 top-0 bottom-0 w-px bg-ink" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ink" />
                <div className="absolute left-3/4 top-0 bottom-0 w-px bg-ink" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-ink" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-ink" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
                <img
                    src="/images/b14-logo.png"
                    alt="B14 — Le Loft"
                    className="w-48 md:w-64 mb-4"
                />
                <div className="w-24 h-0.5 bg-corten" />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-ink">
                    B14 — Le Loft
                </h1>
                <p className="text-lg md:text-xl text-steel max-w-xl">
                    400m² de loft industriel. Schaerbeek, Bruxelles.
                </p>
                <div className="w-16 h-0.5 bg-corten mt-4" />
                <a
                    href="#projet"
                    className="mt-8 text-sm uppercase tracking-[0.2em] text-steel hover:text-corten transition-colors"
                >
                    Découvrir ↓
                </a>
            </div>
        </section>
    );
}
