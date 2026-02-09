"use client";

import { useState, useEffect, useCallback } from "react";
import FormTextarea from "../forms/FormTextarea";
import TagInput from "../forms/TagInput";
import FormInput from "../forms/FormInput";
import SectionHeader from "./SectionHeader";
import AddButton from "./AddButton";
import { SkeletonForm } from "../feedback/Skeleton";
import { X } from "lucide-react";
import { getAuthHeaders } from "@/lib/admin-auth";

interface ChatbotSettings {
  customInstructions: string;
  suggestedTopics: string[];
  greeting: string;
  suggestedQuestions: string[];
}

interface Props {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const MAX_INSTRUCTIONS = 2000;
const MAX_QUESTIONS = 5;

export default function ChatbotSettingsForm({ onSuccess, onError }: Props) {
  const [data, setData] = useState<ChatbotSettings | null>(null);
  const [original, setOriginal] = useState<ChatbotSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chatbot-context", {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setData(json);
      setOriginal(json);
    } catch {
      onError("Failed to load chatbot settings");
    }
  }, [onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data) return <SkeletonForm />;

  const isDirty = JSON.stringify(data) !== JSON.stringify(original);

  const update = <K extends keyof ChatbotSettings>(
    field: K,
    value: ChatbotSettings[K]
  ) => {
    setData({ ...data, [field]: value });
  };

  const handleSave = async () => {
    // Validate: filter empty suggested questions
    const cleanQuestions = data.suggestedQuestions.filter((q) => q.trim());
    if (cleanQuestions.length === 0) {
      onError("At least one suggested question is required");
      return;
    }

    setIsSaving(true);
    try {
      const toSave = { ...data, suggestedQuestions: cleanQuestions };
      const res = await fetch("/api/admin/chatbot-context", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        credentials: "include",
        body: JSON.stringify(toSave),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setData(updated);
      setOriginal(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
      onSuccess("Chatbot settings saved");
    } catch {
      onError("Failed to save chatbot settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    if (original) setData({ ...original });
  };

  const updateQuestion = (index: number, value: string) => {
    const questions = [...data.suggestedQuestions];
    questions[index] = value;
    update("suggestedQuestions", questions);
  };

  const removeQuestion = (index: number) => {
    update(
      "suggestedQuestions",
      data.suggestedQuestions.filter((_, i) => i !== index)
    );
  };

  const addQuestion = () => {
    if (data.suggestedQuestions.length < MAX_QUESTIONS) {
      update("suggestedQuestions", [...data.suggestedQuestions, ""]);
    }
  };

  const charCount = data.customInstructions.length;
  const charColor =
    charCount >= MAX_INSTRUCTIONS
      ? "#EF4444"
      : charCount > 1800
        ? "#F59E0B"
        : "var(--text-muted)";

  return (
    <div>
      <SectionHeader
        title="Chatbot"
        subtitle="Configure your AI assistant's knowledge and behavior"
        isDirty={isDirty}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onSave={handleSave}
        onUndo={handleUndo}
      />

      {/* Custom Context group */}
      <div
        className="border-t pt-5 mt-2 mb-5"
        style={{ borderColor: "var(--border)" }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Custom Context
        </p>

        <div className="mb-5">
          <FormTextarea
            label="Custom Instructions"
            value={data.customInstructions}
            onChange={(v) =>
              update(
                "customInstructions",
                v.slice(0, MAX_INSTRUCTIONS)
              )
            }
            placeholder={`Add additional context for the chatbot. For example:\n• "I'm currently looking for senior AI/ML roles"\n• "Highlight my backend and system design experience"\n• "I specialize in LLM applications and multi-agent systems"`}
            rows={6}
          />
          <p
            className="text-xs -mt-3 text-right"
            style={{ color: charColor }}
          >
            {charCount} / {MAX_INSTRUCTIONS} characters
          </p>
        </div>

        <TagInput
          label="Suggested Topics"
          tags={data.suggestedTopics}
          onChange={(tags) =>
            update("suggestedTopics", tags.slice(0, 10))
          }
          placeholder="Type and press Enter to add..."
        />
        <p
          className="text-xs -mt-3"
          style={{ color: "var(--text-muted)" }}
        >
          Tags help the chatbot understand your current priorities
        </p>
      </div>

      {/* Welcome Message group */}
      <div
        className="border-t pt-5 mt-2 mb-5"
        style={{ borderColor: "var(--border)" }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Welcome Message
        </p>

        <FormTextarea
          label="Greeting"
          value={data.greeting}
          onChange={(v) => update("greeting", v)}
          placeholder="Hi! I'm [name]'s AI assistant. Ask me about skills, projects, or experience."
          rows={3}
          helper="Shown when visitors first open the chat"
        />

        <div className="mb-5">
          <label
            className="block text-[13px] font-medium mb-1.5"
            style={{ color: "var(--text-primary)" }}
          >
            Suggested Questions
          </label>
          <div className="space-y-2">
            {data.suggestedQuestions.map((q, i) => (
              <div key={i} className="flex items-center gap-2">
                <FormInput
                  label=""
                  value={q}
                  onChange={(v) => updateQuestion(i, v)}
                  placeholder='e.g., What projects have you worked on?'
                />
                <button
                  onClick={() => removeQuestion(i)}
                  disabled={data.suggestedQuestions.length <= 1}
                  className="p-1.5 rounded transition-colors shrink-0 -mt-5"
                  style={{
                    color: "var(--text-muted)",
                    cursor: data.suggestedQuestions.length <= 1 ? "not-allowed" : "pointer",
                    opacity: data.suggestedQuestions.length <= 1 ? 0.3 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (data.suggestedQuestions.length > 1)
                      e.currentTarget.style.color = "#EF4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                  aria-label="Remove question"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          {data.suggestedQuestions.length < MAX_QUESTIONS && (
            <div className="mt-3">
              <AddButton
                label="Add Question"
                onClick={addQuestion}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
