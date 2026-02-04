"use client";

import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  const headerVariants = {
    top: {
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderColor: "rgba(0, 0, 0, 0)",
    },
    scrolled: {
      backgroundColor: "rgba(16, 16, 16, 0.8)",
      backdropFilter: "blur(12px)",
      borderColor: "rgba(26, 26, 26, 1)",
    },
  };

  const mobileMenuVariants = {
    closed: { x: "100%" },
    open: {
      x: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  const hamburgerTop = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 6 },
  };
  const hamburgerMid = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };
  const hamburgerBot = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -6 },
  };

  return (
    <>
      <motion.header
        variants={headerVariants}
        animate={isScrolled ? "scrolled" : "top"}
        className="fixed top-0 left-0 right-0 z-50 h-16 border-b transition-all"
        style={{
          backdropFilter: isScrolled ? "blur(12px)" : "none",
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="text-xl font-bold hover:gradient-text transition-all"
            style={{ color: "var(--text-primary)" }}
            whileHover={{ scale: 1.05 }}
          >
            HP
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wider transition-colors relative group"
                style={{
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#a34da6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                {link.name}
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: "#7B337D" }}
                />
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <motion.button
            className="md:hidden flex flex-col gap-1.5 w-6 h-6 relative z-50"
            onClick={() => setIsOpen(!isOpen)}
            animate={isOpen ? "open" : "closed"}
          >
            <motion.span
              variants={hamburgerTop}
              className="w-full h-0.5 origin-center"
              style={{ backgroundColor: "var(--text-primary)" }}
            />
            <motion.span
              variants={hamburgerMid}
              className="w-full h-0.5"
              style={{ backgroundColor: "var(--text-primary)" }}
            />
            <motion.span
              variants={hamburgerBot}
              className="w-full h-0.5 origin-center"
              style={{ backgroundColor: "var(--text-primary)" }}
            />
          </motion.button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        variants={mobileMenuVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed top-0 right-0 bottom-0 w-80 z-40 md:hidden flex flex-col items-center justify-center gap-8 px-8"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {navLinks.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.href}
            variants={menuItemVariants}
            transition={{ delay: index * 0.1 }}
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold transition-all"
            style={{ color: "var(--text-primary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#a34da6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
            }}
          >
            {link.name}
          </motion.a>
        ))}
      </motion.div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
