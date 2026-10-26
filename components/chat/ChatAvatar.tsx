"use client";

import { useState } from "react";

const SERIF = '"Newsreader", Georgia, serif';

export function getInitials(name?: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "HP";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

interface Props {
  src?: string;
  name?: string;
  size?: number;
}

export default function ChatAvatar({ src, name, size = 36 }: Props) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size, objectPosition: "60% 25%" }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="shrink-0 flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: "#24242a",
        color: "#f4f4f2",
        fontFamily: SERIF,
        fontSize: Math.round(size * 0.4),
      }}
    >
      {getInitials(name)}
    </span>
  );
}
