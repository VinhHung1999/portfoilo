"use client";

const DEFAULT_GREETING = "Hi! I'm Hung's AI assistant.";
const DEFAULT_SUBTITLE = "Ask me about his skills, projects, or experience.";
const DEFAULT_SUGGESTIONS = [
  "What are your skills?",
  "Tell me about your experience",
  "Show me your projects",
];

interface Props {
  onSend: (message: string) => void;
  greeting?: string;
  suggestedQuestions?: string[];
}

export default function EmptyState({ onSend, greeting, suggestedQuestions }: Props) {
  // Split greeting into title (first sentence) and subtitle (rest)
  const greetingText = greeting || DEFAULT_GREETING;
  const parts = greetingText.split(/(?<=\.)\s+/);
  const title = parts[0] || DEFAULT_GREETING;
  const subtitle = parts.slice(1).join(" ") || DEFAULT_SUBTITLE;

  const suggestions = suggestedQuestions && suggestedQuestions.length > 0
    ? suggestedQuestions
    : DEFAULT_SUGGESTIONS;

  return (
    <div className="flex flex-col items-center justify-center h-full px-[16px] py-[24px] gap-[16px]">
      <div className="text-center">
        <p
          className="text-[24px] leading-[1.2]"
          style={{
            color: "#f4f4f2",
            fontFamily: '"Newsreader", Georgia, serif',
            fontWeight: 400,
          }}
        >
          {title}
        </p>
        <p
          className="text-[14px] leading-[1.5] mt-[6px]"
          style={{ color: "#9a9aa0", fontFamily: '"Inter", system-ui, sans-serif' }}
        >
          {subtitle}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-[6px] w-full">
        {suggestions.map((text) => (
          <button
            key={text}
            onClick={() => onSend(text)}
            className="chat-dark-focus chat-dark-chip px-[11px] py-[7px] text-[12.5px] rounded-full cursor-pointer transition-colors duration-200"
            style={{
              backgroundColor: "#24242a",
              border: "1px solid #2e2e34",
              color: "#f4f4f2",
              fontFamily: '"Inter", system-ui, sans-serif',
            }}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
