"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import { useTheme } from "@/context/ThemeContext";

import LockScreen from "./components/LockScreen";
import AdminSidebar from "./components/AdminSidebar";
import OverviewTab from "./components/OverviewTab";
import ProjectsTab from "./components/ProjectsTab";
import SkillsTab from "./components/SkillsTab";
import ExperienceTab from "./components/ExperienceTab";
import MessagesTab from "./components/MessagesTab";
import TerminalTab from "./components/TerminalTab";
import SettingsTab from "./components/SettingsTab";
import PhotosTab from "./components/PhotosTab";

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { adminPassword, messages, resetAllData } = useCMS();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "skills" | "experience" | "messages" | "settings" | "terminal" | "photos"
  >("overview");

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const loggedIn = localStorage.getItem("admin-logged-in");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      const greetingShown = sessionStorage.getItem("admin-greeting-shown");
      if (greetingShown !== "true") {
        sessionStorage.setItem("admin-greeting-shown", "true");
        setShowGreeting(true);
      }
    }
  }, []);

  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => {
        setShowGreeting(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showGreeting]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (passwordInput === adminPassword) {
      localStorage.setItem("admin-logged-in", "true");
      setIsLoggedIn(true);
      setPasswordInput("");
      
      const greetingShown = sessionStorage.getItem("admin-greeting-shown");
      if (greetingShown !== "true") {
        sessionStorage.setItem("admin-greeting-shown", "true");
        setShowGreeting(true);
      }
    } else {
      setAuthError("Kata sandi salah. Silakan coba lagi.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-logged-in");
    sessionStorage.removeItem("admin-greeting-shown");
    setIsLoggedIn(false);
  };

  const handleResetData = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin menyetel ulang semua data portofolio ke konfigurasi contoh bawaan? Semua proyek kustom Anda akan terhapus."
      )
    ) {
      resetAllData();
      alert("Semua data berhasil disetel ulang!");
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  if (!isMounted) return null;

  if (!isLoggedIn) {
    return (
      <LockScreen
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        handleLogin={handleLogin}
        authError={authError}
      />
    );
  }

  const isDark = mounted && theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen md:h-screen md:overflow-hidden bg-background flex flex-col md:flex-row relative"
    >
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center font-mono select-none transition-colors duration-300 ${
              isDark ? "bg-black text-white" : "bg-white text-zinc-900"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-16 w-16 rounded-full border flex items-center justify-center mb-2 shadow-sm transition-colors duration-300 ${
                  isDark ? "border-zinc-800 bg-zinc-900 text-white" : "border-zinc-900/10 bg-zinc-50 text-zinc-900"
                }`}
              >
                <Lock className="h-6 w-6" />
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                className="text-3xl md:text-5xl font-black tracking-tight flex items-center"
              >
                hallo admin<span>!</span>
                <span className={`h-6 w-2.5 ml-1.5 animate-pulse ${
                  isDark ? "bg-white" : "bg-zinc-900"
                }`} />
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className={`text-xs tracking-widest uppercase font-mono mt-2 ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                MEMULAI SESI AMAN...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleLogout={handleLogout}
        unreadCount={unreadCount}
      />

      {/* Main Panel Content */}
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        className="flex-1 p-6 md:p-12 overflow-y-auto w-full z-10 relative md:max-w-none"
      >
        {activeTab === "overview" && (
          <OverviewTab setActiveTab={setActiveTab} handleResetData={handleResetData} unreadCount={unreadCount} />
        )}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "experience" && <ExperienceTab />}
        {activeTab === "messages" && <MessagesTab />}
        {activeTab === "terminal" && <TerminalTab />}
        {activeTab === "settings" && <SettingsTab handleResetData={handleResetData} />}
        {activeTab === "photos" && <PhotosTab />}
      </motion.main>
    </motion.div>
  );
}
