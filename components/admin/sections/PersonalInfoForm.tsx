"use client";

import { useState, useEffect, useCallback } from "react";
import FormInput from "../forms/FormInput";
import FormTextarea from "../forms/FormTextarea";
import SectionHeader from "./SectionHeader";
import AddButton from "./AddButton";
import { SkeletonForm } from "../feedback/Skeleton";
import { X } from "lucide-react";
import { getAuthHeaders } from "@/lib/admin-auth";
import type { PersonalInfo } from "@/data/types";

interface PersonalInfoFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function PersonalInfoForm({ onSuccess, onError }: PersonalInfoFormProps) {
  const [data, setData] = useState<PersonalInfo | null>(null);
  const [original, setOriginal] = useState<PersonalInfo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/personal", { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setData(json);
      setOriginal(json);
    } catch {
      onError("Failed to load personal info");
    }
  }, [onError]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!data) return <SkeletonForm />;

  const isDirty = JSON.stringify(data) !== JSON.stringify(original);

  const update = (field: keyof PersonalInfo, value: PersonalInfo[keyof PersonalInfo]) => {
    setData({ ...data, [field]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/personal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setData(updated);
      setOriginal(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
      onSuccess("Personal info saved");
    } catch {
      onError("Failed to save personal info");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    if (original) setData({ ...original });
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const links = [...data.socialLinks];
    links[index] = { ...links[index], [field]: value };
    update("socialLinks", links);
  };

  const removeSocialLink = (index: number) => {
    update("socialLinks", data.socialLinks.filter((_, i) => i !== index));
  };

  const addSocialLink = () => {
    update("socialLinks", [...data.socialLinks, { name: "", url: "", icon: "Globe" }]);
  };

  const updateQuickFact = (index: number, field: string, value: string) => {
    const facts = [...data.quickFacts];
    facts[index] = { ...facts[index], [field]: value };
    update("quickFacts", facts);
  };

  const removeQuickFact = (index: number) => {
    update("quickFacts", data.quickFacts.filter((_, i) => i !== index));
  };

  const addQuickFact = () => {
    update("quickFacts", [...data.quickFacts, { icon: "Star", label: "", value: "" }]);
  };

  return (
    <div>
      <SectionHeader
        title="Personal Info"
        subtitle="Edit your personal details"
        isDirty={isDirty}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onSave={handleSave}
        onUndo={handleUndo}
      />

      <FormInput label="Name" value={data.name} onChange={(v) => update("name", v)} required />
      <FormInput label="Tagline" value={data.tagline} onChange={(v) => update("tagline", v)} required />
      <FormTextarea label="Bio" value={data.bio} onChange={(v) => update("bio", v)} required />

      {/* Contact & Location */}
      <div className="border-t pt-5 mt-2 mb-5" style={{ borderColor: "var(--border)" }}>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
          Contact & Location
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <FormInput label="Email" value={data.email} onChange={(v) => update("email", v)} required type="email" />
          <FormInput label="Location" value={data.location} onChange={(v) => update("location", v)} />
          <FormInput label="Status" value={data.status} onChange={(v) => update("status", v)} />
          <FormInput label="Languages" value={data.languages} onChange={(v) => update("languages", v)} />
        </div>
      </div>

      {/* Social Links */}
      <div className="border-t pt-5 mt-2 mb-5" style={{ borderColor: "var(--border)" }}>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
          Social Links
        </p>
        <div className="space-y-3">
          {data.socialLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={link.name}
                onChange={(e) => updateSocialLink(i, "name", e.target.value)}
                placeholder="Name"
                className="w-24 h-9 px-2 text-sm rounded-lg border"
                style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
              <input
                value={link.url}
                onChange={(e) => updateSocialLink(i, "url", e.target.value)}
                placeholder="URL"
                className="flex-1 h-9 px-2 text-sm rounded-lg border"
                style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
              <button
                onClick={() => removeSocialLink(i)}
                className="p-1.5 rounded transition-colors cursor-pointer"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                aria-label="Remove link"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <AddButton label="Add Social Link" onClick={addSocialLink} />
        </div>
      </div>

      {/* Quick Facts */}
      <div className="border-t pt-5 mt-2" style={{ borderColor: "var(--border)" }}>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
          Quick Facts
        </p>
        <div className="space-y-3">
          {data.quickFacts.map((fact, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={fact.icon}
                onChange={(e) => updateQuickFact(i, "icon", e.target.value)}
                placeholder="Icon"
                className="w-20 h-9 px-2 text-sm rounded-lg border"
                style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
              <input
                value={fact.label}
                onChange={(e) => updateQuickFact(i, "label", e.target.value)}
                placeholder="Label"
                className="w-24 h-9 px-2 text-sm rounded-lg border"
                style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
              <input
                value={fact.value}
                onChange={(e) => updateQuickFact(i, "value", e.target.value)}
                placeholder="Value"
                className="flex-1 h-9 px-2 text-sm rounded-lg border"
                style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
              />
              <button
                onClick={() => removeQuickFact(i)}
                className="p-1.5 rounded transition-colors cursor-pointer"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                aria-label="Remove fact"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <AddButton label="Add Quick Fact" onClick={addQuickFact} />
        </div>
      </div>
    </div>
  );
}
