/** Static content for the MoMo-themed phone in the hero. */
export interface PhoneNotification {
  icon: string;
  title: string;
  time: string;
  body: string;
}

/** Phrases in personal.bio rendered bold in the hero (bio itself stays plain text for metadata/chatbot). */
export const heroBioEmphasis: { text: string; nowrap?: boolean }[] = [
  { text: "MoMo's Super App" },
  { text: "Tử Vi Ngày Mai", nowrap: true },
];

export const heroPhone = {
  greeting: "Xin chào, mình là Hùng",
  years: 6,
  apps: [
    { icon: "⌁", label: "Apple Installment" },
    { icon: "◷", label: "BNPL" },
    { icon: "⬡", label: "Native · KMP" },
    { icon: "✦", label: "AI tools" },
  ],
  notifications: [
    { icon: "FS", title: "Apple Installment & Buy Now Pay Later", time: "2021–24", body: "Led key fintech mini-apps: installment financing, credit risk flow, repayment lifecycle and merchant integration." },
    { icon: "FS", title: "One library for every mini-app", time: "2021–24", body: "A monorepo of components, screens, service and tracking layers, standardizing all Financial Services mini-apps." },
    { icon: "FS", title: "Jest automation for money flows", time: "2021–24", body: "An internal automation testing framework protecting financial transaction flows from regressions." },
    { icon: "AP", title: "Native where it matters", time: "Now", body: "Kotlin Native Modules and KMP-based multiplatform capabilities for the Super App." },
    { icon: "AP", title: "Feature flags & mini-app lifecycle", time: "Now", body: "Architected the internal admin system that manages feature flags and the mini-app lifecycle." },
    { icon: "AI", title: "LLM-powered workflows", time: "Now", body: "Internal tooling, automation and structured test generation with Claude and other LLMs." },
    { icon: "🏆", title: "1st Prize, MoMo FS AI Hackathon", time: "2024", body: "An LLM chatbot that lets users drive Mini-App UI with natural language." },
  ] as PhoneNotification[],
};
