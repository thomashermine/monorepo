export function Biodiversity() {
    return (
        <section className="relative h-[70vh] overflow-hidden">
            <img
                src="/images/biodiversity.png"
                alt="Jardin biodiversité"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-leaf-dark/80 via-leaf-dark/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                <div className="max-w-3xl">
                    <h2 className="font-[Fraunces] text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                        Pensé pour la biodiversité.
                    </h2>
                    <p className="text-lg text-white/70 max-w-xl">
                        Frel'NON! vise à favoriser la capture des frelons tout en limitant l'impact sur les autres insectes. Contrôle régulier, positionnement adapté, libération des insectes non ciblés.
                    </p>
                </div>
            </div>
        </section>
    );
}
