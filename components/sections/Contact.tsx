"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { sectionVariants, itemVariants, viewportConfig } from "@/lib/animations";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);

  const socialLinks = [
    { name: "GitHub", icon: "📦", url: "https://github.com/hungson175" },
    { name: "LinkedIn", icon: "💼", url: "https://linkedin.com/in/hungpham" },
    { name: "Twitter", icon: "🐦", url: "https://twitter.com" },
    { name: "Email", icon: "📧", url: "mailto:hello@hungpham.dev" },
  ];

  return (
    <section
      id="contact"
      className="h-full flex flex-col py-16 md:py-32 md:items-center md:justify-center px-6 md:px-12"
    >
      <motion.div
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Get in Touch
          </h2>
          <p className="text-base" style={{ color: "var(--text-muted)" }}>
            Feel free to reach out for collaborations or opportunities
          </p>
        </div>

        {/* Contact Info - Centered */}
        <motion.div variants={itemVariants} className="space-y-8 max-w-md mx-auto">
          {/* Email */}
          <div className="text-center">
            <p
              className="text-sm mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              📧 Email
            </p>
            <a
              href="mailto:hello@hungpham.dev"
              className="text-xl font-medium hover:text-[#7B337D] transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              hello@hungpham.dev
            </a>
          </div>

          {/* Location */}
          <div className="text-center">
            <p
              className="text-sm mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              📍 Location
            </p>
            <p
              className="text-xl font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Ho Chi Minh City, Vietnam
            </p>
          </div>

          {/* Status */}
          <div className="text-center">
            <p
              className="text-sm mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              💼 Status
            </p>
            <p
              className="text-xl font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Open to opportunities
            </p>
          </div>

          <div
            className="border-t pt-8"
            style={{ borderColor: "var(--bg-tertiary)" }}
          >
            <p
              className="text-sm mb-6 text-center"
              style={{ color: "var(--text-muted)" }}
            >
              SOCIAL LINKS
            </p>

            <div className="flex gap-4 justify-center">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    backgroundColor: "#7B337D",
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                  }}
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            © 2024 Hung Pham
          </p>
        </div>
      </motion.div>
    </section>
  );
}
