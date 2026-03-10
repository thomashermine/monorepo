const cards = [
    {
        title: "Matérialité",
        description:
            "Corten, béton lissé, chêne clair, acier brossé. Chaque matériau est choisi pour son authenticité et sa patine dans le temps.",
        icon: "◼",
    },
    {
        title: "Fonctionnalité",
        description:
            "PAC air-eau, VMC double-flux, panneaux PV 10 kWc, smart home. La performance au service du confort.",
        icon: "⚡",
    },
    {
        title: "Héritage",
        description:
            "Préserver le caractère industriel du lieu. Les verrières, les volumes, les panneaux corten — tout ce qui fait l'identité du loft.",
        icon: "◈",
    },
];

export function Vision() {
    return (
        <section id="vision" className="py-24 md:py-32 bg-concrete/30">
            <div className="max-w-5xl mx-auto px-6">
                <h2 className="text-sm uppercase tracking-[0.2em] text-corten mb-16 text-center">
                    Vision
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className="bg-white p-8 border border-concrete hover:border-corten/30 transition-colors"
                        >
                            <span className="text-2xl text-corten block mb-4">
                                {card.icon}
                            </span>
                            <h3 className="text-lg font-bold text-ink mb-3">
                                {card.title}
                            </h3>
                            <p className="text-steel text-sm leading-relaxed">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
