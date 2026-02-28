export function Preorder() {
    return (
        <section id="precommande" className="py-24 md:py-32 bg-leaf-dark text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-honey mb-6">📦 Offre de lancement</p>
                <h2 className="font-[Fraunces] text-3xl md:text-5xl font-bold leading-tight mb-4">
                    Précommandez Frel'NON!
                </h2>
                <p className="text-white/60 mb-12 max-w-xl mx-auto">
                    La production est lancée après la phase de précommande afin de limiter le gaspillage, produire localement et ajuster les volumes.
                </p>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-md mx-auto mb-12">
                    <p className="text-sm text-white/50 uppercase tracking-wide mb-2">Lot de 2 Frel'NON!</p>
                    <p className="font-[Fraunces] text-5xl md:text-6xl font-black text-honey mb-2">
                        4,20 €
                    </p>
                    <p className="text-white/40 text-sm mb-8">TTC — Frais de livraison calculés à l'achat</p>
                    <p className="text-white/50 text-xs mb-8">
                        Les pots compatibles sont proposés séparément afin d'éviter toute production inutile.
                    </p>
                    <a
                        href="#precommande"
                        className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-honey text-bark text-sm font-bold uppercase tracking-[0.1em] rounded-lg hover:bg-honey-light transition-colors"
                    >
                        💚 Précommander maintenant
                    </a>
                </div>

                <div className="max-w-2xl mx-auto">
                    <h3 className="font-bold text-lg mb-4">🤝 Plus nous sommes nombreux, plus ça fonctionne</h3>
                    <p className="text-white/60 leading-relaxed">
                        Un piège seul change peu. Des milliers de jardins équipés changent l'échelle.
                        Chaque participation compte. Parlez-en à votre voisinage et organisez une commande groupée.
                    </p>
                </div>
            </div>
        </section>
    );
}
