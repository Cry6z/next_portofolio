"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Profile } from "@/context/CMSContext";
import ProfileCard from "./ProfileCard";

interface HeroSectionProps {
  profile: Profile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  // 3D Avatar Mouse Tracking States (For mobile/tablet screens below xl width)
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  return (
    <section
      id="home"
      className="min-h-[85vh] flex flex-col justify-center py-20 relative overflow-hidden w-screen left-1/2 -translate-x-1/2"
    >
      {/* Minimalist animated background grid effect - Full Screen Width */}
      <div 
        className="absolute inset-[-40px] grid-bg opacity-50 pointer-events-none animate-grid-move" 
      />

      {/* Inner container to keep content aligned with the rest of the site */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left Column: Info */}
        <div className="order-2 lg:order-1 lg:col-span-8 flex flex-col items-start gap-8">
          {/* Massive Modern Bold Name */}
          <div className="overflow-hidden py-2">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-7xl md:text-[8rem] font-extrabold tracking-tighter leading-none text-foreground font-hero"
            >
              {profile.name || "GIBRAN"}
            </motion.h1>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-4xl font-semibold tracking-tight text-accent-custom max-w-3xl font-sans"
          >
            {profile.title || "Creative Developer & UI/UX Designer"}
          </motion.h2>

          {/* Short Bio text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-accent-custom/85 max-w-2xl leading-relaxed font-sans"
          >
            {profile.bio || "Saya merancang dan membangun produk digital yang sangat interaktif, presisi piksel, serta dibekali arsitektur minimalis yang menonjol."}
          </motion.p>

          {/* Interaction Call-to-action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4 mt-4"
          >
            <a
              href="#projects"
              className="flex items-center gap-2 bg-foreground text-background font-semibold rounded-full px-6 py-3 hover:bg-accent-hover transition-all duration-300 group"
            >
              Lihat Karya
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 border border-border-custom hover:border-foreground font-semibold rounded-full px-6 py-3 transition-all duration-300"
            >
              Hubungi Saya
            </a>
          </motion.div>
        </div>

        {/* Right Column: Premium Responsive Avatar */}
        {profile.avatarUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="order-1 lg:order-2 lg:col-span-4 flex flex-col items-center lg:items-end w-full"
          >
            <div className="relative group w-full max-w-[280px] sm:max-w-[340px] lg:w-full lg:max-w-[360px] aspect-[0.718]">
              <ProfileCard
                name={profile.name || "GIBRAN"}
                title={profile.title || "Creative Developer"}
                handle="gibran"
                status="Tersedia untuk proyek"
                contactText="Sapa Saya"
                avatarUrl={profile.avatarUrl}
                miniAvatarUrl={profile.miniAvatarUrl}
                showUserInfo={true}
                enableTilt={false}
                enableMobileTilt={false}
                onContactClick={() => {
                  window.location.href = '#contact';
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono tracking-widest text-accent-custom">SCROLL</span>
        <div className="w-px h-10 bg-border-custom relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-4 bg-foreground animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
