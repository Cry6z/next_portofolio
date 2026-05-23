"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { Experience } from "@/context/CMSContext";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section id="experience" className="py-24 border-t border-border-custom">
      <div className="flex flex-col gap-16">
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

        {/* Vertical Timeline */}
        <div className="relative pl-6 md:pl-8 border-l border-border-custom max-w-4xl mx-auto w-full flex flex-col gap-12 py-4">
          {experiences.map((exp, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={exp.id}
              className="relative flex flex-col gap-2"
            >
              {/* Circle Indicator on Timeline Line */}
              <div className="absolute -left-31px md:-left-39px top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-foreground z-10 shadow-sm" />

              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold tracking-wider text-accent-custom uppercase flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3" />
                    {exp.company}
                  </span>
                  <h4 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                    {exp.role}
                  </h4>
                </div>
                <span className="text-xs font-mono font-medium border border-border-custom px-3 py-1 rounded-full bg-accent-light self-start">
                  {exp.period}
                </span>
              </div>

              <p className="text-sm md:text-base text-accent-custom leading-relaxed font-sans max-w-3xl mt-2">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
