import Reveal from "@/components/ui/Reveal";
import { personalInfo as defaultData } from "@/data/personal";
import type { PersonalInfo } from "@/data/types";

const CLOUDS: React.CSSProperties[] = [
  { width: "50%", height: "60%", left: "-10%", top: "10%" },
  { width: "40%", height: "50%", right: "-5%", top: "40%" },
];

export default function Contact({ data }: { data?: PersonalInfo }) {
  const personal = data ?? defaultData;
  const socials = personal.socialLinks.filter((l) => l.name !== "Email");

  return (
    <section className="w" id="contact">
      <Reveal className="contact sky">
        <div className="clouds" aria-hidden="true">
          {CLOUDS.map((s, i) => (
            <i key={i} style={s} />
          ))}
        </div>
        <h2 className="serif">Get in <em>touch</em>.</h2>
        <p>Feel free to reach out for collaborations or opportunities.</p>
        <div className="cinfo">
          <div><span className="kick">Email</span>{personal.email}</div>
          <div><span className="kick">Location</span>{personal.location}</div>
          <div><span className="kick">Status</span>{personal.status}</div>
        </div>
        <div className="cta-row">
          <a className="btn" href={`mailto:${personal.email}`}>Email me →</a>
          {socials.map((l) => (
            <a className="btn ghost" key={l.name} href={l.url} target="_blank" rel="noopener noreferrer">
              {l.name}
            </a>
          ))}
        </div>
      </Reveal>
      <footer>
        <span>© {new Date().getFullYear()} {personal.name}</span>
        <span>{personal.location.split(",")[0]}</span>
      </footer>
    </section>
  );
}
