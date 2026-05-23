"use client";

import React from "react";
import { useCMS } from "@/context/CMSContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import TerminalSection from "@/components/TerminalSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import WelcomeScreen from "@/components/WelcomeScreen";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { profile, projects, experiences, skills, sendMessage } = useCMS();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("portfolio-visited");
    if (!hasVisited) {
      setShowWelcome(true);
      sessionStorage.setItem("portfolio-visited", "true");
    }
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
      </AnimatePresence>

      {/* Render the actual site behind the welcome screen or when finished */}
      <div className={`flex flex-col flex-1 min-h-screen ${showWelcome ? 'h-screen overflow-hidden' : ''}`}>
        <Navbar />

        <motion.main 
          initial={false}
          animate={showWelcome ? { y: 60, opacity: 0, filter: "blur(4px)" } : { y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: showWelcome ? 0 : 0.4 }}
          className="flex-1 w-full mx-auto max-w-7xl px-6 md:px-12 pt-28 pb-16"
        >
          <HeroSection profile={profile} />
          <ProjectsSection projects={projects} />
          <TerminalSection />
          <SkillsSection skills={skills} />
          <ExperienceSection experiences={experiences} />
          <ContactSection profile={profile} sendMessage={sendMessage} />
        </motion.main>

        <Footer />
      </div>
    </>
  );
}
