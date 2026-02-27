export function Footer() {
    return (
        <footer className="py-16 bg-ink text-center">
            <div className="max-w-3xl mx-auto px-6">
                <div className="w-12 h-0.5 bg-corten mx-auto mb-8" />
                <p className="text-white/90 text-sm font-bold tracking-wide mb-2">
                    B14 — Le Loft
                </p>
                <p className="text-steel text-xs mb-8">
                    Rue Jan Blockx 14, 1030 Schaerbeek, Bruxelles
                </p>
                <div className="w-8 h-px bg-steel/30 mx-auto mb-8" />
                <p className="text-steel/50 text-xs">
                    Un projet partiellement porté par{" "}
                    <span className="text-steel/70">Crafted Signals</span>
                </p>
                <p className="text-steel/30 text-xs mt-2">
                    © 2026
                </p>
            </div>
        </footer>
    );
}
