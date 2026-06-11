"use client";

import React, { useState, useEffect } from "react";
import { Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface LockScreenProps {
  passwordInput: string;
  setPasswordInput: (val: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  authError: string;
}

export default function LockScreen({
  passwordInput,
  setPasswordInput,
  handleLogin,
  authError,
}: LockScreenProps) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsTyping(passwordInput.length > 0);
  }, [passwordInput]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div 
        className="absolute inset-[-40px] grid-bg opacity-10 pointer-events-none animate-grid-move" 
      />

      {/* Floating Top Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
        <ThemeToggle />
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold border border-border-custom rounded-none px-4 py-1.5 hover:bg-foreground hover:text-background transition-all font-mono uppercase"
        >
          Lihat Portofolio
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md border border-border-custom bg-card-custom p-8 rounded-none relative z-10 overflow-hidden"
      >
        <div className="flex flex-col items-center gap-4 text-center mb-8 relative">
          <motion.div 
            animate={{ 
              scale: isTyping ? 1.05 : 1,
              borderColor: isTyping ? "var(--foreground)" : "rgba(128,128,128,0.2)"
            }}
            transition={{ duration: 0.3 }}
            className="h-16 w-16 rounded-none border flex items-center justify-center bg-background relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isTyping ? (
                <motion.div
                  key="unlock"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Unlock className="h-6 w-6 text-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="lock"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Lock className="h-6 w-6 text-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl font-black tracking-tight uppercase text-foreground font-mono"
            >
              System Admin
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[10px] text-accent-custom mt-2 font-mono tracking-widest uppercase"
            >
              Akses Kredensial Diperlukan
            </motion.p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 relative">
          <AnimatePresence>
            {authError && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="text-xs font-semibold text-red-500 border border-red-500/30 bg-red-500/5 px-4 py-3 rounded-none font-mono text-center overflow-hidden"
              >
                {authError}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-2 group">
            <input
              type="password"
              id="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Masukkan kata sandi..."
              className="w-full bg-background border border-border-custom rounded-none px-4 py-3 text-xs font-mono tracking-widest focus:outline-none focus:border-foreground transition-all text-foreground text-center placeholder:tracking-normal placeholder:font-sans"
              autoFocus
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex items-center justify-center gap-2 bg-foreground text-background font-bold tracking-wide rounded-none py-3 hover:bg-accent-hover hover:text-foreground border border-foreground transition-all duration-300 w-full mt-2 font-mono uppercase text-xs cursor-pointer"
          >
            <span>Buka Akses</span>
          </motion.button>
        </form>

      </motion.div>
    </div>
  );
}
