"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Unlock, Lock } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface AdminWelcomeScreenProps {
  onComplete: () => void;
}

export default function AdminWelcomeScreen({ onComplete }: AdminWelcomeScreenProps) {
  const { theme } = useTheme();
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  const decryptLogs = [
    "INITIALIZING_SECURE_SESSION...",
    "SYNCING_PORTFOLIO_DATABASE...",
    "ESTABLISHING_SSL_TUNNEL...",
    "LAUNCHING_ADMIN_CONTROL..."
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
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1]
      }
    }
  };

  useEffect(() => {
    // Step-by-step tech boot sequences
    const t1 = setTimeout(() => setPhase(1), 400);  // Access Granted & Decryption starts
    const t2 = setTimeout(() => setPhase(2), 1200); // Progress bar & Dynamic terminal logs
    const t3 = setTimeout(() => onComplete(), 3600); // Unmount

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  // Handle decryption progress
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
      }, 50);

      return () => clearInterval(interval);
    }
  }, [phase]);

  // Cycle status logs
  useEffect(() => {
    if (phase >= 2) {
      const logInterval = setInterval(() => {
        setLogIndex(i => (i < decryptLogs.length - 1 ? i + 1 : i));
      }, 500);
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
      className="fixed inset-0 z-[200] bg-background text-foreground flex flex-col items-center justify-center overflow-hidden font-mono select-none"
    >
      {/* Animated Scanline Laser Grid Background */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: 40 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-40px] grid-bg opacity-20 pointer-events-none" 
      />
      
      {/* Sweeping Laser Scan Line */}
      <motion.div
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.9)] opacity-45 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        
        {/* Futuristic Glowing Cyber Ring with Lock/Unlock transition */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          
          {/* Outer Dashed Spinning Ring */}
          <motion.svg
            className="absolute w-full h-full text-green-500/30"
            viewBox="0 0 200 200"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          >
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8, 12"
            />
          </motion.svg>

          {/* Middle Counter-rotating HUD Ring */}
          <motion.svg
            className="absolute w-[85%] h-[85%] text-green-500/40"
            viewBox="0 0 200 200"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          >
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="40, 30, 10, 30"
            />
          </motion.svg>

          {/* Inner Glowing Core */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={`w-28 h-28 rounded-full border flex flex-col items-center justify-center shadow-lg transition-all duration-500 ${
              phase >= 1 
                ? "border-green-500/30 bg-green-500/10 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.25)]" 
                : "border-border-custom bg-card-custom/50 text-accent-custom"
            }`}
          >
            <AnimatePresence mode="wait">
              {phase === 0 ? (
                <motion.div
                  key="locked"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Lock className="h-10 w-10 text-accent-custom animate-pulse" />
                </motion.div>
              ) : (
                <motion.div
                  key="unlocked"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  className="flex flex-col items-center"
                >
                  <Unlock className="h-10 w-10 text-green-500 animate-bounce" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Access Status Header */}
        <div className="h-12 overflow-hidden flex items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            {phase === 0 ? (
              <motion.h2
                key="verifying"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-lg md:text-xl font-bold tracking-widest text-accent-custom uppercase text-center"
              >
                VERIFYING_ACCESS...
              </motion.h2>
            ) : (
              <motion.h1
                key="granted"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-2xl md:text-3xl font-black tracking-[0.2em] text-green-500 uppercase text-center"
              >
                ACCESS GRANTED
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Phase 2: Loading Status Bar and Boot Logs */}
        <div className="w-full h-32 flex flex-col justify-end mt-4">
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                {/* Horizontal Progress Bar */}
                <div className="w-full h-[3px] bg-border-custom overflow-hidden relative rounded-full">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)] rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>

                {/* Sub-label under bar */}
                <div className="flex justify-between mt-3 text-[10px] text-accent-custom font-bold tracking-widest">
                  <span>SYSTEM_BOOT // DASHBOARD</span>
                  <span>{progress}%</span>
                </div>

                {/* Live Cyber Boot logs */}
                <div className="mt-4 flex items-center justify-center gap-1.5 h-6">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                  <motion.span
                    key={decryptLogs[logIndex]}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] md:text-xs text-green-500 font-bold tracking-wider"
                  >
                    &gt; {decryptLogs[logIndex]}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cyber stats footer */}
      <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex justify-between font-mono text-[8px] md:text-[9px] text-accent-custom opacity-55">
        <span>SECURITY_KEY: SUCCESS</span>
        <span>SSL_STATUS: DECRYPTED</span>
        <span>TERMINAL: ADMIN_CONTROL</span>
      </div>
    </motion.div>
  );
}
