"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
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

  const handleTabClick = (tab: "overview" | "projects" | "skills" | "experience" | "messages" | "settings" | "terminal" | "photos") => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Stagger entry animations for mobile menu
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 260, damping: 22 } 
    },
  };

  const renderMenuContent = (isMobile = false) => {
    const NavContainer = isMobile ? motion.nav : "nav";
    const ItemWrapper = isMobile ? motion.div : React.Fragment;

    const navProps = isMobile
      ? { variants: containerVariants, initial: "hidden", animate: "show", className: "flex flex-col gap-1.5 flex-1" }
      : { className: "flex flex-col gap-1.5 flex-1" };

    const wrapItem = (child: React.ReactNode, key: string) => {
      if (isMobile) {
        return (
          <motion.div key={key} variants={itemVariants}>
            {child}
          </motion.div>
        );
      }
      return <React.Fragment key={key}>{child}</React.Fragment>;
    };

    return (
      <>
        {/* Admin Profile Block */}
        <ItemWrapper {...(isMobile ? { variants: itemVariants } : {})}>
          <div className="flex items-center gap-3 border border-border-custom p-2.5 rounded-none bg-background/50 hover:bg-background transition-all duration-300">
            {profile.avatarUrl ? (
              <div className="h-8 w-8 rounded-none overflow-hidden shrink-0 border border-border-custom bg-background">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover filter grayscale"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-none bg-foreground text-background font-black flex items-center justify-center text-xs shrink-0 font-mono">
                A
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono font-bold text-foreground truncate uppercase">Administrator</span>
              <span className="text-[9px] text-accent-custom font-mono truncate">{profile.email}</span>
            </div>
          </div>
        </ItemWrapper>

        {/* Sidebar Navigation */}
        <NavContainer {...navProps}>
          {wrapItem(
            <button
              onClick={() => handleTabClick("overview")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-none text-xs font-mono uppercase tracking-tight transition-all duration-200 relative overflow-hidden group w-full text-left ${
                activeTab === "overview"
                  ? "bg-foreground text-background"
                  : "text-accent-custom hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Ringkasan</span>
            </button>,
            "overview"
          )}

          {wrapItem(
            <button
              onClick={() => handleTabClick("projects")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-none text-xs font-mono uppercase tracking-tight transition-all duration-200 relative overflow-hidden group w-full text-left ${
                activeTab === "projects"
                  ? "bg-foreground text-background"
                  : "text-accent-custom hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span>Kelola Proyek</span>
            </button>,
            "projects"
          )}

          {wrapItem(
            <button
              onClick={() => handleTabClick("skills")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-none text-xs font-mono uppercase tracking-tight transition-all duration-200 relative overflow-hidden group w-full text-left ${
                activeTab === "skills"
                  ? "bg-foreground text-background"
                  : "text-accent-custom hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Keahlian</span>
            </button>,
            "skills"
          )}

          {wrapItem(
            <button
              onClick={() => handleTabClick("experience")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-none text-xs font-mono uppercase tracking-tight transition-all duration-200 relative overflow-hidden group w-full text-left ${
                activeTab === "experience"
                  ? "bg-foreground text-background"
                  : "text-accent-custom hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Garis Waktu Karir</span>
            </button>,
            "experience"
          )}

          {wrapItem(
            <button
              onClick={() => handleTabClick("messages")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-none text-xs font-mono uppercase tracking-tight transition-all duration-200 relative overflow-hidden group justify-between w-full text-left ${
                activeTab === "messages"
                  ? "bg-foreground text-background"
                  : "text-accent-custom hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5" />
                <span>Inbox Pesan</span>
              </div>
              {unreadCount > 0 && (
                <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-none transition-colors ${
                  activeTab === "messages" ? "bg-background text-foreground" : "bg-red-500 text-white"
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>,
            "messages"
          )}

          {wrapItem(
            <button
              onClick={() => handleTabClick("terminal")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-none text-xs font-mono uppercase tracking-tight transition-all duration-200 relative overflow-hidden group w-full text-left ${
                activeTab === "terminal"
                  ? "bg-foreground text-background"
                  : "text-accent-custom hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Kelola Terminal</span>
            </button>,
            "terminal"
          )}

          {wrapItem(
            <button
              onClick={() => handleTabClick("settings")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-none text-xs font-mono uppercase tracking-tight transition-all duration-200 relative overflow-hidden group w-full text-left ${
                activeTab === "settings"
                  ? "bg-foreground text-background"
                  : "text-accent-custom hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Pengaturan</span>
            </button>,
            "settings"
          )}

          {wrapItem(
            <button
              onClick={() => handleTabClick("photos")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-none text-xs font-mono uppercase tracking-tight transition-all duration-200 relative overflow-hidden group w-full text-left ${
                activeTab === "photos"
                  ? "bg-foreground text-background"
                  : "text-accent-custom hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <Star className="h-3.5 w-3.5" />
              <span>Foto Profil</span>
            </button>,
            "photos"
          )}
        </NavContainer>

        {/* Sidebar Footer Controls */}
        <ItemWrapper {...(isMobile ? { variants: itemVariants } : {})}>
          <div className="flex flex-col gap-2 mt-auto border-t border-border-custom/40 pt-4 z-10 w-full">
            <div className="hidden md:flex items-center justify-between mb-1">
              <span className="text-[9px] text-accent-custom font-mono">TEMA</span>
              <ThemeToggle />
            </div>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 border border-border-custom hover:border-foreground rounded-none py-2.5 text-xs font-mono uppercase tracking-tight transition-all duration-200 w-full bg-background"
            >
              <HomeIcon className="h-3.5 w-3.5" />
              Lihat Portofolio
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 border border-border-custom hover:border-red-500/40 hover:text-red-500 rounded-none py-2.5 text-xs font-mono uppercase tracking-tight transition-all duration-200 w-full cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log Out
            </button>
          </div>
        </ItemWrapper>
      </>
    );
  };

  return (
    <>
      {/* Subtle minimalist background grid effect */}
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-20 z-0" />

      {/* Sidebar Panel */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className={`w-full md:w-60 border-b md:border-b-0 md:border-r border-border-custom/60 flex flex-col p-3 md:p-4 gap-4 z-30 ${
          isMobileMenuOpen 
            ? "fixed inset-0 h-screen bg-background" 
            : "sticky top-0 h-16 md:h-screen justify-center md:justify-start bg-card-custom/80 backdrop-blur-lg"
        }`}
      >
        {/* Sidebar Header Logo & Burger Button */}
        <div className="flex items-center justify-between shrink-0 w-full">
          <Link href="/" className="group flex items-center text-xl font-black text-foreground transition-all hover:opacity-90">
            <span className="text-accent-custom transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-foreground">&lt;</span>
            <span className="transition-colors duration-300 group-hover:text-accent-custom">/</span>
            <span className="text-accent-custom transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground">&gt;</span>
          </Link>
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-8 h-8 border border-border-custom rounded-none bg-background hover:bg-accent-light transition-colors text-foreground flex items-center justify-center overflow-hidden cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {/* Custom Animated Hamburger / X lines */}
              <motion.div
                animate={isMobileMenuOpen ? "open" : "closed"}
                className="w-5 h-3 flex flex-col justify-between items-center"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 5 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-0.5 bg-foreground rounded-full block"
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  transition={{ duration: 0.15 }}
                  className="w-full h-0.5 bg-foreground rounded-full block"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -5 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-0.5 bg-foreground rounded-full block"
                />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex flex-col flex-1 gap-6 overflow-visible w-full">
          {renderMenuContent()}
        </div>

        {/* Mobile Menu Overlay Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col flex-1 gap-6 overflow-y-auto border-t border-border-custom/40 pt-4 mt-2 md:hidden w-full"
            >
              {renderMenuContent(true)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
}
