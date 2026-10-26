import Reveal from "@/components/ui/Reveal";
import { achievements as defaultData } from "@/data/achievements";
import type { Achievement } from "@/data/types";

const MEDALS: Record<Achievement["icon"], { glyph: string; bg: string }> = {
  trophy: { glyph: "🏆", bg: "linear-gradient(135deg,#fde68a,#f59e0b)" },
  award: { glyph: "🥈", bg: "linear-gradient(135deg,#e5e7eb,#9ca3af)" },
  sparkles: { glyph: "✦", bg: "linear-gradient(135deg,#a7f3d0,#10b981)" },
  star: { glyph: "★", bg: "linear-gradient(135deg,#bfdbfe,#3b82f6)" },
  medal: { glyph: "🏅", bg: "linear-gradient(135deg,#fde68a,#f59e0b)" },
};

export default function Achievements({ data }: { data?: Achievement[] }) {
  const achievements = data ?? defaultData;

  return (
    <section className="w" id="achievements">
      <div className="sh">
        <span className="kick">Achievements</span>
        <Reveal as="h2" className="serif">Recognition &amp; <em>milestones</em>.</Reveal>
        <p>From my journey at MoMo.</p>
      </div>
      <div className="awards">
        {achievements.map((a) => {
          const m = MEDALS[a.icon] ?? MEDALS.star;
          return (
            <Reveal className="aw" key={a.id}>
              <div className="top">
                <span className="medal" style={{ background: m.bg }} aria-hidden="true">{m.glyph}</span>
                <span className="kick">{a.date}</span>
              </div>
              <h3 className="serif">{a.title}</h3>
              <p>{a.description}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
