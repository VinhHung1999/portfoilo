"use client";

import { useState, useEffect, useCallback } from "react";
import FormInput from "../forms/FormInput";
import SectionHeader from "./SectionHeader";
import { SkeletonForm } from "../feedback/Skeleton";
import { getAuthHeaders } from "@/lib/admin-auth";

interface GitHubSettings {
  username: string;
  token: string;
}

interface Props {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function GitHubSettingsForm({ onSuccess, onError }: Props) {
  const [data, setData] = useState<GitHubSettings | null>(null);
  const [original, setOriginal] = useState<GitHubSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/github-settings", {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setData(json);
      setOriginal(json);
    } catch {
      onError("Failed to load GitHub settings");
    }
  }, [onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data) return <SkeletonForm />;

  const isDirty = JSON.stringify(data) !== JSON.stringify(original);

  const update = <K extends keyof GitHubSettings>(
    field: K,
    value: GitHubSettings[K]
  ) => {
    setData({ ...data, [field]: value });
  };

  const handleSave = async () => {
    if (!data.username.trim()) {
      onError("GitHub username is required");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/github-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setData(updated);
      setOriginal(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
      onSuccess("GitHub settings saved");
    } catch {
      onError("Failed to save GitHub settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    if (original) setData({ ...original });
  };

  return (
    <div>
      <SectionHeader
        title="GitHub"
        subtitle="Connect your GitHub account to sync pinned repositories"
        isDirty={isDirty}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onSave={handleSave}
        onUndo={handleUndo}
      />

      {/* GitHub Account */}
      <div
        className="border-t pt-5 mt-2 mb-5"
        style={{ borderColor: "var(--border)" }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Account
        </p>

        <FormInput
          label="GitHub Username"
          value={data.username}
          onChange={(v) => update("username", v)}
          placeholder="e.g., hungson175"
          required
          helper="Your GitHub username (used to fetch pinned repositories)"
        />

        <FormInput
          label="Personal Access Token"
          value={data.token}
          onChange={(v) => update("token", v)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          type="password"
          helper="Required scope: read:user. Generate at GitHub → Settings → Developer settings → Personal access tokens"
        />
      </div>

      {/* Info box */}
      <div
        className="rounded-lg p-4 text-sm"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          color: "var(--text-secondary)",
        }}
      >
        <p className="font-medium mb-2" style={{ color: "var(--text-primary)" }}>
          How it works
        </p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Save your GitHub credentials above</li>
          <li>Go to the Projects section and click &quot;Sync from GitHub&quot;</li>
          <li>Your pinned repos will be fetched and mapped to project cards</li>
          <li>Review and edit before saving — nothing is auto-replaced</li>
        </ul>
      </div>
    </div>
  );
}
