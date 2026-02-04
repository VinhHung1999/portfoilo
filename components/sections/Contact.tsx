"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { sectionVariants, itemVariants, viewportConfig } from "@/lib/animations";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you for your message! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const socialLinks = [
    { name: "GitHub", icon: "📦", url: "https://github.com/hungson175" },
    { name: "LinkedIn", icon: "💼", url: "https://linkedin.com/in/hungpham" },
    { name: "Twitter", icon: "🐦", url: "https://twitter.com" },
    { name: "Email", icon: "📧", url: "mailto:hello@hungpham.dev" },
  ];

  return (
    <section
      id="contact"
      className="h-full flex items-center justify-center px-6 md:px-12"
    >
      <motion.div
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-6xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Get in Touch
          </h2>
          <p className="text-base" style={{ color: "var(--text-muted)" }}>
            Have a project in mind? Let&apos;s talk.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-3xl space-y-6"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs uppercase tracking-wider font-medium mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#7B337D";
                    e.target.style.boxShadow = "0 0 0 3px rgba(123, 51, 125, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--bg-tertiary)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-wider font-medium mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#7B337D";
                    e.target.style.boxShadow = "0 0 0 3px rgba(123, 51, 125, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--bg-tertiary)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs uppercase tracking-wider font-medium mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border outline-none transition-all resize-y"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    minHeight: "120px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#7B337D";
                    e.target.style.boxShadow = "0 0 0 3px rgba(123, 51, 125, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--bg-tertiary)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{
                  backgroundColor: "#a34da6",
                  boxShadow: "0 0 20px rgba(123, 51, 125, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: "#7B337D",
                  color: "#ffffff",
                }}
              >
                Send Message →
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Email */}
            <div>
              <p
                className="text-sm mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                📧 Email
              </p>
              <p
                className="text-lg font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                hello@hungpham.dev
              </p>
            </div>

            {/* Location */}
            <div>
              <p
                className="text-sm mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                📍 Location
              </p>
              <p
                className="text-lg font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Ho Chi Minh City, Vietnam
              </p>
            </div>

            {/* Status */}
            <div>
              <p
                className="text-sm mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                💼 Status
              </p>
              <p
                className="text-lg font-medium"
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
                className="text-sm mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                SOCIAL LINKS
              </p>

              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      backgroundColor: "#7B337D",
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
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
        </div>

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
