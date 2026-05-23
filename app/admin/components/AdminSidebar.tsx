"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LogOut,
  FolderOpen,
  Terminal,
  Briefcase,
  Mail,
  Settings,
  Home as HomeIcon,
  Layers,
  Star,
  Menu,
  X,
} from "lucide-react";
import { useCMS } from "@/context/CMSContext";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: "overview" | "projects" | "skills" | "experience" | "messages" | "settings" | "terminal" | "photos") => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
  unreadCount: number;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleLogout,
  unreadCount,
}: AdminSidebarProps) {
  const { profile } = useCMS();

  return (
    <>
      {/* Subtle minimalist background grid effect */}
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-20 z-0" />
      
      {/* Sidebar Panel */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border-custom/60 bg-card-custom/80 backdrop-blur-lg flex flex-col p-6 gap-6 md:sticky md:top-0 md:h-screen z-20 shadow-sm"
      >
        
        {/* Sidebar Header Logo */}
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center text-2xl font-black text-foreground transition-all hover:opacity-90">
            <span className="text-accent-custom transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-foreground">&lt;</span>
            <span className="transition-colors duration-300 group-hover:text-accent-custom">/</span>
            <span className="text-accent-custom transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground">&gt;</span>
          </Link>
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 border border-border-custom rounded-lg bg-background hover:bg-accent-light transition-colors text-foreground"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className={`${isMobileMenuOpen ? "flex" : "hidden"} md:flex flex-col flex-1 gap-6`}>
          {/* Admin Profile Block */}
        <div className="flex items-center gap-3 border border-border-custom/50 p-3 rounded-2xl bg-background/50 hover:bg-background transition-all duration-300">
          {profile.avatarUrl ? (
            <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 border border-border-custom/60 bg-background">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover filter grayscale"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-foreground text-background font-black flex items-center justify-center text-xs shrink-0">
              A
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-foreground truncate">Administrator</span>
            <span className="text-[10px] text-accent-custom font-mono truncate">{profile.email}</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 relative overflow-hidden group ${
              activeTab === "overview"
                ? "bg-foreground text-background shadow-md shadow-black/10 translate-x-1"
                : "text-accent-custom hover:bg-foreground/5 hover:text-foreground hover:translate-x-1"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Ringkasan</span>
          </button>
          
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 relative overflow-hidden group ${
              activeTab === "projects"
                ? "bg-foreground text-background shadow-md shadow-black/10 translate-x-1"
                : "text-accent-custom hover:bg-foreground/5 hover:text-foreground hover:translate-x-1"
            }`}
          >
            <FolderOpen className="h-4 w-4" />
            <span>Kelola Proyek</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 relative overflow-hidden group ${
              activeTab === "skills"
                ? "bg-foreground text-background shadow-md shadow-black/10 translate-x-1"
                : "text-accent-custom hover:bg-foreground/5 hover:text-foreground hover:translate-x-1"
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Keahlian</span>
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 relative overflow-hidden group ${
              activeTab === "experience"
                ? "bg-foreground text-background shadow-md shadow-black/10 translate-x-1"
                : "text-accent-custom hover:bg-foreground/5 hover:text-foreground hover:translate-x-1"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Garis Waktu Karir</span>
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 relative overflow-hidden group justify-between ${
              activeTab === "messages"
                ? "bg-foreground text-background shadow-md shadow-black/10 translate-x-1"
                : "text-accent-custom hover:bg-foreground/5 hover:text-foreground hover:translate-x-1"
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              <span>Inbox Pesan</span>
            </div>
            {unreadCount > 0 && (
              <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full transition-colors ${
                activeTab === "messages" ? "bg-background text-foreground" : "bg-red-500 text-white animate-pulse"
              }`}>
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 relative overflow-hidden group ${
              activeTab === "terminal"
                ? "bg-foreground text-background shadow-md shadow-black/10 translate-x-1"
                : "text-accent-custom hover:bg-foreground/5 hover:text-foreground hover:translate-x-1"
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Kelola Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 relative overflow-hidden group ${
              activeTab === "settings"
                ? "bg-foreground text-background shadow-md shadow-black/10 translate-x-1"
                : "text-accent-custom hover:bg-foreground/5 hover:text-foreground hover:translate-x-1"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Pengaturan</span>
          </button>
          
          <button
            onClick={() => setActiveTab("photos")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 relative overflow-hidden group ${
              activeTab === "photos"
                ? "bg-foreground text-background shadow-md shadow-black/10 translate-x-1"
                : "text-accent-custom hover:bg-foreground/5 hover:text-foreground hover:translate-x-1"
            }`}
          >
            <Star className="h-4 w-4" />
            <span>Foto Profil</span>
          </button>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="flex flex-col gap-3 mt-auto border-t border-border-custom/40 pt-4 z-10">
          <div className="hidden md:flex items-center justify-between">
            <span className="text-[10px] text-accent-custom font-mono">TEMA</span>
            <ThemeToggle />
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 border border-border-custom hover:border-foreground rounded-xl py-3 text-xs font-bold transition-all duration-300 w-full bg-background hover:shadow-sm"
          >
            <HomeIcon className="h-3.5 w-3.5" />
            Lihat Portofolio
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 border border-border-custom hover:border-red-500/40 hover:text-red-500 rounded-xl py-3 text-xs font-bold transition-all duration-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar Panel
          </button>
        </div>
        </div>
      </motion.aside>
    </>
  );
}
