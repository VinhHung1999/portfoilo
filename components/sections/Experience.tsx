"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null; // null = "Present"
  achievements: string[];
  techStack: string[];
}

const experiences: Experience[] = [
  {
    id: "1",
    company: "Tech Company Inc",
    role: "Senior Full-Stack Developer",
    startDate: "Jan 2022",
    endDate: null,
    achievements: [
      "Led development of AI-powered multi-agent system serving 10,000+ users",
      "Architected microservices infrastructure reducing deployment time by 60%",
      "Mentored team of 5 junior developers and established best practices",
    ],
    techStack: ["React", "Next.js", "TypeScript", "Python", "AWS", "PostgreSQL"],
  },
  {
    id: "2",
    company: "Innovation Labs",
    role: "Full-Stack Developer",
    startDate: "Mar 2020",
    endDate: "Dec 2021",
    achievements: [
      "Built real-time collaboration platform with WebSocket integration",
      "Implemented CI/CD pipeline increasing deployment frequency by 3x",
      "Optimized database queries reducing response time by 40%",
    ],
    techStack: ["React", "Node.js", "FastAPI", "PostgreSQL", "Redis", "Docker"],
  },
  {
    id: "3",
    company: "StartUp Ventures",
    role: "Software Developer",
    startDate: "Jun 2018",
    endDate: "Feb 2020",
    achievements: [
      "Developed core features for SaaS product from MVP to production",
      "Integrated third-party APIs and payment processing systems",
      "Collaborated with design team to implement responsive UI components",
    ],
    techStack: ["Vue.js", "Python", "Flask", "MongoDB", "Stripe"],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
    margin: "-100px",
  });

  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const lineVariants = {
    hidden: { scaleY: 0, originY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="experience"
      className="h-full flex items-center justify-center px-6 md:px-12 overflow-hidden"
    >
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-4xl w-full py-12"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Experience
          </h2>
          <p className="text-base" style={{ color: "var(--text-muted)" }}>
            My professional journey
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-8 md:pl-16">
          {/* Timeline Line */}
          <motion.div
            variants={lineVariants}
            className="absolute left-3 md:left-5 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          />

          {/* Experience Items */}
          <motion.div variants={timelineVariants} className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                variants={cardVariants}
                className="relative"
              >
                {/* Timeline Dot */}
                <motion.div
                  variants={dotVariants}
                  whileHover={{ scale: 1.2 }}
                  className="absolute -left-[26px] md:-left-[34px] top-6 w-3 h-3 rounded-full border-4"
                  style={{
                    backgroundColor: "#7B337D",
                    borderColor: "var(--bg-primary)",
                  }}
                />

                {/* Experience Card */}
                <motion.div
                  whileHover={{
                    borderColor: "#7B337D",
                    boxShadow: "0 0 20px rgba(123, 51, 125, 0.1)",
                    transition: { duration: 0.2 },
                  }}
                  className="rounded-2xl border p-6 md:p-8"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--bg-tertiary)",
                  }}
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3
                        className="text-lg md:text-xl font-bold uppercase tracking-wide mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {exp.company}
                      </h3>
                      <p
                        className="text-base font-medium"
                        style={{ color: "#7B337D" }}
                      >
                        {exp.role}
                      </p>
                    </div>
                    <p
                      className="text-sm mt-2 md:mt-0"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                  </div>

                  {/* Achievements */}
                  <ul className="space-y-2 mb-6">
                    {exp.achievements.map((achievement, idx) => (
                      <li
                        key={idx}
                        className="text-sm md:text-base flex items-start gap-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span style={{ color: "#7B337D" }}>•</span>
                        <span className="leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {exp.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          color: "#7B337D",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
