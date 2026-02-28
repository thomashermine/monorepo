import { Hero } from "~/components/Hero";
import { Problem } from "~/components/Problem";
import { Solution } from "~/components/Solution";
import { ProductGallery } from "~/components/ProductGallery";
import { HowItWorks } from "~/components/HowItWorks";
import { Material } from "~/components/Material";
import { Biodiversity } from "~/components/Biodiversity";
import { Origin } from "~/components/Origin";
import { Preorder } from "~/components/Preorder";
import { Manifesto } from "~/components/Manifesto";
import { Footer } from "~/components/Footer";

export default function Home() {
    return (
        <main>
            <Hero />
            <Problem />
            <Solution />
            <ProductGallery />
            <HowItWorks />
            <Material />
            <Biodiversity />
            <Origin />
            <Preorder />
            <Manifesto />
            <Footer />
        </main>
    );
}
