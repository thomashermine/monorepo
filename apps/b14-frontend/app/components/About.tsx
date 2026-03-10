export function About() {
    return (
        <section id="about" className="py-24 md:py-36 bg-white">
            <div className="max-w-3xl mx-auto px-6 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-corten mb-6">
                    Le Projet
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-ink leading-tight mb-8">
                    Thomas & Caroline
                </h2>
                <div className="w-16 h-0.5 bg-corten mb-10 mx-auto" />
                <div className="text-lg leading-relaxed text-steel space-y-6 text-left md:text-center">
                    <p>
                        Thomas, 36 ans, entrepreneur tech et Head of Tech dans la mobilité publique belge.
                        Caroline, journaliste spécialisée lifestyle et voyage. Ensemble depuis 2018,
                        ils partagent le goût des espaces qui ont du caractère et des projets
                        qui se construisent avec intention.
                    </p>
                    <p>
                        B14 est leur projet de vie : transformer un loft industriel de 400m²
                        en un lieu qui leur ressemble. Pas une rénovation cosmétique —
                        une réécriture complète, dans le respect de l'ADN du bâtiment.
                    </p>
                    <p>
                        Co-fondateurs de{" "}
                        <span className="text-ink font-medium">The View Lodge</span>, un
                        lodge wellness en forêt ardennaise, ils abordent B14 avec la même
                        philosophie : chaque détail compte, chaque matériau raconte une histoire.
                    </p>
                </div>
            </div>
        </section>
    );
}
