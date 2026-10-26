import Reveal from "@/components/ui/Reveal";
import { experiences as defaultData } from "@/data/experience";
import type { Experience as ExperienceItem } from "@/data/types";

export default function Experience({ data }: { data?: ExperienceItem[] }) {
  const experiences = data ?? defaultData;

  return (
    <section className="w" id="experience">
      <div className="sh">
        <span className="kick">Experience</span>
        <Reveal as="h2" className="serif">My professional <em>journey</em>.</Reveal>
      </div>
      {experiences.map((exp) => {
        const [company, team] = exp.company.split(" — ");
        const current = exp.endDate === null;
        return (
          <Reveal className="job" key={exp.id}>
            <div>
              <span className={`yr${current ? " now" : ""}`}>
                {`${exp.startDate} — ${exp.endDate ?? "PRESENT"}`}
              </span>
              <div className="co">
                {company}
                {team && (
                  <>
                    <br />
                    {team}
                  </>
                )}
              </div>
            </div>
            <div>
              <h3 className="serif">{exp.role}</h3>
              <ul>
                {exp.achievements.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <div className="chips">
                {exp.techStack.map((t) => (
                  <span className="chip" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </Reveal>
        );
      })}
    </section>
  );
}
