"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface AdminWelcomeScreenProps {
  onComplete: () => void;
}

export default function AdminWelcomeScreen({ onComplete }: AdminWelcomeScreenProps) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  const decryptLogs = [
    "INITIALIZING SECURE SESSION...",
    "SYNCING PORTFOLIO DATABASE...",
    "ESTABLISHING SECURE CONNECTION...",
    "LAUNCHING CONTROL PANEL..."
  ];

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

  useEffect(() => {
    // Step-by-step boot sequences
    const t1 = setTimeout(() => setPhase(1), 300);   // Progress counting starts
    const t2 = setTimeout(() => setPhase(2), 800);   // Logs starting
    const t3 = setTimeout(() => onComplete(), 3200); // Unmount welcome screen

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  // Handle progress counter
  useEffect(() => {
    if (phase >= 1) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + 4;
        });
      }, 70);

      return () => clearInterval(interval);
    }
  }, [phase]);

  // Cycle status logs
  useEffect(() => {
    if (phase >= 2) {
      const logInterval = setInterval(() => {
        setLogIndex(i => (i < decryptLogs.length - 1 ? i + 1 : i));
      }, 600);
      return () => clearInterval(logInterval);
    }
  }, [phase]);

  return (
    <motion.div
      key="admin-welcome"
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-200 bg-background text-foreground flex flex-col items-center justify-center overflow-hidden font-mono select-none"
    >
      <div className="relative z-10 flex flex-col items-center justify-center max-w-md w-full px-6 text-center">
        
        {/* Giant Monospace Progress Percentage */}
        <AnimatePresence mode="wait">
          <motion.div
            key="percentage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-xs font-bold tracking-[0.3em] text-accent-custom mb-3 uppercase">
              LOADING CONTROL PANEL
            </span>
            <span className="text-7xl md:text-8xl font-bold tracking-widest text-foreground">
              {progress}%
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Flat 1px Minimalist Progress Line */}
        <div className="w-56 h-px bg-border-custom/30 relative overflow-hidden my-6">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-foreground"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        {/* Phase 2: Dynamic Status logs */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {phase >= 2 && (
              <motion.span
                key={decryptLogs[logIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[10px] md:text-xs text-accent-custom font-bold uppercase tracking-widest"
              >
                &gt; {progress >= 100 ? "ACCESS GRANTED" : decryptLogs[logIndex]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Minimalist footer details */}
      <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex justify-between text-[9px] text-accent-custom uppercase tracking-[0.25em] opacity-55">
        <span>SECURE SESSION</span>
        <span>v1.0.0</span>
      </div>
    </motion.div>
  );
}
