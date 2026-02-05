import Navigation from "@/components/layout/Navigation";
import HeroAbout from "@/components/sections/HeroAbout";
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
        {/* Section 1: Hero + About (Merged) */}
        <section>
          <HeroAbout />
        </section>

        {/* Separator: Violet → Blue gradient line */}
        <div className="section-separator" />

        {/* Section 2: Experience */}
        <section>
          <Experience />
        </section>

        {/* Separator */}
        <div className="section-separator" />

        {/* Section 3: Projects */}
        <section>
          <Projects />
        </section>

        {/* Separator */}
        <div className="section-separator" />

        {/* Section 4: Skills */}
        <section>
          <Skills />
        </section>

        {/* Separator */}
        <div className="section-separator" />

        {/* Section 5: Contact */}
        <section>
          <Contact />
        </section>
      </main>
    </>
  );
}
