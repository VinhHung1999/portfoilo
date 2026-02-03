import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
        {/* Section 1: Hero - 100vh snap point */}
        <section className="h-screen snap-start snap-always">
          <Hero />
        </section>

        {/* Section 2: About - 100vh snap point */}
        <section className="h-screen snap-start snap-always">
          <About />
        </section>

        {/* Section 3: Projects - 100vh snap point */}
        <section className="h-screen snap-start snap-always">
          <Projects />
        </section>

        {/* Section 4: Skills - 100vh snap point */}
        <section className="h-screen snap-start snap-always">
          <Skills />
        </section>

        {/* Section 5: Contact - 100vh snap point */}
        <section className="h-screen snap-start snap-always">
          <Contact />
        </section>
      </main>
    </>
  );
}
