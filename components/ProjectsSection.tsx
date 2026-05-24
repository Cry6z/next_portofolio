"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/context/CMSContext";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "./ProjectDetailModal";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter projects by category (stored as the first tag index: tags[0])
  const allTags = ["Semua", ...Array.from(new Set(projects.map((p) => p.tags[0]).filter(Boolean)))];
  const filteredProjects =
    activeFilter === "Semua"
      ? projects
      : projects.filter((p) => p.tags[0] === activeFilter);

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
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Dynamic Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
