import Navigation from "@/components/layout/Navigation";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import HeroAbout from "@/components/sections/HeroAbout";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import { getPortfolioContent } from "@/lib/content";

// Force dynamic rendering so content is fetched at runtime from Blob
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <>
      <ScrollProgressBar />
      <Navigation />
      {/* Linear scroll for all devices - no pagination */}
      <main className="overflow-y-auto">
        {/* Section 1: Hero + About (Merged) */}
        <section>
          <HeroAbout data={content.personal} />
        </section>

        {/* Separator: Violet → Blue gradient line */}
        <div className="section-separator" />

        {/* Section 2: Experience */}
        <section>
          <Experience data={content.experience} />
        </section>

        {/* Separator */}
        <div className="section-separator" />

        {/* Section 3: Projects */}
        <section>
          <Projects data={content.projects} />
        </section>

        {/* Separator */}
        <div className="section-separator" />

        {/* Section 4: Skills */}
        <section>
          <Skills data={content.skills} />
        </section>

        {/* Separator */}
        <div className="section-separator" />

        {/* Section 5: Achievements */}
        <section>
          <Achievements data={content.achievements} />
        </section>

        {/* Separator */}
        <div className="section-separator" />

        {/* Section 6: Contact */}
        <section>
          <Contact data={content.personal} />
        </section>
      </main>
    </>
  );
}
