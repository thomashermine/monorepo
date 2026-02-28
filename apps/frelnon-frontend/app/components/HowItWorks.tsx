export function HowItWorks() {
    const steps = [
        {
            num: "1",
            title: "Fixez",
            desc: "Attachez Frel'NON! sur un pot compatible.",
            emoji: "🫙",
        },
        {
            num: "2",
            title: "Appâtez",
            desc: "Ajoutez le mélange : 1/3 bière brune, 1/3 vin blanc, 1/3 sirop. Le vin blanc limite l'attraction des abeilles.",
            emoji: "🍯",
        },
        {
            num: "3",
            title: "Placez",
            desc: "Installez le dispositif dans votre jardin. Vous participez immédiatement à l'effort collectif.",
            emoji: "🌿",
        },
    ];

    return (
        <section id="comment-ca-marche" className="py-24 md:py-32 bg-cream">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs uppercase tracking-[0.3em] text-leaf mb-6">⚙️ Comment ça marche ?</p>
                    <h2 className="font-[Fraunces] text-3xl md:text-5xl font-bold text-ink">
                        3 gestes. Moins d'une minute.
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step) => (
                        <div key={step.num} className="bg-white rounded-2xl p-8 text-center shadow-sm">
                            <span className="text-4xl block mb-4">{step.emoji}</span>
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-leaf text-white font-bold text-lg mb-4">
                                {step.num}
                            </div>
                            <h3 className="font-bold text-xl text-ink mb-3">{step.title}</h3>
                            <p className="text-muted leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 max-w-2xl mx-auto">
                    <img
                        src="/images/how-it-works.png"
                        alt="Étapes d'installation"
                        className="w-full rounded-2xl shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
}
