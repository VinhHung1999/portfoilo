"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { useToast } from "@/lib/use-toast";
import AdminTopBar from "@/components/admin/layout/AdminTopBar";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import MobileTabBar from "@/components/admin/layout/MobileTabBar";
import Toast from "@/components/admin/feedback/Toast";
import PersonalInfoForm from "@/components/admin/sections/PersonalInfoForm";
import ExperienceForm from "@/components/admin/sections/ExperienceForm";
import ProjectsForm from "@/components/admin/sections/ProjectsForm";
import SkillsForm from "@/components/admin/sections/SkillsForm";
import AchievementsForm from "@/components/admin/sections/AchievementsForm";
import ChatbotSettingsForm from "@/components/admin/sections/ChatbotSettingsForm";
import type { AdminSection } from "@/components/admin/layout/AdminSidebar";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>("personal");
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const { toasts, dismissToast, success, error } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalInfoForm onSuccess={success} onError={error} />;
      case "experience":
        return <ExperienceForm onSuccess={success} onError={error} />;
      case "projects":
        return <ProjectsForm onSuccess={success} onError={error} />;
      case "skills":
        return <SkillsForm onSuccess={success} onError={error} />;
      case "achievements":
        return <AchievementsForm onSuccess={success} onError={error} />;
      case "chatbot":
        return <ChatbotSettingsForm onSuccess={success} onError={error} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <AdminTopBar onLogout={handleLogout} />
      <AdminSidebar active={activeSection} onChange={setActiveSection} />
      <MobileTabBar active={activeSection} onChange={setActiveSection} />

      {/* Main content area */}
      <main
        className="pt-14 lg:pl-56"
        style={{ minHeight: "100vh" }}
      >
        {/* Mobile: account for tab bar height */}
        <div className="pt-12 lg:pt-0">
          <div className="max-w-3xl mx-auto p-6 md:p-8">
            {renderSection()}
          </div>
        </div>
      </main>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
