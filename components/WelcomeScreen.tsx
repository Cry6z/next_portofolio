"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useCMS } from "@/context/CMSContext";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const { profile } = useCMS();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"welcome" | "loading">("welcome");
  const [circleCount, setCircleCount] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const statusMessages = [
    "INITIALIZING_CORE_SYSTEMS...",
    "PARSING_PROJECT_METADATA...",
    "RENDERING_3D_SCENE...",
    "INJECTING_PORTFOLIO_SPACE..."
  ];

  // Separate variants typed explicitly to satisfy TypeScript compiler
  const screenVariants: Variants = {
    initial: {
      opacity: 1,
      y: 0
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      y: "-100%",
      opacity: 0,
      transition: {
        duration: 1.0,
        ease: [0.76, 0, 0.24, 1]
      }
    }
  };

  // Phase 1: Welcome linear counter & bottom bar
  useEffect(() => {
    let start = Date.now();
    const duration = 2000;
    let animationFrameId: number;

    const updateCounter = () => {
      let elapsed = Date.now() - start;
      if (elapsed > duration) elapsed = duration;
      
      // Cubic ease-out mathematical formula
      let progress = elapsed / duration;
      let easeOutProgress = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOutProgress * 100));

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        // Transition to loading phase after a brief pause
        setTimeout(() => {
          setPhase("loading");
        }, 300);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Phase 2: High-tech loading circle loader
  useEffect(() => {
    if (phase !== "loading") return;

    let start = Date.now();
    const duration = 3000;
    let animationFrameId: number;

    const updateCircleCounter = () => {
      let elapsed = Date.now() - start;
      if (elapsed > duration) elapsed = duration;

      let progress = elapsed / duration;
      // Quadratic ease-in-out progress
      let easeInOutProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setCircleCount(Math.floor(easeInOutProgress * 100));

      // Update status messages dynamically
      const currentMsgIndex = Math.min(
        Math.floor(progress * statusMessages.length),
        statusMessages.length - 1
      );
      setStatusIndex(currentMsgIndex);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateCircleCounter);
      } else {
        // Complete the loading count and await manual access click
        setIsReady(true);
      }
    };

    animationFrameId = requestAnimationFrame(updateCircleCounter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [phase]);

  return (
    <motion.div
      key="welcome-screen"
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-100 flex flex-col justify-between bg-background text-foreground overflow-hidden"
    >
      {/* Animated Grid Background */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: 40 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-40px] grid-bg opacity-30 pointer-events-none" 
      />

      <AnimatePresence mode="wait">
        {phase === "welcome" ? (
          <motion.div
            key="phase-welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 z-10"
          >
            {/* Top Info Header */}
            <div className="flex justify-between items-start">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="font-mono text-[10px] md:text-xs text-accent-custom uppercase flex flex-col gap-1 tracking-widest"
              >
                <span>System.Boot()</span>
                <span>Loading_Assets...</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="font-mono text-sm md:text-lg font-bold tracking-widest text-foreground"
              >
                [{String(count).padStart(3, "0")}%]
              </motion.div>
            </div>

            {/* Center Main Text */}
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="overflow-hidden py-2">
                <motion.h1 
                  initial={{ y: "100%", opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.3 }} 
                  className="text-5xl md:text-8xl lg:text-[10rem] font-black uppercase font-hero leading-none tracking-tighter"
                >
                  WELCOME
                </motion.h1>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
              >
                <p className="mt-4 md:mt-8 text-xs md:text-sm font-mono tracking-[0.3em] md:tracking-[0.5em] text-accent-custom uppercase text-center max-w-[90vw]">
                  {profile?.welcomeMessage || "to my portfolio"}
                </p>
              </motion.div>
            </div>

            {/* Bottom Loading Bar */}
            <div className="w-full h-[2px] bg-border-custom relative overflow-hidden mt-auto">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                className="absolute top-0 left-0 h-full bg-foreground"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="phase-loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 z-10"
          >
            {/* High-tech Header */}
            <div className="absolute top-6 md:top-12 left-6 md:left-12 right-6 md:right-12 flex justify-between font-mono text-[10px] md:text-xs text-accent-custom uppercase tracking-widest">
              <div className="flex flex-col gap-1">
                <span>SECURE_BOOT: ESTABLISHED</span>
                <span>ASSETS: 100% COMPILED</span>
              </div>
              <div className="text-right flex flex-col gap-1">
                <span>PHASE_02: SPATIAL_LOAD</span>
                <span>THREAD: ACTIVE_PIPELINE</span>
              </div>
            </div>

            {/* Mesh/Glow effect behind circular spinner */}
            <div className="absolute w-[300px] h-[300px] bg-foreground/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Circular Spinner UI */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              
              {/* Outer Dashed Rotating HUD Ring */}
              <motion.svg
                className="absolute w-full h-full text-accent-custom opacity-20"
                viewBox="0 0 200 200"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              >
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="6, 8"
                />
              </motion.svg>

              {/* Second Tech HUD Outer Ring with long dashes */}
              <motion.svg
                className="absolute w-[90%] h-[90%] text-foreground opacity-15"
                viewBox="0 0 200 200"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              >
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="40, 20, 10, 20"
                />
              </motion.svg>

              {/* Third HUD Ring (solid ring with segments) */}
              <motion.svg
                className="absolute w-[80%] h-[80%] text-accent-custom opacity-30"
                viewBox="0 0 200 200"
                animate={{ rotate: 180 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              >
                <circle
                  cx="100"
                  cy="100"
                  r="75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeDasharray="120, 40"
                />
              </motion.svg>

              {/* Main Progress Ring */}
              <svg className="absolute w-[70%] h-[70%] transform -rotate-90" viewBox="0 0 100 100">
                {/* Track circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  className="stroke-border-custom opacity-40"
                  strokeWidth="3.5"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - circleCount / 100)}
                  strokeLinecap="round"
                />
              </svg>

              {/* Inner Glowing Core or Interactive Launch Button */}
              <div className="absolute flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!isReady ? (
                    <motion.div
                      key="loading-text"
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center text-center pointer-events-none"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent-custom mb-1">
                        LOADING
                      </span>
                      <span className="font-mono text-2xl md:text-3xl font-black tracking-widest text-foreground">
                        {circleCount}%
                      </span>
                      {/* Pulsing visual element */}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-2 h-2 rounded-full bg-foreground mt-2"
                      />
                    </motion.div>
                  ) : (
                    <motion.button
                      key="enter-button"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      onClick={onComplete}
                      className="flex flex-col items-center justify-center text-center w-28 h-28 rounded-full border border-foreground/30 bg-background/50 hover:bg-foreground hover:text-background hover:border-foreground shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] cursor-pointer group transition-colors duration-300"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity mb-0.5">
                        SYSTEM
                      </span>
                      <span className="font-mono text-base font-black tracking-[0.2em] translate-x-[0.1em]">
                        ENTER
                      </span>
                      <motion.div 
                        animate={{ y: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="text-[9px] mt-1.5 opacity-55 group-hover:opacity-100 transition-opacity"
                      >
                        ▲
                      </motion.div>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Dynamic Status Log Terminal Style */}
            <div className="mt-12 flex flex-col items-center gap-2 max-w-sm text-center">
              <div className="h-6 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isReady ? "ready-msg" : statusMessages[statusIndex]}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className={`font-mono text-xs md:text-sm font-semibold tracking-wider ${isReady ? 'text-emerald-500 animate-pulse' : 'text-foreground'}`}
                  >
                    &gt; {isReady ? "AWAITING_USER_ACCESS..." : statusMessages[statusIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="flex items-center gap-1.5 font-mono text-[9px] md:text-[10px] text-accent-custom uppercase tracking-widest mt-2">
                <span className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse ${isReady ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{isReady ? "PORTAL_READY_FOR_INJECTION" : "LINK_ESTABLISHED_SSL"}</span>
              </div>
            </div>

            {/* Bottom mini-terminal log details */}
            <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex justify-between font-mono text-[8px] md:text-[9px] text-accent-custom opacity-55">
              <span>ERR_COUNT: 0</span>
              <span>MEMORY_ALLOC: 42.1MB / 512MB</span>
              <span>DEV_MODE: FALSE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
