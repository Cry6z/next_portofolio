"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skill } from "@/context/CMSContext";

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Get unique categories and normalize them
  const categories = useMemo(() => {
    const unique = Array.from(new Set(skills.map((s) => s.category.toLowerCase())));
    return ["all", ...unique];
  }, [skills]);

  // Filter skills based on active category
  const filteredSkills = useMemo(() => {
    if (activeCategory === "all") return skills;
    return skills.filter((s) => s.category.toLowerCase() === activeCategory);
  }, [skills, activeCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 22 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <section id="skills" className="py-24 border-t border-border-custom">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-widest font-mono text-accent-custom uppercase">
            KOMPETENSI TEKNIS / 03
          </span>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase font-mono">SKILLS.</h3>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-border-custom/30">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer rounded-none border ${
                activeCategory === cat
                  ? "bg-foreground text-background border-foreground font-bold"
                  : "bg-transparent text-accent-custom border-border-custom/50 hover:text-foreground hover:border-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const filledBlocks = Math.round(skill.level / 10);
              
              return (
                <motion.div
                  key={skill.id}
                  variants={cardVariants}
                  layout
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative p-5 border border-border-custom bg-card-custom hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 flex flex-col justify-between min-h-[130px] shadow-sm select-none cursor-default"
                >
                  {/* Top Info */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold tracking-widest font-mono text-accent-custom group-hover:text-background/60 transition-colors uppercase">
                      {skill.category}
                    </span>
                    <h4 className="text-base font-bold font-mono text-foreground group-hover:text-background transition-colors leading-tight">
                      {skill.name}
                    </h4>
                  </div>

                  {/* Matrix Blocks and Percentage */}
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-accent-custom group-hover:text-background/50 transition-colors uppercase tracking-wider">
                        LEVEL: {skill.level >= 90 ? "Expert" : skill.level >= 75 ? "Advanced" : "Intermediate"}
                      </span>
                      <span className="font-bold text-foreground group-hover:text-background transition-colors">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Visual Blocks matrix indicator */}
                    <div className="flex gap-1 justify-between">
                      {Array.from({ length: 10 }).map((_, idx) => {
                        const isFilled = idx < filledBlocks;
                        return (
                          <div
                            key={idx}
                            className={`flex-1 h-3.5 border transition-all duration-300 ${
                              isFilled
                                ? "bg-foreground border-foreground group-hover:bg-background group-hover:border-background"
                                : "bg-transparent border-border-custom group-hover:border-background/30"
                            }`}
                            style={{ transitionDelay: `${idx * 15}ms` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
