"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import { useTheme } from "@/context/ThemeContext";

import LockScreen from "./components/LockScreen";
import AdminWelcomeScreen from "./components/AdminWelcomeScreen";
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
      <AnimatePresence mode="wait">
        {showGreeting && <AdminWelcomeScreen onComplete={() => setShowGreeting(false)} />}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={showGreeting ? { opacity: 0, scale: 0.95, filter: "blur(10px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: showGreeting ? 0 : 0.4 }}
        className={`flex-1 flex flex-col md:flex-row w-full h-full ${showGreeting ? "pointer-events-none" : ""}`}
      >
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
          {activeTab === "photos" && <PhotosTab />}
          {activeTab === "settings" && <SettingsTab handleResetData={handleResetData} />}
        </motion.main>
      </motion.div>
    </motion.div>
  );
}
