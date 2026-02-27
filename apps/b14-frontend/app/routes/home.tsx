import { Hero } from "~/components/Hero";
import { TextSection } from "~/components/TextSection";
import { ImageSection } from "~/components/ImageSection";
import { About } from "~/components/About";
import { Vision } from "~/components/Vision";
import { Gallery } from "~/components/Gallery";
import { Footer } from "~/components/Footer";

export default function Home() {
    return (
        <main>
            <Hero />

            <TextSection
                id="projet"
                label="Le Projet"
                title="400m² repensés pour une nouvelle vie"
                body={
                    <>
                        Un loft industriel construit en 1963, rénové en 2003, et
                        aujourd'hui repensé de fond en comble. Béton lissé, acier
                        corten, verrières — l'ADN du lieu est préservé et sublimé.
                        <br /><br />
                        Chaque décision suit un principe&nbsp;:{" "}
                        <em className="text-corten">less but better</em>.
                    </>
                }
            />

            <ImageSection
                src="/images/b14-plan.png"
                alt="Plan d'aménagement"
                caption="Proposition d'aménagement"
                fullBleed
            />

            <TextSection
                label="La Cuisine"
                title="Le cœur du loft"
                body="Un îlot central en chêne et acier brossé, ouvert sur le living. L'espace est pensé pour recevoir, cuisiner ensemble, vivre."
            />

            <ImageSection
                src="/images/b14-cuisine-v4.png"
                alt="Cuisine — Projection"
                caption="Cuisine — Projection v1"
            />

            <ImageSection
                src="/images/b14-cuisine-v5.png"
                alt="Cuisine — Variante"
                caption="Cuisine — Variante matériaux"
            />

            <TextSection
                label="La Salle de bain"
                title="Matière brute, confort absolu"
                body="Tadelakt, chêne, lignes épurées. Un espace où chaque matériau a sa raison d'être."
            />

            <ImageSection
                src="/images/b14-sdb-beige.png"
                alt="Salle de bain — Option beige"
                caption="Salle de bain — Option beige"
            />

            <ImageSection
                src="/images/b14-sdb-tasseaux.png"
                alt="Salle de bain — Tasseaux chêne"
                caption="Salle de bain — Tasseaux chêne"
            />

            <About />

            <Vision />

            <Gallery />

            <Footer />
        </main>
    );
}
