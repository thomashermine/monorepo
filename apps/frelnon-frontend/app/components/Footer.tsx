export function Footer() {
    return (
        <footer className="py-12 bg-leaf-dark text-center">
            <div className="max-w-3xl mx-auto px-6">
                <p className="font-[Fraunces] text-xl font-bold text-white mb-2">
                    Frel'<span className="text-honey">NON!</span>
                </p>
                <p className="text-white/40 text-xs mb-6">
                    Le petit geste pour la biodiversité 🌿
                </p>
                <div className="w-8 h-px bg-white/20 mx-auto mb-6" />
                <p className="text-white/30 text-xs">
                    Un projet partiellement porté par{" "}
                    <span className="text-white/50">Crafted Signals</span>
                </p>
                <p className="text-white/20 text-xs mt-2">
                    © 2026 — Conçu et fabriqué en Belgique 🇧🇪
                </p>
            </div>
        </footer>
    );
}
