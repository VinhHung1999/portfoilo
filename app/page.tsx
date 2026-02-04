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
      {/* Linear scroll for all devices - no pagination */}
      <main className="overflow-y-auto">
        {/* Section 1: Hero */}
        <section>
          <Hero />
        </section>

        {/* Section 2: About */}
        <section>
          <About />
        </section>

        {/* Section 3: Experience */}
        <section>
          <Experience />
        </section>

        {/* Section 4: Projects */}
        <section>
          <Projects />
        </section>

        {/* Section 5: Skills */}
        <section>
          <Skills />
        </section>

        {/* Section 6: Contact */}
        <section>
          <Contact />
        </section>
      </main>
    </>
  );
}
