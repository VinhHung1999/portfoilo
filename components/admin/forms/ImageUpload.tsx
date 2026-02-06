"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { getAuthHeaders } from "@/lib/admin-auth";

interface ImageUploadProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  required?: boolean;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  required,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      setIsUploading(true);
      setProgress(10);

      try {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("File too large. Max 5MB.");
        }

        if (!file.type.startsWith("image/")) {
          throw new Error("Only image files are allowed.");
        }

        setProgress(30);

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filename = `${timestamp}-${safeName}`;

        const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(filename)}`, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            ...getAuthHeaders(),
          },
          credentials: "include",
          body: file,
        });

        setProgress(80);

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const { url } = await res.json();
        setProgress(100);
        onChange(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) upload(file);
      // Reset so same file can be selected again
      e.target.value = "";
    },
    [upload]
  );

  return (
    <div className="mb-5">
      <label
        className="block text-[13px] font-medium mb-1.5"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
        {required && (
          <span className="ml-0.5" style={{ color: "var(--cta)" }}>
            {" "}*
          </span>
        )}
      </label>

      {value ? (
        /* Preview */
        <div className="relative inline-block">
          <div
            className="w-32 h-32 rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white cursor-pointer"
            style={{ backgroundColor: "#EF4444" }}
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed transition-all cursor-pointer"
          style={{
            borderColor: isDragging ? "var(--cta)" : "var(--border)",
            backgroundColor: isDragging ? "var(--bg-tertiary)" : "transparent",
          }}
        >
          {isUploading ? (
            <>
              <Loader2
                size={24}
                className="animate-spin"
                style={{ color: "var(--cta)" }}
              />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Uploading... {progress}%
              </p>
              <div
                className="w-full max-w-[200px] h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: "var(--cta)",
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <ImageIcon
                size={24}
                style={{ color: "var(--text-muted)" }}
              />
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Drop image here or click to browse
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                JPEG, PNG, WebP, GIF, SVG. Max 5MB.
              </p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="text-xs mt-1.5" style={{ color: "#EF4444" }}>
          {error}
        </p>
      )}
    </div>
  );
}
