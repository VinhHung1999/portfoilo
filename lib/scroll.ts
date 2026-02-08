/**
 * Smooth scroll utilities
 * Sprint 3: Polish & Performance
 * Sprint 10: URL hash sync
 */

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (!element) return;

  // pushState for deliberate nav clicks (adds to back history)
  const newHash = sectionId === "hero" ? "" : `#${sectionId}`;
  history.pushState(null, "", newHash || window.location.pathname);

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};
