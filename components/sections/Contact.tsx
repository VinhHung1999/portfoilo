"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, MapPin, Briefcase, Github, Linkedin, Twitter } from "lucide-react";
import { sectionVariants, itemVariants, viewportConfig } from "@/lib/animations";
import { personalInfo as defaultData } from "@/data/personal";
import type { PersonalInfo } from "@/data/types";

export default function Contact({ data }: { data?: PersonalInfo }) {
  const personalInfo = data ?? defaultData;
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);

  // Map icon names to components
  const iconMap: Record<string, typeof Github> = {
    Github,
    Linkedin,
    Twitter,
    Mail,
  };

  const socialLinks = personalInfo.socialLinks.map((link) => ({
    name: link.name,
    icon: iconMap[link.icon],
    url: link.url,
  }));

  return (
    <section
      id="contact"
      className="flex flex-col py-16 md:py-20 md:items-center md:justify-center px-6 md:px-12"
      style={{ backgroundColor: "var(--bg-alternate)" }}
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-4 h-4" style={{ color: "var(--cta)" }} />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Email
              </p>
            </div>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-xl font-medium transition-colors cursor-pointer"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--cta)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
              }}
            >
              {personalInfo.email}
            </a>
          </div>

          {/* Location */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="w-4 h-4" style={{ color: "var(--cta)" }} />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Location
              </p>
            </div>
            <p
              className="text-xl font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {personalInfo.location}
            </p>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Briefcase className="w-4 h-4" style={{ color: "var(--cta)" }} />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Status
              </p>
            </div>
            <p
              className="text-xl font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {personalInfo.status}
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
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--cta)";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                    title={social.name}
                  >
                    <IconComponent className="w-6 h-6" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} {personalInfo.name}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
