"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCMS, GalleryItem } from "@/context/CMSContext";
import Link from "next/link";
import { createPortal } from "react-dom";

interface GallerySectionProps {
  gallery: GalleryItem[];
  limit?: number;
}

export default function GallerySection({ gallery, limit }: GallerySectionProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation inside Lightbox
  useEffect(() => {
    if (activePhotoIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePhotoIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActivePhotoIndex((prev) => (prev === null || prev === 0 ? gallery.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActivePhotoIndex((prev) => (prev === null || prev === gallery.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, gallery.length]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section id="gallery" className="py-24 border-t border-border-custom">
      <div className="flex flex-col gap-12">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col gap-2"
        >
          <span className="text-xs font-bold tracking-widest font-mono text-accent-custom uppercase">
            JURNAL VISUAL / 03
          </span>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter">GALLERY.</h3>
          <p className="text-xs text-accent-custom leading-relaxed font-mono uppercase mt-1">
            Koleksi momen, inspirasi setup, dan estetika visual pilihan
          </p>
        </motion.div>

        {/* Masonry Photo Grid */}
        {!gallery || gallery.length === 0 ? (
          <div className="py-24 text-center border border-border-custom bg-card-custom rounded-none font-mono text-xs uppercase text-accent-custom">
            Belum ada foto di dalam galeri.
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:balance]">
              {(() => {
                const aspectRatios = [
                  "aspect-[4/3]",
                  "aspect-[3/4]",
                  "aspect-[1/1]",
                  "aspect-[16/9]",
                  "aspect-[3/2]",
                  "aspect-[4/5]",
                ];
                const showViewMoreCard = limit !== undefined && gallery.length > limit;
                const itemsToShow = showViewMoreCard ? gallery.slice(0, limit) : gallery;

                return (
                  <>
                    {itemsToShow.map((item, index) => {
                      const randomAspect = aspectRatios[index % aspectRatios.length];
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                          onClick={() => setActivePhotoIndex(index)}
                          className="break-inside-avoid mb-6 group relative overflow-hidden cursor-pointer rounded-none hover:-translate-y-1 transition-[transform] duration-300 ease-out transform-gpu"
                        >
                          <div className={`w-full overflow-hidden rounded-none relative ${randomAspect}`}>
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Foto Galeri"}
                      className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-300 ease-out group-hover:scale-[1.03] transform-gpu"
                      style={{ willChange: "filter, transform" }}
                      loading="lazy"
                    />
                    {/* Hover Overlay CTA */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <span className="text-foreground text-xs font-mono font-bold tracking-wider border border-border-custom bg-background px-4 py-2 rounded-none uppercase transform translate-y-2 group-hover:translate-y-0 transition-[transform] duration-300 ease-out transform-gpu">
                        Perbesar Foto
                      </span>
                    </div>
                  </div>        
                        </motion.div>
                      );
                    })}
                  </>
                );
              })()}
            </div>

            {/* Centered Navigation Card underneath the Grid */}
            {limit !== undefined && gallery.length > limit && (
              <div className="w-full flex justify-center mt-4">
                <Link href="/gallery" className="w-full sm:w-auto min-w-[280px]">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group border border-border-custom hover:border-foreground/35 bg-card-custom p-4 rounded-none text-center font-mono cursor-pointer transition-all duration-300 shadow-sm"
                  >
                    <span className="text-xs font-bold text-accent-custom group-hover:text-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                      Lihat Foto Lainnya <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </span>
                  </motion.div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal (Rendered at Body level to escape parent transforms) */}
      {mounted && createPortal(
        <AnimatePresence>
          {activePhotoIndex !== null && gallery[activePhotoIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePhotoIndex(null)}
              className="fixed inset-0 z-9999 overflow-hidden bg-background/95 backdrop-blur-md flex flex-col justify-between p-6 select-none"
            >
              {/* Top controls */}
              <div className="flex justify-between items-center w-full z-10 shrink-0 pb-4">
                <div className="flex items-center gap-2 font-mono text-[10px] text-accent-custom uppercase tracking-widest">
                  <span>FOTO</span>
                  <span>/</span>
                  <span className="text-foreground font-bold">{activePhotoIndex + 1} OF {gallery.length}</span>
                </div>
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="h-9 w-9 rounded-none bg-background/85 border border-border-custom flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                  title="Tutup (ESC)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Central image viewer */}
              <div className="flex-1 w-full flex items-center justify-center relative p-4 max-h-[80vh]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePhotoIndex}
                    src={gallery[activePhotoIndex].imageUrl}
                    alt={gallery[activePhotoIndex].title || "Foto Galeri"}
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="max-w-full max-h-full object-contain rounded-none shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </AnimatePresence>

                {/* Arrow Navs */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex((prev) => (prev === null || prev === 0 ? gallery.length - 1 : prev - 1));
                      }}
                      className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-none bg-background/80 border border-border-custom hover:bg-foreground hover:text-background transition-all flex items-center justify-center shadow z-20 cursor-pointer"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoIndex((prev) => (prev === null || prev === gallery.length - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-none bg-background/80 border border-border-custom hover:bg-foreground hover:text-background transition-all flex items-center justify-center shadow z-20 cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Empty space footer for layout balancing */}
              <div className="h-4 w-full" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
