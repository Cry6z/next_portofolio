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
  const [isReady, setIsReady] = useState(false);

  const screenVariants: Variants = {
    initial: {
      opacity: 1
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 1.0,
        ease: "easeInOut"
      }
    }
  };

  useEffect(() => {
    let start = Date.now();
    const duration = 2500;
    let animationFrameId: number;

    const updateCounter = () => {
      let elapsed = Date.now() - start;
      if (elapsed > duration) elapsed = duration;

      let progress = elapsed / duration;
      let easeOutProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

      setCount(Math.floor(easeOutProgress * 100));

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setIsReady(true);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <motion.div
      key="welcome-screen"
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background text-foreground overflow-hidden font-mono select-none"
    >
      <div className="flex flex-col items-center justify-center text-center max-w-[90vw]">
        {/* Welcome Heading */}
        <div className="overflow-hidden py-2">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="text-5xl md:text-8xl lg:text-[9rem] font-black uppercase font-hero leading-none tracking-tighter"
          >
            WELCOME
          </motion.h1>
        </div>

        {/* Welcome message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="mt-4 text-xs md:text-sm tracking-[0.3em] text-accent-custom uppercase max-w-md">
            {profile?.welcomeMessage || "to my portfolio"}
          </p>
        </motion.div>

        {/* Flat 1px Progress Line */}
        <div className="w-48 h-px bg-border-custom/30 relative overflow-hidden my-6">
          <motion.div
            className="absolute top-0 left-0 h-full bg-foreground"
            style={{ width: `${count}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        {/* Counter or Enter Button */}
        <div className="h-14 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isReady ? (
              <motion.span
                key="counter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-bold tracking-widest text-accent-custom"
              >
                {count}%
              </motion.span>
            ) : (
              <motion.button
                key="enter-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="flex items-center justify-center border border-foreground bg-background hover:bg-foreground hover:text-background text-foreground text-xs uppercase tracking-[0.3em] px-8 py-3.5 rounded-none cursor-pointer transition-all duration-300"
              >
                ENTER SYSTEM
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
