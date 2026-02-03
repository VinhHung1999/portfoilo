import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />

        {/* Placeholder sections for navigation */}
        <section
          id="projects"
          className="min-h-screen flex items-center justify-center"
        >
          <h2 className="text-4xl font-bold text-[color:var(--text-primary)]">
            Projects (Coming Soon)
          </h2>
        </section>

        <section
          id="skills"
          className="min-h-screen flex items-center justify-center"
        >
          <h2 className="text-4xl font-bold text-[color:var(--text-primary)]">
            Skills (Coming Soon)
          </h2>
        </section>

        <section
          id="contact"
          className="min-h-screen flex items-center justify-center"
        >
          <h2 className="text-4xl font-bold text-[color:var(--text-primary)]">
            Contact (Coming Soon)
          </h2>
        </section>
      </main>
    </>
  );
}
