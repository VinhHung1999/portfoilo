import Navigation from "@/components/layout/Navigation";
import HeroAbout, { QuickFacts } from "@/components/sections/HeroAbout";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import ChatFAB from "@/components/chat/ChatFAB";
import { getPortfolioContent } from "@/lib/content";
import { fontVars } from "./fonts";
import "./portfolio.css";

// Force dynamic rendering so content is fetched at runtime from Blob
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPortfolioContent();
  const featured = content.projects.find((p) => p.featured);

  return (
    <>
      <div className={`pf ${fontVars}`}>
        <Navigation name={content.personal.name} />
        <main>
          <HeroAbout data={content.personal} featured={featured} />
          <div className="sheet">
            <QuickFacts data={content.personal} />
            <Experience data={content.experience} />
            <Projects data={content.projects} />
            <Skills data={content.skills} />
            <Achievements data={content.achievements} />
            <Contact data={content.personal} />
          </div>
        </main>
      </div>
      {/* outside .pf so the chatbot keeps the global Tailwind styling */}
      <ChatFAB />
    </>
  );
}
