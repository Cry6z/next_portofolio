"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Terminal as TerminalIcon } from "lucide-react";

const texts = [
  "SABAR WOI.....",
  "MAIN ROBLOX DULU.....",
  "WHEN YH.....",
  "BESOK SELESAI....",
];

export default function MaintenanceScreen() {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 0; // loop forever so it doesn't just stop
        return p + Math.random() * 8;
      });
    }, 400);

    const textTimer = setInterval(() => {
      setTextIndex((i) => (i + 1) % texts.length);
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-100 bg-black text-white flex flex-col items-center justify-center overflow-hidden font-mono">
      {/* Animated Grid */}
      <div 
        className="absolute inset-[-40px] grid-bg opacity-10 pointer-events-none animate-grid-move" 
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
            <div className="h-24 w-24 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center relative shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="h-12 w-12 text-red-500 animate-pulse" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl md:text-6xl font-black font-hero tracking-tighter text-red-500 uppercase mb-3">
              SYSTEM OFFLINE
            </h1>
            <p className="text-gray-400 tracking-widest text-xs md:text-sm uppercase max-w-md mx-auto leading-relaxed">
              Website portofolio ini sedang ditutup sementara untuk pemeliharaan dan peningkatan sistem. Silakan kembali lagi nanti.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full mt-12 bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden max-w-md mx-auto"
        >
          {/* Scanning line */}
          <motion.div 
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-red-500/20 blur-[2px] z-0"
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-red-400">
              <TerminalIcon className="h-4 w-4" />
              <span className="text-[10px] md:text-xs tracking-widest">{texts[textIndex]}</span>
            </div>

            <div className="w-full h-[2px] bg-zinc-800 overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-3 text-[10px] text-zinc-500 font-bold tracking-widest">
              <span>MAINTENANCE.MODE_ACTIVE</span>
              <span className="text-red-500">{Math.floor(Math.min(progress, 100))}%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
