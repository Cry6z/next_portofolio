"use client";

import React, { useState, useEffect } from "react";
import { useCMS } from "@/context/CMSContext";
import ThemeToggle from "./ThemeToggle";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Proyek", href: "#projects" },
  { label: "Galeri", href: "/gallery" },
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
  const pathname = usePathname();

  const getHref = (href: string) => {
    if (pathname === "/gallery" || pathname === "/admin") {
      if (href.startsWith("#")) {
        return "/" + href;
      }
    }
    return href;
  };

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
        className={`fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full max-w-6xl z-40 transition-all duration-300 border border-border-custom bg-background/80 backdrop-blur-md shadow-sm rounded-none ${
          scrolled ? "py-2 px-6" : "py-3 px-8"
        }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="group flex items-center text-lg md:text-xl font-black text-foreground transition-all hover:opacity-90">
            <span className="text-accent-custom transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:text-foreground">&lt;</span>
            <span className="transition-colors duration-300 group-hover:text-accent-custom">/</span>
            <span className="text-accent-custom transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground">&gt;</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isPage = item.href.startsWith("/");
              const linkHref = getHref(item.href);
              const isActive = pathname === item.href;
              if (isPage) {
                return (
                  <Link
                    key={item.label}
                    href={linkHref}
                    className={`text-xs font-medium relative transition-colors duration-200 group py-1 ${
                      isActive ? "text-foreground font-semibold" : "text-accent-custom hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 h-[1.5px] bg-foreground transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                  </Link>
                );
              }
              return (
                <a
                  key={item.label}
                  href={linkHref}
                  className="text-xs font-medium text-accent-custom hover:text-foreground relative transition-colors duration-200 group py-1"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-foreground transition-all duration-300 group-hover:w-full" />
                </a>
              );
            })}
            
            <ThemeToggle />
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center border border-border-custom bg-background text-foreground hover:bg-accent-light focus:outline-none focus:ring-1 focus:ring-foreground transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-4 right-4 top-[70px] z-30 bg-background/95 backdrop-blur-lg md:hidden flex flex-col p-6 gap-6 border border-border-custom shadow-lg rounded-none"
          >
            <nav className="flex flex-col gap-4 text-sm font-medium tracking-tight">
              {navItems.map((item, idx) => {
                const isPage = item.href.startsWith("/");
                const linkHref = getHref(item.href);
                const linkContent = (
                  <div className="text-foreground border-b border-border-custom/50 pb-2 flex justify-between items-center w-full">
                    {item.label}
                    <span className="text-xs font-normal text-accent-custom">0{idx + 1}</span>
                  </div>
                );
                
                if (isPage) {
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <Link href={linkHref} onClick={() => setMobileMenuOpen(false)}>
                        {linkContent}
                      </Link>
                    </motion.div>
                  );
                }
                
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={item.label}
                    href={linkHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-foreground border-b border-border-custom/50 pb-2 flex justify-between items-center"
                  >
                    {item.label}
                    <span className="text-xs font-normal text-accent-custom">0{idx + 1}</span>
                  </motion.a>
                );
              })}
            </nav>
            <div className="text-[10px] text-accent-custom tracking-wider font-mono pt-2 border-t border-border-custom/20">
              PORTFOLIO v1.0.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
