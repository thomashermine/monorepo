export function Manifesto() {
    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="max-w-3xl mx-auto px-6 text-center">
                <h2 className="font-[Fraunces] text-3xl md:text-5xl font-bold text-ink leading-tight mb-10">
                    🌿 Dire Frel'NON!<br />C'est dire oui.
                </h2>
                <div className="grid sm:grid-cols-3 gap-6 mb-12">
                    {[
                        { emoji: "🐝", label: "Aux pollinisateurs" },
                        { emoji: "🌻", label: "Aux jardins vivants" },
                        { emoji: "🤝", label: "À l'action collective" },
                    ].map((item) => (
                        <div key={item.label} className="bg-cream rounded-xl p-6">
                            <span className="text-3xl block mb-3">{item.emoji}</span>
                            <p className="font-bold text-ink">{item.label}</p>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-sand rounded-xl text-sm text-muted max-w-xl mx-auto">
                    <p className="font-bold text-ink mb-2">⚠ Utilisation responsable</p>
                    <p>
                        Frel'NON! ne remplace pas les interventions professionnelles.
                        En cas de nid : ne pas intervenir, contacter les services compétents.
                    </p>
                </div>
            </div>
        </section>
    );
}
