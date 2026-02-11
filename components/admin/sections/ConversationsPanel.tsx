"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Calendar,
  BarChart3,
  Clock,
  Mail,
  Trash2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Loader2,
} from "lucide-react";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ConversationSummary {
  id: string;
  preview: string;
  messageCount: number;
  startedAt: string;
  lastMessageAt: string;
  durationMinutes: number;
  transcriptSent: boolean;
}

interface ConversationStats {
  total: number;
  today: number;
  avgMessages: number;
  avgDurationMinutes: number;
}

interface ConversationDetail {
  id: string;
  messages: ConversationMessage[];
  startedAt: string;
  lastMessageAt: string;
  transcriptSent: boolean;
}

interface Props {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function ConversationsPanel({ onSuccess, onError }: Props) {
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/conversations", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setConversations(data.conversations);
      setStats(data.stats);
    } catch {
      onError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setDetail(null);
      return;
    }

    setExpandedId(id);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/conversations/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDetail(data);
    } catch {
      onError("Failed to load conversation detail");
      setExpandedId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/conversations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (expandedId === id) {
        setExpandedId(null);
        setDetail(null);
      }
      setDeleteConfirmId(null);
      onSuccess("Conversation deleted");
      // Refresh stats
      fetchConversations();
    } catch {
      onError("Failed to delete conversation");
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2
          size={24}
          className="animate-spin"
          style={{ color: "var(--text-muted)" }}
        />
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-2xl font-bold mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        Conversations
      </h1>
      <p
        className="text-sm mb-6"
        style={{ color: "var(--text-muted)" }}
      >
        Chat transcripts from portfolio visitors
      </p>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={MessageSquare}
            label="Total"
            value={stats.total}
          />
          <StatCard
            icon={Calendar}
            label="Today"
            value={stats.today}
          />
          <StatCard
            icon={BarChart3}
            label="Avg Messages"
            value={stats.avgMessages}
          />
          <StatCard
            icon={Clock}
            label="Avg Duration"
            value={`${stats.avgDurationMinutes}m`}
          />
        </div>
      )}

      {/* Conversation List */}
      {conversations.length === 0 ? (
        <div
          className="text-center py-16 rounded-lg border"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border)",
          }}
        >
          <MessageCircle
            size={48}
            className="mx-auto mb-4"
            style={{ color: "var(--text-muted)", opacity: 0.4 }}
          />
          <p
            className="text-lg font-medium mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            No conversations yet
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Chat transcripts will appear here when visitors use the chatbot
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="rounded-lg border overflow-hidden"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border)",
              }}
            >
              {/* Summary Row */}
              <button
                onClick={() => handleExpand(conv.id)}
                className="w-full text-left px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {conv.preview}
                  </p>
                  <div
                    className="flex items-center gap-3 mt-1 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>{formatDate(conv.startedAt)}</span>
                    <span>{conv.messageCount} msgs</span>
                    {conv.durationMinutes > 0 && (
                      <span>{conv.durationMinutes}m</span>
                    )}
                    {conv.transcriptSent && (
                      <span
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--cta)",
                        }}
                      >
                        <Mail size={10} />
                        Emailed
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  {deleteConfirmId === conv.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(conv.id);
                        }}
                        className="px-2 py-1 text-xs font-medium rounded cursor-pointer border-none"
                        style={{
                          backgroundColor: "#EF4444",
                          color: "#fff",
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-1 text-xs font-medium rounded cursor-pointer border-none"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(conv.id);
                      }}
                      className="p-1 rounded cursor-pointer border-none transition-colors"
                      style={{
                        backgroundColor: "transparent",
                        color: "var(--text-muted)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#EF4444";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-muted)";
                      }}
                      aria-label="Delete conversation"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {expandedId === conv.id ? (
                    <ChevronUp size={16} style={{ color: "var(--text-muted)" }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
                  )}
                </div>
              </button>

              {/* Expanded Detail */}
              {expandedId === conv.id && (
                <div
                  className="border-t px-4 py-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  {detailLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2
                        size={20}
                        className="animate-spin"
                        style={{ color: "var(--text-muted)" }}
                      />
                    </div>
                  ) : detail ? (
                    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                      {detail.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed ${
                              msg.role === "user"
                                ? "rounded-[12px_12px_4px_12px]"
                                : "rounded-[12px_12px_12px_4px]"
                            }`}
                            style={
                              msg.role === "user"
                                ? {
                                    background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                                    color: "#fff",
                                  }
                                : {
                                    backgroundColor: "var(--bg-tertiary)",
                                    color: "var(--text-primary)",
                                  }
                            }
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <p
                              className="text-[10px] mt-1 opacity-60"
                              style={{
                                color: msg.role === "user" ? "#fff" : "var(--text-muted)",
                              }}
                            >
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MessageSquare;
  label: string;
  value: number | string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg border"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border)",
      }}
    >
      <Icon size={18} style={{ color: "var(--cta)" }} />
      <div>
        <p
          className="text-lg font-semibold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </p>
        <p
          className="text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
