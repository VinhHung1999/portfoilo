"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import { heroPhone } from "@/data/heroPhone";

/** MoMo-themed phone: digit roll, blur-in title, and an iOS-style notification stack. */
export default function HeroPhone({ avatar, name }: { avatar?: string; name: string }) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const notisRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [rolled, setRolled] = useState(false);

  const { years } = heroPhone;
  const digits = Array.from({ length: years + 1 }, (_, i) => i);
  const wd = (i: number) => ({ animationDelay: `${(1 + i * 0.07).toFixed(2)}s` });

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRolled(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const phone = phoneRef.current;
    const notis = notisRef.current;
    const hint = hintRef.current;
    if (!phone || !notis || !hint) return;
    const nts = Array.from(notis.querySelectorAll<HTMLElement>(".nt"));
    let pending = 0;

    // Cards not yet reached collapse into a stack peeking under the last visible one.
    const stack = () => {
      const PEEK = 8, GAP = 8;
      const top0 = notis.scrollTop;
      const vb = top0 + notis.clientHeight - 2 * PEEK - 4;
      nts.forEach((c, i) => {
        const t = c.offsetTop, h = c.offsetHeight, step = h + GAP;
        const tx = c.querySelector<HTMLElement>(".tx")!;
        const ic = c.querySelector<HTMLElement>(".ic")!;
        const d = Math.max(0, (t + h - vb) / step);
        c.style.transformOrigin = "50% 100%";
        if (d > 0) {
          const dd = Math.min(d, 2);
          c.style.transform = `translateY(${vb - h + PEEK * dd - t}px) scale(${1 - 0.06 * dd})`;
          c.style.opacity = String(d > 2 ? Math.max(0, 3 - d) : 1);
          const fade = String(Math.max(0, 1 - d * 1.6));
          tx.style.opacity = fade;
          ic.style.opacity = fade;
          c.style.background = `rgba(246,246,248,${(0.74 - 0.16 * dd).toFixed(3)})`;
          c.style.zIndex = String(100 - i);
          return;
        }
        const u = Math.max(0, Math.min(1, (top0 - t) / h));
        c.style.transform = u > 0 ? `scale(${1 - 0.08 * u})` : "none";
        c.style.opacity = String(1 - u);
        tx.style.opacity = "1";
        ic.style.opacity = "1";
        c.style.background = "";
        c.style.zIndex = String(100 - i);
      });
    };

    const fit = () => {
      const sheet = document.querySelector<HTMLElement>(".pf .sheet");
      const overlap = sheet ? -parseFloat(getComputedStyle(sheet).marginTop) || 0 : 0;
      // offsetTop is relative to the sticky .screen, so the result doesn't change with scroll position
      phone.style.height =
        Math.round(phone.clientTop + hint.offsetTop + hint.offsetHeight + 36 + overlap) + "px";
      stack();
    };

    const onScroll = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(stack);
    };

    stack();
    fit();
    notis.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", fit);
    let cancelled = false;
    document.fonts?.ready.then(() => !cancelled && fit());
    return () => {
      cancelled = true;
      cancelAnimationFrame(pending);
      notis.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <div className="phone" ref={phoneRef} aria-hidden="true">
      <div className="screen">
        <div className="mm-head">
          <div className="mm-hi">
            <Avatar src={avatar} alt="" />
            {heroPhone.greeting}
          </div>
          <h3>
            <span className="wd" style={wd(0)}>
              <span className="roll">
                <span style={{ transform: rolled ? `translateY(-${(years * 1.18).toFixed(2)}em)` : undefined }}>
                  {digits.map((n) => (
                    <i key={n}>{n}</i>
                  ))}
                </span>
              </span>
              +
            </span>{" "}
            <span className="wd" style={wd(1)}>years</span>{" "}
            <span className="wd" style={wd(2)}>building</span>
            <br />
            <span className="wd" style={wd(3)}>money</span>{" "}
            <span className="wd" style={wd(4)}>apps</span>{" "}
            <span className="wd" style={wd(5)}>at</span>{" "}
            <span className="wd" style={wd(6)}>MoMo.</span>
          </h3>
        </div>
        <div className="mm-apps">
          {heroPhone.apps.map((a) => (
            <div key={a.label}>
              <i>{a.icon}</i>
              {a.label}
            </div>
          ))}
        </div>
        <div className="notis" ref={notisRef}>
          {heroPhone.notifications.map((n) => (
            <div className="nt" key={n.title}>
              <i className="ic">{n.icon}</i>
              <div className="tx">
                <div className="hd">
                  <b>{n.title}</b>
                  <small>{n.time}</small>
                </div>
                <p>{n.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="scroll-hint" ref={hintRef}>Scroll to read ↓</div>
      </div>
    </div>
  );
}
