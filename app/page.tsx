"use client";

import React from "react";
import { useCMS } from "@/context/CMSContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "lucide-react";

export default function Home() {
  const { profile, projects, experiences, skills, sendMessage, isPortfolioOpen } = useCMS();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isCheckingWelcome, setIsCheckingWelcome] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    // Only show welcome if the portfolio is open
    if (!isPortfolioOpen) return;

    const hasVisited = sessionStorage.getItem("portfolio-visited");
    if (!hasVisited) {
      setShowWelcome(true);
      sessionStorage.setItem("portfolio-visited", "true");
    }
    setIsCheckingWelcome(false);
  }, [isPortfolioOpen]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (!isPortfolioOpen) {
    return <MaintenanceScreen />;
  }

  if (isCheckingWelcome) {
    return <div className="fixed inset-0 bg-background z-9999" />;
  }

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
      </AnimatePresence>

      {/* Render the actual site behind the welcome screen or when finished */}
      <div className={`flex flex-col flex-1 min-h-screen ${showWelcome ? 'h-screen overflow-hidden' : ''}`}>
        <Navbar onTerminalClick={() => setShowTerminal(true)} />

        <motion.main 
          initial={false}
          animate={showWelcome ? { y: 60, opacity: 0, filter: "blur(4px)" } : { y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: showWelcome ? 0 : 0.4 }}
          className="flex-1 w-full mx-auto max-w-7xl px-6 md:px-12 pt-28 pb-16"
        >
          <HeroSection profile={profile} />
          <ProjectsSection projects={projects} />
          <SkillsSection skills={skills} />
          <ExperienceSection experiences={experiences} />
          <ContactSection profile={profile} sendMessage={sendMessage} />
        </motion.main>

        <Footer />
      </div>

      {/* Floating Terminal Overlay Modal */}
      <AnimatePresence>
        {showTerminal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            {/* Dark glassmorphism backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTerminal(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />

            {/* Glowing siber Terminal Window */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-4xl z-10 rounded-xl overflow-hidden border border-border-custom shadow-[0_0_50px_rgba(0,0,0,0.5)] md:shadow-[0_0_60px_rgba(34,197,94,0.15)] bg-black text-white"
            >
              <InteractiveTerminal onClose={() => setShowTerminal(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating siber terminal launch button */}
      <AnimatePresence>
        {!showWelcome && !showTerminal && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTerminal(true)}
            className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-zinc-900 border border-green-500/30 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.45)] flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md"
            title="Launch Interactive Terminal"
          >
            <Terminal className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
