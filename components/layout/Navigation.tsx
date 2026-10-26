"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#achievements", label: "Achievements" },
];

export default function Navigation({ name = "Hùng Phù" }: { name?: string }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`top${solid ? " solid" : ""}`} aria-label="Primary">
      <div className="w">
        <a className="logo" href="#hero">
          <b>HP</b>
          {name}
        </a>
        <div className="links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <a className="btn" href="#contact">Contact →</a>
        </div>
      </div>
    </nav>
  );
}
