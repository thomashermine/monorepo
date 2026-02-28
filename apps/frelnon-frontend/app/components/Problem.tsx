export function Problem() {
    return (
        <section id="constat" className="py-24 md:py-32 bg-cream">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-leaf mb-6">🐝 Le constat</p>
                        <h2 className="font-[Fraunces] text-3xl md:text-5xl font-bold text-ink leading-tight mb-8">
                            Une seule reine peut fonder des milliers d'individus.
                        </h2>
                        <p className="text-lg text-muted leading-relaxed mb-6">
                            Le frelon asiatique s'est progressivement installé en Belgique et dans toute l'Europe occidentale.
                            Il exerce une pression reconnue sur les pollinisateurs, notamment les abeilles, essentielles à nos écosystèmes et à notre alimentation.
                        </p>
                        <p className="text-lg text-muted leading-relaxed">
                            Chaque printemps, un phénomène discret mais dramatique se répète dans nos jardins. Et pourtant, à ce stade, <strong className="text-ink">tout peut encore être limité</strong>.
                        </p>
                    </div>
                    <div className="relative">
                        <img
                            src="/images/asian-hornet.png"
                            alt="Frelon asiatique"
                            className="w-full rounded-2xl shadow-xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
