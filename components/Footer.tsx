"use client";

import React, { useEffect, useState } from "react";
import { useCMS } from "@/context/CMSContext";
import { ArrowUp } from "lucide-react";

// Inline Premium SVGs for brand icons (Lucide removed them in modern versions)
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Footer() {
  const { profile } = useCMS();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-background border-t border-border-custom py-12 px-6 md:px-12 mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-sm font-medium tracking-tight">
            © {new Date().getFullYear()} {profile.name || "GIBRAN"}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-accent-custom font-medium font-sans">
              Tersedia untuk Proyek Kolaborasi
            </span>
          </div>
        </div>

        {/* Center: Live Time */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs tracking-widest text-accent-custom font-mono">WAKTU LOKAL</span>
          <span className="text-sm font-mono font-medium tabular-nums">{time || "00:00:00 AM"} (WIB)</span>
        </div>

        {/* Right: Social & Scroll To Top */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-custom hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-custom hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            )}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-custom hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
          </div>

          <button
            onClick={scrollToTop}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-custom bg-background text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </footer>
  );
}
