import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navigation />
      {/* Desktop: pagination scroll | Mobile: normal scroll */}
      <main className="h-screen overflow-y-scroll md:snap-y md:snap-mandatory">
        {/* Section 1: Hero */}
        <section className="md:h-screen md:snap-start md:snap-always">
          <Hero />
        </section>

        {/* Section 2: About */}
        <section className="md:h-screen md:snap-start md:snap-always">
          <About />
        </section>

        {/* Section 3: Experience */}
        <section className="md:h-screen md:snap-start md:snap-always">
          <Experience />
        </section>

        {/* Section 4: Projects */}
        <section className="md:h-screen md:snap-start md:snap-always">
          <Projects />
        </section>

        {/* Section 5: Skills */}
        <section className="md:h-screen md:snap-start md:snap-always">
          <Skills />
        </section>

        {/* Section 6: Contact */}
        <section className="md:h-screen md:snap-start md:snap-always">
          <Contact />
        </section>
      </main>
    </>
  );
}
