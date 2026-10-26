import { Newsreader, Inter, JetBrains_Mono, Be_Vietnam_Pro, Noto_Serif } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--f-serif",
});
// 400–600 only, matching the approved prototype: its bold (700) text renders with the 600 face
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--f-sans",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["500"],
  display: "swap",
  variable: "--f-mono",
});
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--f-vn",
});
const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["500"],
  display: "swap",
  variable: "--f-noto",
});

export const fontVars = [
  newsreader.variable,
  inter.variable,
  jetbrains.variable,
  beVietnam.variable,
  notoSerif.variable,
].join(" ");
