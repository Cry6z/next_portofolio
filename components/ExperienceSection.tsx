"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Experience } from "@/context/CMSContext";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  if (!experiences || experiences.length === 0) {
    return null;
  }

  const safeActiveIndex = Math.min(activeIndex, experiences.length - 1);
  const activeExp = experiences[safeActiveIndex];

  return (
    <section id="experience" className="py-24 border-t border-border-custom">
      <div className="flex flex-col gap-16">
        {/* Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col gap-2"
        >
          <span className="text-xs font-bold tracking-widest font-mono text-accent-custom uppercase">
            RIWAYAT KARIR / 04
          </span>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter">EXPERIENCE.</h3>
        </motion.div>

        {/* Desktop Master-Detail View */}
        <div className="hidden md:grid grid-cols-12 gap-8 w-full max-w-5xl mx-auto items-start">
          {/* Sidebar Tab Navigator */}
          <div className="col-span-4 border border-border-custom bg-background/50 rounded-none flex flex-col overflow-hidden">
            {experiences.map((exp, idx) => (
              <button
                key={exp.id}
                onClick={() => setActiveIndex(idx)}
                className={`w-full text-left font-mono py-4 px-4 flex items-center justify-between transition-all duration-300 relative border-b border-border-custom/30 last:border-0 cursor-pointer ${
                  safeActiveIndex === idx
                    ? "text-foreground bg-accent-light font-bold"
                    : "text-accent-custom hover:text-foreground hover:bg-accent-light/50"
                }`}
              >
                <div className="flex items-center gap-3 transition-transform duration-300 ease-out group hover:translate-x-1">
                  <span className="text-[10px] opacity-60">
                    [{String(idx + 1).padStart(2, "0")}]
                  </span>
                  <span className="font-bold tracking-tight text-xs uppercase">
                    {exp.company}
                  </span>
                </div>
                {safeActiveIndex === idx && (
                  <motion.span
                    layoutId="activePointer"
                    className="text-foreground text-xs font-bold font-mono"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    &gt;
                  </motion.span>
                )}
              </button>
            ))}
          </div>

          {/* Technical Detail Panel */}
          <div className="col-span-8 border border-border-custom bg-background/40 p-6 md:p-8 rounded-none relative min-h-80 flex flex-col justify-between overflow-hidden">
            {/* Dot-matrix Mesh Grid Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
                backgroundSize: "16px 16px",
              }}
            />

            {/* Corner Crosshairs */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 font-mono text-accent-custom select-none text-[12px] font-bold z-10 pointer-events-none">+</div>
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 font-mono text-accent-custom select-none text-[12px] font-bold z-10 pointer-events-none">+</div>
            <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 font-mono text-accent-custom select-none text-[12px] font-bold z-10 pointer-events-none">+</div>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 font-mono text-accent-custom select-none text-[12px] font-bold z-10 pointer-events-none">+</div>

            <AnimatePresence mode="wait">
              {activeExp && (
                <motion.div
                  key={safeActiveIndex}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative z-10 h-full flex flex-col justify-between gap-6"
                >
                  <div>
                    {/* Technical Metadata Header */}
                    <div className="flex justify-between items-center border-b border-border-custom/20 pb-3 mb-5 font-mono text-[9px] text-accent-custom leading-none select-none">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>FILE: EXPERIENCE_{String(safeActiveIndex + 1).padStart(2, "0")}.LOG</span>
                      </div>
                      <span>ENCODING: UTF-8</span>
                    </div>

                    {/* Job Role, Company & Period Info */}
                    <div className="flex flex-col gap-1">
                      <h4 className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                        {activeExp.role}
                      </h4>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-accent-custom mt-1 select-none">
                        <span className="font-bold text-foreground">{activeExp.company}</span>
                        <span>//</span>
                        <span>{activeExp.period}</span>
                      </div>
                    </div>

                    {/* Job Description */}
                    <p className="text-sm text-accent-custom leading-relaxed font-sans mt-4 max-w-2xl whitespace-pre-line">
                      {activeExp.description}
                    </p>
                  </div>

                  {/* Technical Status Footer */}
                  <div className="font-mono text-[8px] text-accent-custom/50 border-t border-border-custom/10 pt-2 mt-auto flex justify-between select-none">
                    <span>REF: {activeExp.id}</span>
                    <span>STATUS: SECURE_LOG_STABLE</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile/Tablet Accordion View */}
        <div className="flex flex-col gap-4 md:hidden w-full max-w-2xl mx-auto">
          {experiences.map((exp, idx) => {
            const isOpen = openAccordionIndex === idx;
            return (
              <div
                key={exp.id}
                className="border border-border-custom bg-background/40 rounded-none relative overflow-hidden"
              >
                {/* Corner Crosshairs for Mobile */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 font-mono text-accent-custom/40 select-none text-[10px] font-bold z-10 pointer-events-none">+</div>
                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 font-mono text-accent-custom/40 select-none text-[10px] font-bold z-10 pointer-events-none">+</div>
                <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 font-mono text-accent-custom/40 select-none text-[10px] font-bold z-10 pointer-events-none">+</div>
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 font-mono text-accent-custom/40 select-none text-[10px] font-bold z-10 pointer-events-none">+</div>

                {/* Accordion Header Trigger */}
                <button
                  onClick={() => setOpenAccordionIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex flex-col gap-1 relative z-10 cursor-pointer select-none"
                >
                  <div className="flex justify-between items-baseline w-full">
                    <span className="text-[10px] font-mono text-accent-custom leading-none uppercase">
                      [{String(idx + 1).padStart(2, "0")}] {exp.company}
                    </span>
                    <span className="text-xs font-mono text-accent-custom leading-none font-bold">
                      {isOpen ? "[-]" : "[+]"}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold tracking-tight text-foreground mt-1 leading-snug">
                    {exp.role}
                  </h4>
                  <span className="text-[10px] font-mono text-accent-custom opacity-85 mt-0.5">
                    {exp.period}
                  </span>
                </button>

                {/* Accordion Content Drawer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 relative z-10 border-t border-border-custom/20">
                        {/* Dot-matrix Mesh Grid Background for Mobile Drawer */}
                        <div
                          className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04]"
                          style={{
                            backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
                            backgroundSize: "16px 16px",
                          }}
                        />
                        <div className="flex justify-between items-center pb-2 mb-3 font-mono text-[8px] text-accent-custom/60 border-b border-border-custom/10 select-none relative z-10">
                          <span>FILE: EXPERIENCE_{String(idx + 1).padStart(2, "0")}.LOG</span>
                          <span>ENCODING: UTF-8</span>
                        </div>
                        <p className="text-sm text-accent-custom leading-relaxed font-sans whitespace-pre-line relative z-10">
                          {exp.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

