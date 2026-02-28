export function Solution() {
    return (
        <section className="py-24 md:py-32 bg-leaf-dark text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-honey mb-6">💡 La solution</p>
                <h2 className="font-[Fraunces] text-3xl md:text-5xl font-bold leading-tight mb-8">
                    Voici Frel'NON!
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto mb-16">
                    Un dispositif imaginé en Belgique pour rendre l'action simple, accessible, locale et responsable.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: "✅", label: "Simple", desc: "3 gestes, moins d'une minute" },
                        { icon: "✅", label: "Accessible", desc: "4,20 € le lot de 2 pièges" },
                        { icon: "✅", label: "Local", desc: "Conçu et fabriqué en Belgique" },
                        { icon: "✅", label: "Responsable", desc: "PLA d'origine végétale" },
                    ].map((item) => (
                        <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <span className="text-2xl block mb-3">{item.icon}</span>
                            <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                            <p className="text-white/60 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
