import { Hero } from "~/components/Hero";
import { Problem } from "~/components/Problem";
import { Solution } from "~/components/Solution";
import { HowItWorks } from "~/components/HowItWorks";
import { Material } from "~/components/Material";
import { Biodiversity } from "~/components/Biodiversity";
import { Preorder } from "~/components/Preorder";
import { Origin } from "~/components/Origin";
import { Manifesto } from "~/components/Manifesto";
import { Footer } from "~/components/Footer";

export default function Home() {
    return (
        <main>
            <Hero />
            <Problem />
            <Solution />
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
