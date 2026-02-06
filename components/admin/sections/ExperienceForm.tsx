"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, X } from "lucide-react";
import FormInput from "../forms/FormInput";
import FormTextarea from "../forms/FormTextarea";
import TagInput from "../forms/TagInput";
import DateInput from "../forms/DateInput";
import SectionHeader from "./SectionHeader";
import AddButton from "./AddButton";
import EmptyState from "../feedback/EmptyState";
import ConfirmModal from "../feedback/ConfirmModal";
import { SkeletonList } from "../feedback/Skeleton";
import { Briefcase } from "lucide-react";
import { getAuthHeaders } from "@/lib/admin-auth";
import type { Experience } from "@/data/types";

interface ExperienceFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function ExperienceForm({ onSuccess, onError }: ExperienceFormProps) {
  const [items, setItems] = useState<Experience[] | null>(null);
  const [original, setOriginal] = useState<Experience[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/experience", { headers: getAuthHeaders(), credentials: "include" });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setItems(json);
      setOriginal(json);
    } catch {
      onError("Failed to load experience data");
    }
  }, [onError]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!items) return <SkeletonList />;

  const isDirty = JSON.stringify(items) !== JSON.stringify(original);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/experience", {
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
      onSuccess("Experience saved");
    } catch {
      onError("Failed to save experience");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => { if (original) setItems([...original]); };

  const updateItem = (id: string, field: string, value: unknown) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    const newItem: Experience = {
      id: String(Date.now()),
      company: "",
      role: "",
      startDate: "",
      endDate: null,
      achievements: [],
      techStack: [],
    };
    setItems([...items, newItem]);
    setEditingId(newItem.id);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setDeleteId(null);
    if (editingId === id) setEditingId(null);
  };

  const updateAchievement = (expId: string, achIndex: number, value: string) => {
    const exp = items.find((i) => i.id === expId);
    if (!exp) return;
    const achs = [...exp.achievements];
    achs[achIndex] = value;
    updateItem(expId, "achievements", achs);
  };

  const addAchievement = (expId: string) => {
    const exp = items.find((i) => i.id === expId);
    if (!exp) return;
    updateItem(expId, "achievements", [...exp.achievements, ""]);
  };

  const removeAchievement = (expId: string, achIndex: number) => {
    const exp = items.find((i) => i.id === expId);
    if (!exp) return;
    updateItem(expId, "achievements", exp.achievements.filter((_, i) => i !== achIndex));
  };

  const deleteTarget = items.find((i) => i.id === deleteId);

  return (
    <div>
      <SectionHeader
        title="Experience"
        subtitle="Manage your work history"
        isDirty={isDirty}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onSave={handleSave}
        onUndo={handleUndo}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experiences added yet"
          description="Add your work history to showcase your professional journey."
          addLabel="Add Experience"
          onAdd={addItem}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((exp) => (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: editingId === exp.id ? "var(--cta)" : "var(--border)",
                }}
              >
                {editingId === exp.id ? (
                  /* Expanded edit form */
                  <div className="p-4 space-y-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <FormInput label="Company" value={exp.company} onChange={(v) => updateItem(exp.id, "company", v)} required />
                      <FormInput label="Role" value={exp.role} onChange={(v) => updateItem(exp.id, "role", v)} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <DateInput label="Start Date" value={exp.startDate} onChange={(v) => updateItem(exp.id, "startDate", v ?? "")} required />
                      <DateInput label="End Date" value={exp.endDate} onChange={(v) => updateItem(exp.id, "endDate", v)} showCurrentCheckbox />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Achievements</p>
                      <div className="space-y-2">
                        {exp.achievements.map((ach, achIdx) => (
                          <div key={achIdx} className="flex items-start gap-2">
                            <textarea
                              value={ach}
                              onChange={(e) => updateAchievement(exp.id, achIdx, e.target.value)}
                              rows={1}
                              className="flex-1 p-2 text-sm rounded-lg border resize-none"
                              style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                            />
                            <button onClick={() => removeAchievement(exp.id, achIdx)} className="p-1 mt-1 cursor-pointer" style={{ color: "var(--text-muted)" }} aria-label="Remove achievement">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => addAchievement(exp.id)} className="text-xs mt-2 cursor-pointer" style={{ color: "var(--cta)" }}>+ Add Achievement</button>
                    </div>
                    <TagInput label="Tech Stack" tags={exp.techStack} onChange={(v) => updateItem(exp.id, "techStack", v)} />
                    <div className="flex justify-end gap-3 pt-2">
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm rounded-lg border cursor-pointer" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>Done</button>
                    </div>
                  </div>
                ) : (
                  /* Collapsed card */
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{exp.role || "Untitled Role"}</p>
                      <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                        {exp.company || "Company"} | {exp.startDate || "Start"} - {exp.endDate ?? "Present"}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {exp.achievements.length} achievements, {exp.techStack.length} tech skills
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingId(exp.id)} className="p-2 rounded transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cta)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }} aria-label="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteId(exp.id)} className="p-2 rounded transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }} aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <AddButton label="Add Experience" onClick={addItem} />
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Experience?"
        message={`This will remove "${deleteTarget?.role || "this experience"}" from your portfolio. This action cannot be undone.`}
        onConfirm={() => deleteId && deleteItem(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
