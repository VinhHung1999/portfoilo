import Avatar from "@/components/ui/Avatar";
import HeroPhone from "@/components/sections/HeroPhone";
import Reveal from "@/components/ui/Reveal";
import { personalInfo as defaultData } from "@/data/personal";
import { heroBioEmphasis } from "@/data/heroPhone";
import type { PersonalInfo, Project } from "@/data/types";

const CLOUDS: React.CSSProperties[] = [
  { width: "46%", height: "38%", left: "-6%", top: "8%" },
  { width: "38%", height: "30%", right: "-4%", top: "4%" },
  { width: "60%", height: "40%", left: "20%", top: "50%" },
  { width: "30%", height: "26%", right: "6%", top: "62%" },
  { width: "26%", height: "22%", left: "4%", top: "70%" },
];

/** Wrap each listed phrase found in `text` in <b> (optionally non-breaking). */
function emphasize(text: string, phrases: { text: string; nowrap?: boolean }[]) {
  if (!phrases.length) return text;
  const pattern = phrases.map((p) => p.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  return text.split(new RegExp(`(${pattern})`)).map((part, i) => {
    const match = phrases.find((p) => p.text === part);
    return match ? <b key={i} style={match.nowrap ? { whiteSpace: "nowrap" } : undefined}>{part}</b> : part;
  });
}

interface HeroAboutProps {
  data?: PersonalInfo;
  featured?: Project;
}

export default function HeroAbout({ data, featured }: HeroAboutProps) {
  const personal = data ?? defaultData;
  const stat = featured?.stats?.[0];

  return (
    <header className="sky" id="hero">
      <div className="clouds" aria-hidden="true">
        {CLOUDS.map((s, i) => (
          <i key={i} style={s} />
        ))}
      </div>
      <div className="w hero">
        {featured && stat && (
          <a className="promo intro" href="#projects">
            <span className="tag">Side project</span>
            {`${featured.title}: ${stat.value} ${stat.label}`} <span className="ar">→</span>
          </a>
        )}
        <div className="who intro d1">
          <Avatar src={personal.avatar} alt={personal.name} />
          <div className="st"><i />{personal.status}</div>
        </div>
        <h1 className="serif intro d2">{personal.name}</h1>
        <p className="tagline intro d3">{personal.tagline}</p>
        <p className="bio intro d4">{emphasize(personal.bio, heroBioEmphasis)}</p>
        <div className="cta-row intro d5">
          <a className="btn" href="#projects">View my work →</a>
          <a className="btn ghost" href="#contact">Get in touch</a>
        </div>
        <HeroPhone avatar={personal.avatar} name={personal.name} />
      </div>
    </header>
  );
}

/** Quick-facts strip shown at the top of the dark sheet. */
export function QuickFacts({ data }: { data?: PersonalInfo }) {
  const personal = data ?? defaultData;
  return (
    <section className="w">
      <Reveal className="facts">
        {personal.quickFacts.map((f) => (
          <div key={f.label}>
            <span className="kick">{f.label}</span>
            <span>{f.value}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
