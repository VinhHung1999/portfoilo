"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#achievements", label: "Achievements" },
];

export default function Navigation({ name = "Hùng Phù" }: { name?: string }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // mobile menu: close on Escape, outside click, or when the viewport grows past the breakpoint
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 961px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <nav ref={navRef} className={`top${solid || open ? " solid" : ""}`} aria-label="Primary">
      <div className="w">
        <a className="logo" href="#hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" />
          {name}
        </a>
        <div className="links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <a className="btn" href="#contact">Contact →</a>
          <button
            ref={toggleRef}
            type="button"
            className={`menu-toggle${open ? " open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className={`mobile-menu${open ? " open" : ""}`} hidden={!open}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
            <span aria-hidden="true">→</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
