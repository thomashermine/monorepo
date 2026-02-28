export function ProductGallery() {
    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs uppercase tracking-[0.3em] text-leaf mb-6">📸 Le produit</p>
                    <h2 className="font-[Fraunces] text-3xl md:text-4xl font-bold text-ink">
                        Frel'NON! en images
                    </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src="/images/mockup-detail.png"
                            alt="Frel'NON! détail produit"
                            className="w-full h-72 object-cover"
                        />
                        <div className="p-4 bg-cream">
                            <p className="text-sm font-medium text-ink">Le dôme PLA</p>
                            <p className="text-xs text-muted">Impression 3D, fentes calibrées</p>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src="/images/mockup-packaging.png"
                            alt="Frel'NON! lot de 2"
                            className="w-full h-72 object-cover"
                        />
                        <div className="p-4 bg-cream">
                            <p className="text-sm font-medium text-ink">Lot de 2</p>
                            <p className="text-xs text-muted">Prêt à installer</p>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src="/images/mockup-lifestyle.png"
                            alt="Frel'NON! en situation"
                            className="w-full h-72 object-cover"
                        />
                        <div className="p-4 bg-cream">
                            <p className="text-sm font-medium text-ink">En situation</p>
                            <p className="text-xs text-muted">Dans votre jardin</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
