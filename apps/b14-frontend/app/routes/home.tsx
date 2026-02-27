import { Hero } from "~/components/Hero";
import { Project } from "~/components/Project";
import { Vision } from "~/components/Vision";
import { Gallery } from "~/components/Gallery";
import { Footer } from "~/components/Footer";

export default function Home() {
    return (
        <main>
            <Hero />
            <Project />
            <Vision />
            <Gallery />
            <Footer />
        </main>
    );
}
