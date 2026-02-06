"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import FormInput from "../forms/FormInput";
import FormTextarea from "../forms/FormTextarea";
import TagInput from "../forms/TagInput";
import IconSelect from "../forms/IconSelect";
import ImageUpload from "../forms/ImageUpload";
import SectionHeader from "./SectionHeader";
import AddButton from "./AddButton";
import EmptyState from "../feedback/EmptyState";
import ConfirmModal from "../feedback/ConfirmModal";
import { SkeletonList } from "../feedback/Skeleton";
import { FolderOpen } from "lucide-react";
import { getAuthHeaders } from "@/lib/admin-auth";
import type { Project } from "@/data/types";

const THUMBNAIL_OPTIONS = ["Bot", "Palette", "ShoppingBag", "Globe", "Code", "Smartphone", "Database", "Brain", "Rocket", "Layout"];

interface ProjectsFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function ProjectsForm({ onSuccess, onError }: ProjectsFormProps) {
  const [items, setItems] = useState<Project[] | null>(null);
  const [original, setOriginal] = useState<Project[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/projects", { headers: getAuthHeaders(), credentials: "include" });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setItems(json);
      setOriginal(json);
    } catch {
      onError("Failed to load projects data");
    }
  }, [onError]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!items) return <SkeletonList />;

  const isDirty = JSON.stringify(items) !== JSON.stringify(original);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
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
      onSuccess("Projects saved");
    } catch {
      onError("Failed to save projects");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => { if (original) setItems([...original]); };

  const updateItem = (id: string, field: string, value: unknown) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    const newItem: Project = {
      id: String(Date.now()),
      title: "",
      shortDescription: "",
      fullDescription: "",
      category: "web",
      year: new Date().getFullYear(),
      thumbnail: "Code",
      images: [],
      techStack: [],
      features: [],
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
        title="Projects"
        subtitle="Manage your project showcase"
        isDirty={isDirty}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onSave={handleSave}
        onUndo={handleUndo}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects added yet"
          description="Add your projects to showcase your work."
          addLabel="Add Project"
          onAdd={addItem}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((proj) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: editingId === proj.id ? "var(--cta)" : "var(--border)",
                }}
              >
                {editingId === proj.id ? (
                  <div className="p-4 space-y-1">
                    <FormInput label="Title" value={proj.title} onChange={(v) => updateItem(proj.id, "title", v)} required />
                    <FormInput label="Short Description" value={proj.shortDescription} onChange={(v) => updateItem(proj.id, "shortDescription", v)} required />
                    <FormTextarea label="Full Description" value={proj.fullDescription} onChange={(v) => updateItem(proj.id, "fullDescription", v)} required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <IconSelect label="Thumbnail Icon" value={proj.thumbnail} onChange={(v) => updateItem(proj.id, "thumbnail", v)} options={THUMBNAIL_OPTIONS} />
                      <FormInput label="Category" value={proj.category} onChange={(v) => updateItem(proj.id, "category", v)} />
                    </div>
                    <ImageUpload label="Thumbnail Image" value={proj.thumbnailUrl || null} onChange={(v) => updateItem(proj.id, "thumbnailUrl", v || undefined)} />
                    <TagInput label="Tech Stack" tags={proj.techStack} onChange={(v) => updateItem(proj.id, "techStack", v)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                      <FormInput label="Live URL" value={proj.liveUrl || ""} onChange={(v) => updateItem(proj.id, "liveUrl", v || undefined)} />
                      <FormInput label="GitHub URL" value={proj.codeUrl || ""} onChange={(v) => updateItem(proj.id, "codeUrl", v || undefined)} />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm rounded-lg border cursor-pointer" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>Done</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{proj.title || "Untitled Project"}</p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {proj.techStack.slice(0, 3).join(", ")}{proj.techStack.length > 3 ? `, +${proj.techStack.length - 3}` : ""}
                      </p>
                      {(proj.liveUrl || proj.codeUrl) && (
                        <p className="text-xs mt-1">
                          {proj.liveUrl && <span style={{ color: "var(--cta)" }}>Live</span>}
                          {proj.liveUrl && proj.codeUrl && <span style={{ color: "var(--text-muted)" }}> | </span>}
                          {proj.codeUrl && <span style={{ color: "var(--cta)" }}>GitHub</span>}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingId(proj.id)} className="p-2 rounded transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cta)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }} aria-label="Edit"><Pencil size={16} /></button>
                      <button onClick={() => setDeleteId(proj.id)} className="p-2 rounded transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }} aria-label="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <AddButton label="Add Project" onClick={addItem} />
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Project?"
        message={`This will remove "${deleteTarget?.title || "this project"}" from your portfolio. This action cannot be undone.`}
        onConfirm={() => deleteId && deleteItem(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
