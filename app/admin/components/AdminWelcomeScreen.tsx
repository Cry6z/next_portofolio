"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface AdminWelcomeScreenProps {
  onComplete: () => void;
}

export default function AdminWelcomeScreen({ onComplete }: AdminWelcomeScreenProps) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300); // Show Access Granted
    const t2 = setTimeout(() => setPhase(2), 1000); // Show Progress bar
    const t3 = setTimeout(() => onComplete(), 2500); // Unmount

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  useEffect(() => {
    if (phase >= 1) {
      const interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 100 : p + 5));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <motion.div
      key="admin-welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-200 bg-black text-white flex flex-col items-center justify-center overflow-hidden font-mono"
    >
      {/* Animated Grid */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: 40 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-40px] grid-bg opacity-10 pointer-events-none" 
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="h-20 w-20 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-widest text-green-500 uppercase text-center">
                Akses Diterima
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center w-full"
            >
              <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-4">
                Mendekripsi Dashboard...
              </p>
              
              <div className="w-full h-[2px] bg-gray-900 overflow-hidden relative">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex justify-between mt-3 text-[10px] text-gray-500 font-bold tracking-widest">
                <span>SYSTEM.ADMIN</span>
                <span>{progress}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
