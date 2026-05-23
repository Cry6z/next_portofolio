"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { Skill } from "@/context/CMSContext";

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  // Group skills by category
  const skillCategories = Array.from(new Set(skills.map((s) => s.category)));

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section id="skills" className="py-24 border-t border-border-custom">
      <div className="flex flex-col gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col gap-2"
        >
          <span className="text-xs font-bold tracking-widest font-mono text-accent-custom uppercase">
            KOMPETENSI TEKNIS / 03
          </span>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter">SKILLS.</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              key={category}
              className="flex flex-col gap-6 p-6 border border-border-custom rounded-2xl bg-card-custom"
            >
              <div className="flex items-center gap-2 border-b border-border-custom pb-3">
                <Terminal className="h-4 w-4 text-accent-custom" />
                <h4 className="text-md font-mono font-bold tracking-wider uppercase text-foreground">
                  {category}
                </h4>
              </div>

              <div className="flex flex-col gap-4">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <div key={skill.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span className="text-foreground/90">{skill.name}</span>
                        <span className="text-xs font-mono text-accent-custom">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-border-custom rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-foreground"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
