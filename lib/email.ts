import nodemailer from "nodemailer";
import type { Conversation } from "./conversations";

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  recipientEmail: string;
}

export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const recipientEmail = process.env.TRANSCRIPT_RECIPIENT_EMAIL;

  if (!host || !port || !user || !pass || !recipientEmail) {
    return null;
  }

  return {
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465,
    user,
    pass,
    recipientEmail,
  };
}

function formatTranscriptHtml(conversation: Conversation): string {
  const startDate = new Date(conversation.startedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const messagesHtml = conversation.messages
    .map((msg) => {
      const isUser = msg.role === "user";
      const time = new Date(msg.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const bgColor = isUser ? "#EEF2FF" : "#F9FAFB";
      const label = isUser ? "Visitor" : "AI Assistant";
      const labelColor = isUser ? "#6366F1" : "#6B7280";

      return `
        <div style="margin-bottom:12px;padding:12px 16px;border-radius:8px;background:${bgColor};">
          <div style="font-size:12px;color:${labelColor};font-weight:600;margin-bottom:4px;">
            ${label} &middot; ${time}
          </div>
          <div style="font-size:14px;color:#1F2937;line-height:1.5;white-space:pre-wrap;">
            ${escapeHtml(msg.content)}
          </div>
        </div>`;
    })
    .join("");

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#1F2937;margin:0 0 4px;">Portfolio Chat Transcript</h2>
      <p style="color:#6B7280;font-size:14px;margin:0 0 24px;">
        ${startDate} &middot; ${conversation.messages.length} messages
      </p>
      ${messagesHtml}
      <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0 16px;" />
      <p style="color:#9CA3AF;font-size:12px;margin:0;">
        Auto-sent after 5 minutes of inactivity.
      </p>
    </div>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendTranscriptEmail(
  conversation: Conversation
): Promise<boolean> {
  const config = getSmtpConfig();
  if (!config) {
    console.log("[email] SMTP not configured, skipping transcript email");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const firstUserMsg = conversation.messages.find((m) => m.role === "user");
  const preview = firstUserMsg?.content.slice(0, 60) ?? "New conversation";

  await transporter.sendMail({
    from: `"Portfolio Bot" <${config.user}>`,
    to: config.recipientEmail,
    subject: `Chat Transcript: "${preview}${(firstUserMsg?.content.length ?? 0) > 60 ? "..." : ""}"`,
    html: formatTranscriptHtml(conversation),
  });

  return true;
}
