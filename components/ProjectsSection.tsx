"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Project } from "@/context/CMSContext";

// Inline Premium SVGs for brand icons (Lucide removed them in modern versions)
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState("Semua");

  // Filter projects tags
  const allTags = ["Semua", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];
  const filteredProjects =
    activeFilter === "Semua"
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter));

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section id="projects" className="py-24 border-t border-border-custom">
      <div className="flex flex-col gap-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold tracking-widest font-mono text-accent-custom uppercase">
              KARYA PILIHAN / 01
            </span>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">PROJECTS.</h3>
          </div>

          {/* Tags Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-300 border ${
                  activeFilter === tag
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border-custom hover:border-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                key={project.id}
                className="group flex flex-col gap-4 border border-border-custom p-6 rounded-2xl bg-card-custom hover:border-foreground/45 transition-all duration-300 relative overflow-hidden"
              >
                {/* Featured Star/Tag */}
                {project.featured && (
                  <div className="absolute top-4 right-4 bg-foreground text-background text-[10px] font-bold font-mono tracking-widest px-2.5 py-1 rounded-full uppercase z-10">
                    Unggulan
                  </div>
                )}

                {/* Project Image Panel */}
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-accent-light relative">
                  <img
                    src={project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800"}
                    alt={project.title}
                    className="object-cover w-full h-full filter grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Project Meta Info */}
                <div className="flex flex-col gap-2 flex-1 mt-2">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono tracking-wider px-2 py-0.5 border border-border-custom bg-background rounded-md text-accent-custom"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
                    {project.title}
                  </h4>

                  <p className="text-sm text-accent-custom leading-relaxed line-clamp-3 font-sans">
                    {project.description}
                  </p>

                  {/* Project Links */}
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border-custom/50">
                    {project.demoUrl && project.demoUrl !== "#" && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold hover:underline"
                      >
                        Live Demo
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== "#" && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold hover:underline text-accent-custom hover:text-foreground"
                      >
                        Source Code
                        <GithubIcon className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
