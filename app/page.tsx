import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

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
        <section
          id="projects"
          className="h-screen snap-start snap-always flex items-center justify-center"
        >
          <h2
            className="text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Projects (Coming Soon)
          </h2>
        </section>

        {/* Section 4: Skills - 100vh snap point */}
        <section
          id="skills"
          className="h-screen snap-start snap-always flex items-center justify-center"
        >
          <h2
            className="text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Skills (Coming Soon)
          </h2>
        </section>

        {/* Section 5: Contact - 100vh snap point */}
        <section
          id="contact"
          className="h-screen snap-start snap-always flex items-center justify-center"
        >
          <h2
            className="text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Contact (Coming Soon)
          </h2>
        </section>
      </main>
    </>
  );
}
