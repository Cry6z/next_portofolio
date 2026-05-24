"use client";

import React, { useState, useEffect } from "react";
import { useCMS } from "@/context/CMSContext";
import ThemeToggle from "./ThemeToggle";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Proyek", href: "#projects" },
  { label: "Keahlian", href: "#skills" },
  { label: "Pengalaman", href: "#experience" },
  { label: "Kontak", href: "#contact" },
];

interface NavbarProps {
  onTerminalClick?: () => void;
}

export default function Navbar({ onTerminalClick }: NavbarProps) {
  const { profile } = useCMS();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-[padding,background-color,border-color] duration-300 ${scrolled
            ? "py-4 bg-background/80 backdrop-blur-md border-b border-border-custom"
            : "py-6 bg-transparent"
          }`}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="group flex items-center text-2xl font-black text-foreground transition-all hover:opacity-90">
            <span className="text-accent-custom transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-foreground">&lt;</span>
            <span className="transition-colors duration-300 group-hover:text-accent-custom">/</span>
            <span className="text-accent-custom transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground">&gt;</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-accent-custom hover:text-foreground relative transition-colors duration-200 group py-1"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            


            <ThemeToggle />
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground hover:opacity-75 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[70px] z-30 bg-background/95 backdrop-blur-lg md:hidden flex flex-col px-8 py-12 justify-between"
          >
            <nav className="flex flex-col gap-6 text-2xl font-bold tracking-tight">
              {navItems.map((item, idx) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-foreground border-b border-border-custom pb-2 flex justify-between items-center"
                >
                  {item.label}
                  <span className="text-sm font-normal text-accent-custom">0{idx + 1}</span>
                </motion.a>
              ))}


            </nav>
            <div className="text-xs text-accent-custom tracking-wider font-mono">
              PORTFOLIO v1.0.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
