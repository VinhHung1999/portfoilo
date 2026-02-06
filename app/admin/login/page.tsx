"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = await login(password);
    if (success) {
      router.push("/admin");
    } else {
      setError("Invalid password");
    }
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 border"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border)",
        }}
      >
        <h1
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          Admin Panel
        </h1>
        <p
          className="text-sm mb-8 text-center"
          style={{ color: "var(--text-muted)" }}
        >
          Enter your password to continue
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-[13px] font-medium mb-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              className="w-full h-10 px-3 text-sm rounded-lg border outline-none transition-all duration-150"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: error ? "#EF4444" : "var(--border)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--cta)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--cta-glow)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error ? "#EF4444" : "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {error && (
              <p className="text-xs mt-1.5" style={{ color: "#EF4444" }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password || isLoading}
            className="w-full h-10 rounded-lg text-sm font-medium text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--cta)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--cta-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--cta)";
            }}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin mx-auto" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
