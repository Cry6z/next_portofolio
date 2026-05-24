"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Project } from "@/context/CMSContext";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className="group flex flex-col gap-4 border border-border-custom p-5 rounded-2xl bg-card-custom hover:border-foreground/35 transition-all duration-500 relative overflow-hidden cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.015)]"
      whileHover={{ y: -6 }}
    >
      {/* Featured Star/Tag */}
      {project.featured && (
        <div className="absolute top-4 right-4 bg-foreground text-background text-[9px] font-bold font-mono tracking-widest px-2.5 py-1 rounded-full uppercase z-10">
          Unggulan
        </div>
      )}

      {/* Project Image Panel */}
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-accent-light relative">
        <img
          src={project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800"}
          alt={project.title}
          className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* Hover Overlay CTA */}
        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-xs font-mono font-bold tracking-wider border border-white/30 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full uppercase flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            Lihat Detail <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Project Meta Info */}
      <div className="flex flex-col gap-2 flex-1 mt-1">
        <div className="flex flex-wrap gap-1.5">
          {/* Project Category Tag */}
          {project.tags[0] && (
            <span className="text-[9px] font-mono font-bold tracking-wider px-2.5 py-0.5 border border-foreground/15 bg-foreground/5 rounded-md text-foreground">
              📁 {project.tags[0]}
            </span>
          )}
          {/* Tech stack tags */}
          {project.tags.slice(1, 4).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono tracking-wider px-2 py-0.5 border border-border-custom bg-background rounded-md text-accent-custom"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 border border-border-custom bg-background rounded-md text-accent-custom">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        <h4 className="text-xl font-bold tracking-tight mt-1 text-foreground flex items-center justify-between">
          {project.title}
          <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-accent-custom" />
        </h4>

        <p className="text-xs text-accent-custom leading-relaxed line-clamp-2 font-sans mt-0.5">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
