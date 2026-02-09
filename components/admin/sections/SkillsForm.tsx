"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import FormInput from "../forms/FormInput";
import TagInput from "../forms/TagInput";
import SectionHeader from "./SectionHeader";
import AddButton from "./AddButton";
import EmptyState from "../feedback/EmptyState";
import ConfirmModal from "../feedback/ConfirmModal";
import { SkeletonList } from "../feedback/Skeleton";
import { Zap } from "lucide-react";
import { getAuthHeaders } from "@/lib/admin-auth";
import type { SkillCategory, SkillItem } from "@/data/types";

/** Extract skill names from mixed string/SkillItem array */
function getSkillNames(skills: (string | SkillItem)[]): string[] {
  return skills.map((s) => (typeof s === "string" ? s : s.name));
}

interface SkillsFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function SkillsForm({ onSuccess, onError }: SkillsFormProps) {
  const [items, setItems] = useState<SkillCategory[] | null>(null);
  const [original, setOriginal] = useState<SkillCategory[] | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/skills", { headers: getAuthHeaders(), credentials: "include" });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setItems(json);
      setOriginal(json);
    } catch {
      onError("Failed to load skills data");
    }
  }, [onError]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!items) return <SkeletonList />;

  const isDirty = JSON.stringify(items) !== JSON.stringify(original);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/skills", {
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
      onSuccess("Skills saved");
    } catch {
      onError("Failed to save skills");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => { if (original) setItems([...original]); };

  const updateItem = (idx: number, field: string, value: unknown) => {
    setItems(items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    const newItem: SkillCategory = { category: "", skills: [] };
    setItems([...items, newItem]);
    setEditingIdx(items.length);
  };

  const deleteItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
    setDeleteIdx(null);
    if (editingIdx === idx) setEditingIdx(null);
  };

  return (
    <div>
      <SectionHeader
        title="Skills"
        subtitle="Manage your skill categories"
        isDirty={isDirty}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onSave={handleSave}
        onUndo={handleUndo}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No skill categories yet"
          description="Add your skills to showcase your expertise."
          addLabel="Add Skill Category"
          onAdd={addItem}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((cat, idx) => (
              <motion.div
                key={`${cat.category}-${idx}`}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: editingIdx === idx ? "var(--cta)" : "var(--border)",
                }}
              >
                {editingIdx === idx ? (
                  <div className="p-4 space-y-1">
                    <FormInput label="Category Name" value={cat.category} onChange={(v) => updateItem(idx, "category", v)} required />
                    <TagInput label="Skills" tags={getSkillNames(cat.skills)} onChange={(v) => updateItem(idx, "skills", v)} />
                    <div className="flex justify-end gap-3 pt-2">
                      <button onClick={() => setEditingIdx(null)} className="px-4 py-2 text-sm rounded-lg border cursor-pointer" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>Done</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{cat.category || "Untitled Category"}</p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{getSkillNames(cat.skills).join(", ")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingIdx(idx)} className="p-2 rounded transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cta)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }} aria-label="Edit"><Pencil size={16} /></button>
                      <button onClick={() => setDeleteIdx(idx)} className="p-2 rounded transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }} aria-label="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <AddButton label="Add Skill Category" onClick={addItem} />
        </div>
      )}

      <ConfirmModal
        open={deleteIdx !== null}
        title="Delete Skill Category?"
        message={`This will remove "${deleteIdx !== null ? items[deleteIdx]?.category || "this category" : ""}" from your portfolio. This action cannot be undone.`}
        onConfirm={() => deleteIdx !== null && deleteItem(deleteIdx)}
        onCancel={() => setDeleteIdx(null)}
      />
    </div>
  );
}
