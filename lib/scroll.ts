/**
 * Smooth scroll utilities
 * Sprint 3: Polish & Performance
 */

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  element?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};
