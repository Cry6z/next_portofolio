"use client";

import React from "react";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
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
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* Floating Top Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
        <ThemeToggle />
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold border border-border-custom rounded-full px-4 py-1.5 hover:bg-foreground hover:text-background transition-all"
        >
          Lihat Portofolio
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md border border-border-custom bg-card-custom p-8 rounded-2xl relative z-10"
      >
        <div className="flex flex-col items-center gap-4 text-center mb-6">
          <div className="h-12 w-12 rounded-full border border-foreground/15 flex items-center justify-center bg-background">
            <Lock className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase text-foreground">
              Dashboard Admin
            </h1>
            <p className="text-xs text-accent-custom mt-1 font-mono">
              AMANKAN KREDENSIAL MASUK ANDA
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {authError && (
            <div className="text-xs font-semibold text-red-500 border border-red-500/20 bg-red-500/5 px-4 py-2.5 rounded-lg font-mono text-center">
              {authError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-bold tracking-widest font-mono text-accent-custom uppercase"
            >
              Kata Sandi Admin
            </label>
            <input
              type="password"
              id="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Masukkan kata sandi..."
              className="w-full bg-background border border-border-custom rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground text-foreground text-center"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-foreground text-background font-semibold rounded-lg py-3 hover:bg-accent-hover transition-all duration-300 w-full font-sans mt-2"
          >
            Masuk Ke Panel
          </button>
        </form>

        <p className="text-[10px] text-center text-accent-custom mt-6 font-mono">
          KATA SANDI BAWAAN: <span className="underline">admin123</span>
        </p>
      </motion.div>
    </div>
  );
}
