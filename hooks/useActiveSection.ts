"use client";

import { useState, useEffect } from "react";

const SECTION_IDS = ["hero", "experience", "projects", "skills", "achievements", "contact"];

export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    // On mount: if URL has hash, scroll to it
    const hash = window.location.hash.slice(1);
    if (hash && SECTION_IDS.includes(hash)) {
      setActiveSection(hash);
      // Delay scroll to ensure DOM is ready
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    // IntersectionObserver for scroll spy
    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<string, IntersectionObserverEntry>();

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      // Pick the section closest to top of viewport
      if (visibleSections.size > 0) {
        let closest: string | null = null;
        let closestTop = Infinity;
        visibleSections.forEach((entry, id) => {
          const top = Math.abs(entry.boundingClientRect.top);
          if (top < closestTop) {
            closestTop = top;
            closest = id;
          }
        });
        if (closest) {
          setActiveSection((prev) => {
            if (prev !== closest) {
              // replaceState on scroll (don't pollute back history)
              const newHash = closest === "hero" ? "" : `#${closest}`;
              history.replaceState(null, "", newHash || window.location.pathname);
            }
            return closest!;
          });
        }
      }
    };

    // Mobile-friendly: lower threshold + less aggressive bottom margin
    // On 375px screen, -40% cuts 150px — too much for backward scroll detection
    const isMobile = window.innerWidth < 768;
    const threshold = isMobile ? 0.1 : 0.3;
    const rootMargin = isMobile ? "-64px 0px -20% 0px" : "-80px 0px -40% 0px";

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(handleIntersect, {
          threshold,
          rootMargin,
        });
        observer.observe(el);
        observers.push(observer);
      }
    });

    // popstate listener for browser back/forward
    const handlePopState = () => {
      const hash = window.location.hash.slice(1);
      if (hash && SECTION_IDS.includes(hash)) {
        setActiveSection(hash);
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setActiveSection("hero");
        document.getElementById("hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      observers.forEach((obs) => obs.disconnect());
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return activeSection;
}
