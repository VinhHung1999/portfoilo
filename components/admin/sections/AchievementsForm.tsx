"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import FormInput from "../forms/FormInput";
import FormTextarea from "../forms/FormTextarea";
import IconSelect from "../forms/IconSelect";
import SectionHeader from "./SectionHeader";
import AddButton from "./AddButton";
import EmptyState from "../feedback/EmptyState";
import ConfirmModal from "../feedback/ConfirmModal";
import { SkeletonList } from "../feedback/Skeleton";
import { Award } from "lucide-react";
import { getAuthHeaders } from "@/lib/admin-auth";
import type { Achievement } from "@/data/types";

const ICON_OPTIONS = ["trophy", "award", "star", "medal", "sparkles"];

interface AchievementsFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function AchievementsForm({ onSuccess, onError }: AchievementsFormProps) {
  const [items, setItems] = useState<Achievement[] | null>(null);
  const [original, setOriginal] = useState<Achievement[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/achievements", { headers: getAuthHeaders(), credentials: "include" });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setItems(json);
      setOriginal(json);
    } catch {
      onError("Failed to load achievements data");
    }
  }, [onError]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!items) return <SkeletonList />;

  const isDirty = JSON.stringify(items) !== JSON.stringify(original);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/achievements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        credentials: "include",
        body: JSON.stringify(items),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setItems(updated);
      setOriginal(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
      onSuccess("Achievements saved");
    } catch {
      onError("Failed to save achievements");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => { if (original) setItems([...original]); };

  const updateItem = (id: string, field: string, value: unknown) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    const newItem: Achievement = {
      id: String(Date.now()),
      title: "",
      description: "",
      date: "",
      icon: "trophy",
    };
    setItems([...items, newItem]);
    setEditingId(newItem.id);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setDeleteId(null);
    if (editingId === id) setEditingId(null);
  };

  const deleteTarget = items.find((i) => i.id === deleteId);

  return (
    <div>
      <SectionHeader
        title="Achievements"
        subtitle="Manage your awards and recognitions"
        isDirty={isDirty}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onSave={handleSave}
        onUndo={handleUndo}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No achievements added yet"
          description="Add your awards and recognitions to highlight your accomplishments."
          addLabel="Add Achievement"
          onAdd={addItem}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((ach) => (
              <motion.div
                key={ach.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: editingId === ach.id ? "var(--cta)" : "var(--border)",
                }}
              >
                {editingId === ach.id ? (
                  <div className="p-4 space-y-1">
                    <FormInput label="Title" value={ach.title} onChange={(v) => updateItem(ach.id, "title", v)} required />
                    <FormTextarea label="Description" value={ach.description} onChange={(v) => updateItem(ach.id, "description", v)} required rows={2} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <FormInput label="Date" value={ach.date} onChange={(v) => updateItem(ach.id, "date", v)} required placeholder="e.g., 2023" />
                      <IconSelect label="Icon" value={ach.icon} onChange={(v) => updateItem(ach.id, "icon", v)} options={ICON_OPTIONS} />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm rounded-lg border cursor-pointer" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>Done</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{ach.title || "Untitled Achievement"}</p>
                        <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>{ach.date}</span>
                      </div>
                      <p className="text-[13px] mt-0.5 line-clamp-1" style={{ color: "var(--text-secondary)" }}>{ach.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingId(ach.id)} className="p-2 rounded transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cta)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }} aria-label="Edit"><Pencil size={16} /></button>
                      <button onClick={() => setDeleteId(ach.id)} className="p-2 rounded transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }} aria-label="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <AddButton label="Add Achievement" onClick={addItem} />
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Achievement?"
        message={`This will remove "${deleteTarget?.title || "this achievement"}" from your portfolio. This action cannot be undone.`}
        onConfirm={() => deleteId && deleteItem(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
