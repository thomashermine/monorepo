export function Material() {
    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <img
                            src="/images/bee-flower.png"
                            alt="Abeille sur fleur"
                            className="w-full rounded-2xl shadow-xl"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-leaf mb-6">🌱 Un matériau plus responsable</p>
                        <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-ink leading-tight mb-8">
                            Fabriqué en PLA d'origine végétale.
                        </h2>
                        <div className="space-y-4 text-muted">
                            {[
                                "Réalisé à partir de matières naturelles",
                                "Résistant aux UV pour un usage extérieur",
                                "Durable pendant la saison d'utilisation",
                                "Biodégradable en filière industrielle de compostage contrôlée",
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <span className="text-leaf mt-0.5">✔</span>
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-sand rounded-xl text-sm text-muted">
                            <strong>⚠</strong> Le PLA ne se dégrade pas spontanément dans la nature ou dans un compost domestique.
                            Le produit doit être dirigé vers une filière adaptée en fin de vie.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
