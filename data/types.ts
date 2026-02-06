/**
 * TypeScript interfaces for portfolio data
 * All data structures used across the application
 */

import { LucideIcon } from "lucide-react";

// Personal Information
export interface PersonalInfo {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  status: string;
  languages: string;
  socialLinks: SocialLink[];
  quickFacts: QuickFact[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string; // Icon name from Lucide
}

export interface QuickFact {
  icon: string; // Icon name from Lucide: "MapPin" | "Target" | "Briefcase" | "Globe"
  label: string;
  value: string;
}

// Work Experience
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null; // null means current
  achievements: string[];
  techStack: string[];
}

// Projects
export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: "web" | "mobile" | "ai";
  year: number;
  thumbnail: string; // Icon name from Lucide: "Bot" | "Palette" | "ShoppingBag"
  images: string[];
  techStack: string[];
  features: string[];
  liveUrl?: string;
  codeUrl?: string;
}

// Skills
export interface SkillCategory {
  category: string;
  skills: string[];
}

// Achievements
export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: "trophy" | "award" | "star" | "medal" | "sparkles";
}
