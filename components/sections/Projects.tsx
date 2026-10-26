"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { projects as defaultData } from "@/data/projects";
import type { Project } from "@/data/types";

type Filter = "all" | Project["category"];
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Web" },
  { key: "mobile", label: "Mobile" },
  { key: "ai", label: "AI" },
];

function hostname(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function Featured({ project }: { project: Project }) {
  const host = hostname(project.liveUrl);
  const words = project.title.split(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");
  const roleLine = [project.role, host].filter(Boolean).join(" · ");

  return (
    <Reveal className="tv">
      <div className="tv-top">
        <div className="copy">
          <span className="tv-eye">{`Side project${project.period ? ` · ${project.period}` : ""}`}</span>
          <h3>
            {head && (
              <>
                {head}
                <br />
              </>
            )}
            <span>{tail}</span>
          </h3>
          {roleLine && <div className="role">{roleLine}</div>}
          <p>{project.fullDescription}</p>
        </div>
      </div>
      {project.stats && project.stats.length > 0 && (
        <div className="tv-stats">
          {project.stats.map((s) => (
            <div key={s.label}>
              <b>
                {s.value}
                {s.plus && <sup>+</sup>}
              </b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      )}
      {project.highlights && project.highlights.length > 0 && (
        <div className="tv-wins">
          {project.highlights.map((h) => (
            <div className="tv-win" key={h.title}>
              <span className="n">{h.label}</span>
              <h5>{h.title}</h5>
              <p>{h.body}</p>
            </div>
          ))}
        </div>
      )}
      <div className="tv-foot">
        <div className="chips">
          {project.techStack.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        {project.liveUrl && (
          <a className="tv-btn" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            Visit →
          </a>
        )}
      </div>
    </Reveal>
  );
}

function Flow({ workflow }: { workflow: NonNullable<Project["workflow"]> }) {
  const words = workflow.title.split(" ");
  const tail = words.slice(-2).join(" ");
  const head = words.slice(0, -2).join(" ");
  return (
    <Reveal className="flow">
      <div>
        <span className="kick">How I built it</span>
        <h4>
          {head} <em>{tail}</em>
        </h4>
      </div>
      <div className="steps">
        {workflow.steps.map((s) => (
          <div className="step" key={s.title}>
            <b>{s.title}</b>
            {s.body}
            {s.tags && s.tags.length > 0 && (
              <div className="gates">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function CardArt({ project }: { project: Project }) {
  switch (project.theme) {
    case "blissday":
      return (
        <div className="art" style={{ backgroundImage: "url(/images/blissday/garden.webp)" }}>
          <h3>{project.title}</h3>
        </div>
      );
    case "steady":
      return (
        <div className="art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="shot l" src="/images/steady/s3.jpg" alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="shot r" src="/images/steady/s5.jpg" alt="" />
          <div className="id">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/steady/icon.jpg" alt="" />
            <h3>{project.title}</h3>
          </div>
        </div>
      );
    default: {
      const words = project.title.split(" ");
      const last = words.pop();
      return (
        <div className="art night">
          <div className="bg" />
          <h3 className="serif">
            {words.length > 0 && `${words.join(" ")} `}
            <em>{last}</em>
          </h3>
        </div>
      );
    }
  }
}

function Card({ project }: { project: Project }) {
  const href = project.liveUrl ?? project.codeUrl;
  const label = project.liveUrl?.includes("apps.apple.com") ? "View app →" : "View project →";
  const themeClass = project.theme === "blissday" ? "bdc" : project.theme === "steady" ? "stc" : "";
  // a project without any URL renders as a plain card instead of a dead link
  const linkProps = href ? { as: "a" as const, href, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Reveal {...linkProps} className={`proj ${themeClass}`.trim()}>
      <CardArt project={project} />
      <div className="body">
        <p>{project.shortDescription}</p>
        <div className="meta">
          <div className="chips">
            {/* small cards show the top 3 so the chip row stays on one line */}
            {project.techStack.slice(0, 3).map((t) => (
              <span className="chip" key={t}>{t}</span>
            ))}
          </div>
          {href && <span className="lk">{label}</span>}
        </div>
      </div>
    </Reveal>
  );
}

export default function Projects({ data }: { data?: Project[] }) {
  const projects = data ?? defaultData;
  const [filter, setFilter] = useState<Filter>("all");
  const featured = projects.find((p) => p.featured);
  const others = projects.filter((p) => p !== featured);
  const show = (p: Project) =>
    filter === "all" || p.category === filter || !!p.extraCategories?.includes(filter);

  return (
    <section className="w" id="projects">
      <div className="sh">
        <span className="kick">Projects</span>
        <Reveal as="h2" className="serif">Selected work I&apos;m <em>proud of</em>.</Reveal>
      </div>
      <div className="filters" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={filter === f.key ? "on" : undefined}
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* featured project (and its "How I built it" block) follows the filter like every other card */}
      {featured && show(featured) && (
        <>
          <Featured project={featured} />
          {featured.workflow && <Flow workflow={featured.workflow} />}
        </>
      )}

      <div className="projs">
        {others.filter(show).map((p) => (
          <Card project={p} key={p.id} />
        ))}
      </div>
    </section>
  );
}
