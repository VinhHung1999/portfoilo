import Reveal from "@/components/ui/Reveal";
import { skillCategories as defaultData } from "@/data/skills";
import type { SkillCategory } from "@/data/types";

/**
 * `skills` is the source of truth (edited in admin, read by the chatbot); `groups` only arranges it.
 * Grouped skills no longer in `skills` are dropped, and new ungrouped skills land in a "More" group.
 */
function displayGroups(cat: SkillCategory) {
  if (!cat.groups?.length) return null;
  const groups = cat.groups
    .map((g) => ({ label: g.label, skills: g.skills.filter((s) => cat.skills.includes(s)) }))
    .filter((g) => g.skills.length);
  const rest = cat.skills.filter((s) => !cat.groups!.some((g) => g.skills.includes(s)));
  if (rest.length) groups.push({ label: "More", skills: rest });
  return groups.length ? groups : null;
}

export default function Skills({ data }: { data?: SkillCategory[] }) {
  const categories = data ?? defaultData;
  const aiIndex = categories.findIndex((c) => c.category === "AI");

  return (
    <section className="w" id="skills">
      <div className="sh">
        <span className="kick">Skills</span>
        <Reveal as="h2" className="serif">Technologies I <em>work with</em>.</Reveal>
      </div>
      <div className="skills">
        {categories.map((cat, i) => {
          const isAI = i === aiIndex;
          // first three span 2, AI spans 4, the one after AI spans 2, the rest span full width
          const full = i > 2 && !isAI && (aiIndex < 0 ? true : i > aiIndex + 1);
          const cls = isAI ? "sk hl ai" : full ? "sk s6" : "sk";
          const groups = displayGroups(cat);
          return (
            <Reveal className={cls} key={cat.category}>
              <span className="kick">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="serif">{cat.category}</h3>
              {groups ? (
                <div className="aig">
                  {groups.map((g) => (
                    <div key={g.label}>
                      <span className="kick">{g.label}</span>
                      <div className="chips">
                        {g.skills.map((s) => (
                          <span className="chip" key={s}>{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="chips">
                  {cat.skills.map((s) => (
                    <span className="chip" key={s}>{s}</span>
                  ))}
                </div>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
