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
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const layer1Ref = React.useRef<HTMLDivElement>(null);
  const layer2Ref = React.useRef<HTMLDivElement>(null);
  const layer3Ref = React.useRef<HTMLDivElement>(null);

  const crosshairHorizRef = React.useRef<HTMLDivElement>(null);
  const crosshairVertRef = React.useRef<HTMLDivElement>(null);
  const spotlightRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;

    // Position Crosshairs
    if (crosshairHorizRef.current) {
      crosshairHorizRef.current.style.transform = `translate3d(0, ${mouseY}px, 0)`;
    }
    if (crosshairVertRef.current) {
      crosshairVertRef.current.style.transform = `translate3d(${mouseX}px, 0, 0)`;
    }

    // Position Spotlight Radial Glow
    if (spotlightRef.current) {
      spotlightRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }

    // Dynamic 3-Layer Parallax transform updates
    if (layer1Ref.current) {
      layer1Ref.current.style.transition = "transform 0.1s ease-out";
      layer1Ref.current.style.transform = `translate3d(${-dx * 0.015}px, ${-dy * 0.015}px, 0)`;
    }
    if (layer2Ref.current) {
      layer2Ref.current.style.transition = "transform 0.1s ease-out";
      layer2Ref.current.style.transform = `translate3d(${-dx * 0.035}px, ${-dy * 0.035}px, 0)`;
    }
    if (layer3Ref.current) {
      layer3Ref.current.style.transition = "transform 0.1s ease-out";
      layer3Ref.current.style.transform = `translate3d(${-dx * 0.06}px, ${-dy * 0.06}px, 0)`;
    }
  };

  const handleMouseEnter = () => {
    const els = [crosshairHorizRef.current, crosshairVertRef.current, spotlightRef.current];
    els.forEach((el) => {
      if (el) {
        el.style.opacity = "1";
        el.style.visibility = "visible";
      }
    });
  };

  const handleMouseLeave = () => {
    const els = [crosshairHorizRef.current, crosshairVertRef.current, spotlightRef.current];
    els.forEach((el) => {
      if (el) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
      }
    });

    // Reset Parallax Layers smoothly
    const layers = [layer1Ref.current, layer2Ref.current, layer3Ref.current];
    layers.forEach((l) => {
      if (l) {
        l.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
        l.style.transform = "translate3d(0px, 0px, 0px)";
      }
    });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="min-h-[85vh] flex flex-col justify-center pt-48 pb-20 relative overflow-hidden w-screen left-1/2 -translate-x-1/2"
    >
      {/* Interactive HUD Overlays */}
      {/* Spotlight Radial Glow */}
      <div
        ref={spotlightRef}
        className="absolute w-75 h-75 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300"
        style={{ top: 0, left: 0, willChange: "transform" }}
      />

      {/* Crosshair Lines */}
      <div
        ref={crosshairHorizRef}
        className="absolute left-0 right-0 h-px border-t border-dashed border-foreground/15 dark:border-foreground/10 pointer-events-none z-10 top-0 opacity-0 transition-opacity duration-300"
        style={{ willChange: "transform" }}
      />
      <div
        ref={crosshairVertRef}
        className="absolute top-0 bottom-0 w-px border-l border-dashed border-foreground/15 dark:border-foreground/10 pointer-events-none z-10 left-0 opacity-0 transition-opacity duration-300"
        style={{ willChange: "transform" }}
      />

      {/* Modern Minimalist Animated Sketch & Grid Background */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sketchFloat1 {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(15px, -20px) rotate(1deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        @keyframes sketchFloat2 {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(-20px, 15px) rotate(-1.5deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        @keyframes sketchFloat3 {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          50% { transform: translate(12px, 15px) scale(1.01) rotate(0.5deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
        }
        @keyframes sketchFloat4 {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(-15px, -15px) rotate(0.5deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        .sk-float-1 { animation: sketchFloat1 28s ease-in-out infinite; transform-origin: center; }
        .sk-float-2 { animation: sketchFloat2 36s ease-in-out infinite; transform-origin: center; }
        .sk-float-3 { animation: sketchFloat3 32s ease-in-out infinite; transform-origin: center; }
        .sk-float-4 { animation: sketchFloat4 24s ease-in-out infinite; transform-origin: center; }
      `}} />

      {/* Layer 1: Base Grid & Info Text (Slowest / Deepest) */}
      <div
        ref={layer1Ref}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-35 dark:opacity-25"
        style={{ willChange: "transform" }}
      >
        <svg
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-foreground"
          preserveAspectRatio="none"
        >
          {/* Minimalist Grid Pattern */}
          <defs>
            <pattern id="sketch-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.3" className="opacity-10 dark:opacity-5" />
              <circle cx="40" cy="40" r="0.75" fill="currentColor" className="opacity-10 dark:opacity-5" />
              <circle cx="80" cy="80" r="1.2" fill="currentColor" className="opacity-20 dark:opacity-10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sketch-grid)" />

          {/* Technical Info Texts & Equations */}
          <g className="opacity-60 font-mono text-[9px]">
            <text x="80" y="100" fill="currentColor">SCALE: 1.000</text>
            <text x="80" y="120" fill="currentColor">GRID: 80x80 PIXELS</text>
            <text x="80" y="140" fill="currentColor">SYSTEM_PROJ: v1.0.4</text>
            <text x="80" y="160" fill="currentColor">RENDER_LATENCY: &lt; 1ms</text>
            <text x="1220" y="100" fill="currentColor">∇ × E = -∂B/∂t</text>
            <text x="1220" y="120" fill="currentColor">e^(iπ) + 1 = 0</text>
            <text x="1220" y="140" fill="currentColor">∮ B · dl = μ₀ I_enc</text>
          </g>
        </svg>
      </div>

      {/* Layer 2: Concentric circles, Fibonacci spiral, degree arcs, math elements (Medium Speed) */}
      <div
        ref={layer2Ref}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-25 dark:opacity-20"
        style={{ willChange: "transform" }}
      >
        <svg
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-foreground"
          preserveAspectRatio="none"
        >
          {/* Concentric Guide Circles & Arcs */}
          <g className="opacity-20 dark:opacity-15">
            <circle cx="720" cy="400" r="350" stroke="currentColor" strokeWidth="0.6" strokeDasharray="6 6" className="sk-float-1" />
            <circle cx="720" cy="400" r="250" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" className="sk-float-4" />
            <circle cx="720" cy="400" r="160" stroke="currentColor" strokeWidth="0.5" className="sk-float-2" />
            <circle cx="720" cy="400" r="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="sk-float-3" />
            <circle cx="720" cy="400" r="40" stroke="currentColor" strokeWidth="0.5" className="sk-float-1" />

            {/* Center Grid Axes */}
            <line x1="-100" y1="400" x2="1540" y2="400" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 4" />
            <line x1="720" y1="-100" x2="720" y2="900" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 4" />

            {/* Drafting ticks & markers */}
            <path d="M720,150 L730,150 M720,650 L730,650 M470,400 L470,410 M970,400 L970,410" stroke="currentColor" strokeWidth="0.8" />
            <text x="735" y="153" fill="currentColor" className="text-[8px] font-mono">R=250.0</text>
            <text x="975" y="415" fill="currentColor" className="text-[8px] font-mono">DX=250.0</text>
            <text x="735" y="63" fill="currentColor" className="text-[8px] font-mono">R=350.0</text>
          </g>

          {/* Fibonacci spiral centered at 720, 400 */}
          <path
            d="M720,400 A1,1 0 0,1 721,400 A1,1 0 0,1 721,402 A2,2 0 0,1 719,402 A3,3 0 0,1 719,399 A5,5 0 0,1 724,399 A8,8 0 0,1 724,407 A13,13 0 0,1 711,407 A21,21 0 0,1 711,386 A34,34 0 0,1 745,386 A55,55 0 0,1 745,441 A89,89 0 0,1 656,441 A144,144 0 0,1 656,297 A233,233 0 0,1 889,297 A377,377 0 0,1 889,674 A610,610 0 0,1 279,674"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            className="opacity-25 dark:opacity-15 sk-float-3"
          />

          {/* Formulas and ratio labels */}
          <g className="opacity-40 font-mono text-[8px] sk-float-2">
            <text x="735" y="385" fill="currentColor">φ = 1.6180339887...</text>
            <text x="600" y="300" fill="currentColor">f(x) = ∫_(-∞)^(∞) f̂(ξ) e^(2πixξ) dξ</text>
            <text x="830" y="520" fill="currentColor">iℏ ∂/∂t |Ψ⟩ = Ĥ |Ψ⟩</text>
          </g>
        </svg>
      </div>

      {/* Layer 3: Hand-drawn waves, sketchy coils, hatching (Fastest / Foreground) */}
      <div
        ref={layer3Ref}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-30 dark:opacity-20"
        style={{ willChange: "transform" }}
      >
        <svg
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-foreground"
          preserveAspectRatio="none"
        >
          {/* Scribble Wave Loop 1 */}
          <g className="sk-float-1">
            <path
              d="M-100,200 C300,100 500,700 800,400 C1100,100 1200,600 1600,300"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="opacity-20 dark:opacity-15"
            />
            <path
              d="M-98,203 C298,102 503,697 797,402 C1102,98 1198,603 1602,298"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              className="opacity-10 dark:opacity-8"
            />
          </g>

          {/* Scribble Wave Loop 2 */}
          <g className="sk-float-2">
            <path
              d="M-50,600 C200,300 600,750 900,450 C1200,150 1300,500 1650,400"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="opacity-15 dark:opacity-10"
            />
            <path
              d="M-48,598 C198,302 602,748 898,452 C1198,148 1298,502 1648,398"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinecap="round"
              className="opacity-8 dark:opacity-4"
            />
          </g>

          {/* Sine Wave drafting waveform */}
          <g className="sk-float-4 opacity-12 dark:opacity-8">
            <path
              d="M-100,500 Q150,350 400,500 T900,500 T1400,500 T1600,500"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <path
              d="M-100,505 Q150,355 400,505 T900,505 T1400,505 T1600,505"
              stroke="currentColor"
              strokeWidth="0.6"
              className="opacity-50"
            />
          </g>

          {/* Scribble Messy Circle/Coil in Center */}
          <g className="sk-float-3">
            <path
              d="M700,300 C800,200 950,250 900,400 C850,550 700,500 750,350 C800,200 950,250 900,400"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="opacity-15 dark:opacity-10"
            />
            <path
              d="M702,298 C798,202 952,248 898,402 C848,548 698,502 748,348 C798,202 952,248 898,402"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinecap="round"
              className="opacity-8 dark:opacity-4"
            />
          </g>

          {/* Scribble Messy Loop in Bottom Left */}
          <g className="sk-float-4">
            <path
              d="M150,550 C300,680 480,500 350,380 C220,260 100,400 280,480"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="opacity-15 dark:opacity-10"
            />
          </g>

          {/* Hatching 1 (Top right) */}
          <g className="sk-float-2 opacity-12 dark:opacity-8">
            <line x1="1200" y1="50" x2="1350" y2="200" stroke="currentColor" strokeWidth="1" />
            <line x1="1220" y1="50" x2="1370" y2="200" stroke="currentColor" strokeWidth="1" />
            <line x1="1240" y1="50" x2="1390" y2="200" stroke="currentColor" strokeWidth="1" />
            <line x1="1260" y1="50" x2="1410" y2="200" stroke="currentColor" strokeWidth="1" />
          </g>

          {/* Hatching 2 (Bottom right) */}
          <g className="sk-float-1 opacity-12 dark:opacity-8">
            <line x1="1250" y1="650" x2="1400" y2="500" stroke="currentColor" strokeWidth="1" />
            <line x1="1270" y1="650" x2="1420" y2="500" stroke="currentColor" strokeWidth="1" />
            <line x1="1290" y1="650" x2="1440" y2="500" stroke="currentColor" strokeWidth="1" />
          </g>

          {/* Hatching 3 (Left center) */}
          <g className="sk-float-3 opacity-12 dark:opacity-8">
            <line x1="50" y1="200" x2="200" y2="150" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="220" x2="200" y2="170" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="240" x2="200" y2="190" stroke="currentColor" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* Radial fade mask to blend the grid/sketch into the background smoothly towards edges */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,var(--background)_92%)]" />

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
              className="flex items-center gap-2 bg-foreground text-background font-semibold rounded-none px-6 py-3 hover:bg-accent-hover transition-all duration-300 group"
            >
              Lihat Karya
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 border border-border-custom hover:border-foreground font-semibold rounded-none px-6 py-3 transition-all duration-300"
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
            <div className="relative group w-full max-w-70 sm:max-w-85 lg:w-full lg:max-w-90 aspect-[0.718]">
              <ProfileCard
                name={profile.name || "GIBRAN"}
                title={profile.title || "Creative Developer"}
                handle={profile.handle || "gibran"}
                status={profile.status || "Tersedia untuk proyek"}
                contactText={profile.contactText || "Sapa Saya"}
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
