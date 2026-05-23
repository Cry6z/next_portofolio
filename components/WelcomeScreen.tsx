"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCMS } from "@/context/CMSContext";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const { profile } = useCMS();
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Complete the welcome screen after 3.2 seconds
    const t1 = setTimeout(() => onComplete(), 3200);
    return () => clearTimeout(t1);
  }, [onComplete]);

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
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <motion.div
      key="welcome"
      initial={{ y: 0 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-100 flex flex-col justify-between p-6 md:p-12 bg-background text-foreground overflow-hidden"
    >
      {/* Animated Grid Background */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: 40 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-40px] grid-bg opacity-30 pointer-events-none" 
      />

      {/* Top Info Header */}
      <div className="flex justify-between items-start z-10">
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
          [{String(count).padStart(3, '0')}%]
        </motion.div>
      </div>

      {/* Center Main Text */}
      <div className="flex flex-col items-center justify-center flex-1 z-10">
        <div className="overflow-hidden py-2">
          <motion.h1 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
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
      <div className="z-10 w-full h-[2px] bg-border-custom relative overflow-hidden mt-auto">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-foreground"
        />
      </div>
    </motion.div>
  );
}
