"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { sectionVariants, itemVariants, viewportConfig } from "@/lib/animations";

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
  {
    id: "4",
    company: "Digital Agency",
    role: "Junior Developer",
    startDate: "Jan 2017",
    endDate: "May 2018",
    achievements: [
      "Built responsive websites for 15+ clients across various industries",
      "Maintained and updated legacy codebases with modern best practices",
      "Participated in code reviews and agile sprint ceremonies",
    ],
    techStack: ["JavaScript", "jQuery", "PHP", "MySQL", "Bootstrap"],
  },
  {
    id: "5",
    company: "Tech Solutions Group",
    role: "Junior Developer",
    startDate: "Jul 2015",
    endDate: "Dec 2016",
    achievements: [
      "Developed internal tools and dashboards for enterprise clients",
      "Collaborated with senior developers on ERP system integration",
      "Automated repetitive tasks saving 15+ hours per week",
    ],
    techStack: ["Java", "Spring", "Angular", "Oracle", "Git"],
  },
  {
    id: "6",
    company: "WebForge Studio",
    role: "Frontend Developer",
    startDate: "Feb 2014",
    endDate: "Jun 2015",
    achievements: [
      "Created pixel-perfect landing pages and marketing websites",
      "Implemented cross-browser compatible solutions for IE8+",
      "Worked with designers to translate mockups into functional interfaces",
    ],
    techStack: ["HTML5", "CSS3", "JavaScript", "SASS", "Grunt"],
  },
  {
    id: "7",
    company: "Code Academy",
    role: "Software Development Intern",
    startDate: "Aug 2013",
    endDate: "Jan 2014",
    achievements: [
      "Assisted in developing educational platform features and bug fixes",
      "Wrote unit tests achieving 80% code coverage for new modules",
      "Gained hands-on experience with agile methodologies and version control",
    ],
    techStack: ["Python", "Django", "JavaScript", "PostgreSQL", "Git"],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);

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
      className="flex flex-col relative py-16 md:py-0"
    >
      {/* 64px Spacer for Navigation - Desktop only for pagination */}
      <div className="hidden md:block md:h-16 md:flex-shrink-0" />

      {/* Content Area with Explicit Height on Desktop */}
      <div
        className="px-6 md:px-12 flex flex-col md:h-[calc(100vh-64px)]"
      >
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl w-full mx-auto flex flex-col"
        >
          {/* Header - Fixed at top */}
          <div className="text-center mb-8 flex-shrink-0">
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

          {/* Timeline - Scrollable on desktop, flows on mobile */}
          <div className="relative pl-8 md:pl-16 md:overflow-y-auto pr-2 pb-8 experience-scroll"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#7B337D transparent"
            }}>
          {/* Timeline Line */}
          <motion.div
            variants={lineVariants}
            className="absolute left-3 md:left-5 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          />

          {/* Experience Items */}
          <motion.div variants={sectionVariants} className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
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

        {/* Fade gradient at bottom - indicates more content */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)",
          }}
        />
      </motion.div>
      </div>
    </section>
  );
}
