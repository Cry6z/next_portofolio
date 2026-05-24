"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Project } from "@/context/CMSContext";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Reset screenshot index when project changes or opens
  useEffect(() => {
    setScreenshotIndex(0);
  }, [project]);

  if (!mounted || !project) return null;

  const activeProjectImages = [project.image, ...(project.screenshots || [])].filter(Boolean);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScreenshotIndex((prev) => (prev === 0 ? activeProjectImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScreenshotIndex((prev) => (prev === activeProjectImages.length - 1 ? 0 : prev + 1));
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-md flex justify-center items-start md:items-center p-4 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative my-auto w-full max-w-5xl bg-card-custom border border-border-custom rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row focus:outline-none md:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-background/70 border border-border-custom backdrop-blur-md flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
              title="Tutup (ESC)"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Gallery Column (Left/Top) */}
            <div className="w-full md:w-3/5 bg-accent-light/30 relative flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border-custom h-[35vh] md:h-auto min-h-[300px] shrink-0">
              {activeProjectImages.length > 0 ? (
                <div className="w-full h-full relative flex items-center justify-center p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={screenshotIndex}
                      src={activeProjectImages[screenshotIndex]}
                      alt={`${project.title} screenshot ${screenshotIndex}`}
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.3 }}
                      className="object-contain max-w-full max-h-full rounded-xl shadow-md filter grayscale-0"
                    />
                  </AnimatePresence>

                  {/* Navigation Chevrons */}
                  {activeProjectImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 border border-border-custom hover:bg-foreground hover:text-background transition-all flex items-center justify-center shadow cursor-pointer"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 border border-border-custom hover:bg-foreground hover:text-background transition-all flex items-center justify-center shadow cursor-pointer"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Image Counter Badge */}
                  {activeProjectImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 border border-border-custom px-3 py-1 rounded-full text-[10px] font-mono tracking-widest shadow">
                      {screenshotIndex + 1} / {activeProjectImages.length}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs font-mono text-accent-custom">Tidak ada gambar mockup</div>
              )}
            </div>

            {/* Content Column (Right/Bottom) */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-h-none md:max-h-[90vh]">
              {/* Header Meta */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-accent-custom uppercase">
                    DETAIL PROYEK
                  </span>
                  {project.featured && (
                    <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 bg-foreground text-background rounded uppercase">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  {project.title}
                </h3>
              </div>

              {/* Tags pills */}
              <div className="flex flex-wrap gap-1.5 border-b border-border-custom/50 pb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono tracking-wider px-2.5 py-1 border border-border-custom bg-background rounded-full text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description sections */}
              <div className="flex flex-col gap-4 text-xs leading-relaxed text-accent-custom font-sans">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold font-mono text-foreground uppercase tracking-widest">
                    Ringkasan
                  </span>
                  <p className="font-medium text-foreground">{project.description}</p>
                </div>
                
                {project.details && (
                  <div className="flex flex-col gap-1.5 border-t border-border-custom/40 pt-4 mt-2">
                    <span className="text-[10px] font-bold font-mono text-foreground uppercase tracking-widest">
                      Detail & Fitur
                    </span>
                    <p className="whitespace-pre-wrap font-light">{project.details}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-border-custom">
                {project.demoUrl && project.demoUrl !== "#" && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-foreground text-background rounded-xl py-3 hover:bg-accent-hover transition-all"
                  >
                    Kunjungi Demo
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== "#" && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 text-xs font-semibold border border-border-custom bg-background text-foreground rounded-xl py-3 hover:border-foreground/45 transition-all hover:text-foreground"
                  >
                    GitHub Repository
                    <GithubIcon className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              {/* Carousel Thumbnails indicator at the bottom (if there are multiple screenshots) */}
              {activeProjectImages.length > 1 && (
                <div className="flex items-center gap-1.5 justify-center mt-2 flex-wrap pb-2">
                  {activeProjectImages.map((shot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setScreenshotIndex(idx)}
                      className={`h-8 w-12 rounded overflow-hidden border transition-all cursor-pointer ${
                        screenshotIndex === idx
                          ? "border-foreground scale-105"
                          : "border-border-custom hover:border-foreground/30 opacity-70"
                      }`}
                    >
                      <img src={shot} alt="thumb" className="object-cover h-full w-full grayscale" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
