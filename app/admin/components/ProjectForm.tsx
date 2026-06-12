"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { Project } from "@/context/CMSContext";

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingProject: Project | null;
  onSave: (project: Omit<Project, "id"> | Partial<Project>) => void;
  tags: string[];
  addTag: (name: string) => Promise<void>;
}

export default function ProjectForm({ isOpen, onClose, editingProject, onSave, tags, addTag }: ProjectFormProps) {
  const [inlineNewTag, setInlineNewTag] = useState("");
  const [category, setCategory] = useState("");
  const [projectFormData, setProjectFormData] = useState<{
    title: string;
    description: string;
    details: string;
    image: string;
    thumbnail: string;
    tags: string[];
    demoUrl: string;
    githubUrl: string;
    featured: boolean;
    screenshots: string[];
  }>({
    title: "",
    description: "",
    details: "",
    image: "",
    thumbnail: "",
    tags: [],
    demoUrl: "",
    githubUrl: "",
    featured: false,
    screenshots: [],
  });

  useEffect(() => {
    if (editingProject) {
      setProjectFormData({
        title: editingProject.title || "",
        description: editingProject.description || "",
        details: editingProject.details || "",
        image: editingProject.image || "",
        thumbnail: editingProject.thumbnail || "",
        tags: editingProject.tags ? editingProject.tags.slice(1) : [],
        demoUrl: editingProject.demoUrl || "",
        githubUrl: editingProject.githubUrl || "",
        featured: editingProject.featured || false,
        screenshots: editingProject.screenshots || [],
      });
      setCategory(editingProject.tags && editingProject.tags[0] ? editingProject.tags[0] : "");
    } else {
      setProjectFormData({
        title: "",
        description: "",
        details: "",
        image: "",
        thumbnail: "",
        tags: [],
        demoUrl: "",
        githubUrl: "",
        featured: false,
        screenshots: [],
      });
      setCategory("");
    }
  }, [editingProject, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 5MB untuk optimasi penyimpanan.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddInlineTag = async () => {
    const trimmed = inlineNewTag.trim();
    if (!trimmed) return;
    await addTag(trimmed);
    if (!projectFormData.tags.includes(trimmed)) {
      setProjectFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
    }
    setInlineNewTag("");
  };

  const handleToggleTag = (tag: string) => {
    if (projectFormData.tags.includes(tag)) {
      setProjectFormData((prev) => ({
        ...prev,
        tags: prev.tags.filter((t) => t !== tag),
      }));
    } else {
      setProjectFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleAddScreenshotSlot = () => {
    if (projectFormData.screenshots.length >= 10) return;
    setProjectFormData((prev) => ({
      ...prev,
      screenshots: [...prev.screenshots, ""],
    }));
  };

  const handleRemoveScreenshotSlot = (index: number) => {
    setProjectFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const handleScreenshotChange = (index: number, val: string) => {
    const next = [...projectFormData.screenshots];
    next[index] = val;
    setProjectFormData((prev) => ({
      ...prev,
      screenshots: next,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category.trim() || "Website";
    onSave({
      ...projectFormData,
      tags: [finalCategory, ...projectFormData.tags],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="border border-border-custom bg-card-custom p-4 md:p-6 rounded-none flex flex-col gap-4 shadow-sm"
        >
          <div className="flex justify-between items-center border-b border-border-custom pb-2">
            <h3 className="text-sm font-black font-mono uppercase tracking-tight text-foreground">
              {editingProject ? "Edit Proyek" : "Tambah Proyek Baru"}
            </h3>
            <button
              onClick={onClose}
              className="text-accent-custom hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                Judul Proyek *
              </label>
              <input
                type="text"
                required
                value={projectFormData.title}
                onChange={(e) =>
                  setProjectFormData({ ...projectFormData, title: e.target.value })
                }
                placeholder="Nama proyek..."
                className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
              />
            </div>

            {/* Project Category Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                Kategori Proyek * (Contoh: Website, Application, Design - Filter utama)
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Masukkan kategori proyek..."
                className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground w-full font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                Gambar Mockup (Link URL / Upload Lokal)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={projectFormData.image}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, image: e.target.value })
                  }
                  placeholder="https://unsplash.com/... atau Base64"
                  className="flex-1 bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
                />
                <label className="border border-border-custom hover:border-foreground bg-background hover:bg-foreground hover:text-background text-foreground text-[10px] font-mono uppercase font-bold rounded-none px-3 py-1.5 cursor-pointer flex items-center justify-center shrink-0 transition-colors">
                  <span>Pilih File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, (b64) => setProjectFormData({ ...projectFormData, image: b64 }))}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                Gambar Thumbnail (Link URL / Upload Lokal)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={projectFormData.thumbnail}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, thumbnail: e.target.value })
                  }
                  placeholder="Link URL / Base64 (Kosongkan jika sama dengan Mockup)"
                  className="flex-1 bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
                />
                <label className="border border-border-custom hover:border-foreground bg-background hover:bg-foreground hover:text-background text-foreground text-[10px] font-mono uppercase font-bold rounded-none px-3 py-1.5 cursor-pointer flex items-center justify-center shrink-0 transition-colors">
                  <span>Pilih File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, (b64) => setProjectFormData({ ...projectFormData, thumbnail: b64 }))}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Tags Multi-select Panel */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                Teknologi / Tags * (Pilih dari Pool Tag Global)
              </label>
              <div className="flex flex-wrap gap-1.5 p-3 border border-border-custom rounded-none bg-background min-h-[60px]">
                {tags.length === 0 ? (
                  <span className="text-xs text-accent-custom italic font-mono">Tidak ada tag global. Tambah di bawah atau di Tag Manager.</span>
                ) : (
                  tags.map((t) => {
                    const isSelected = projectFormData.tags.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleToggleTag(t)}
                        className={`px-2.5 py-1 rounded-none text-[10px] font-mono transition-all border cursor-pointer uppercase ${
                          isSelected
                            ? "bg-foreground text-background border-foreground font-semibold"
                            : "bg-background text-foreground border-border-custom hover:border-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })
                )}
              </div>
              
              {/* Inline Tag Creator */}
              <div className="flex gap-2 items-center mt-2 max-w-md">
                <input
                  type="text"
                  placeholder="Tag baru tak ada di daftar? Tambah..."
                  value={inlineNewTag}
                  onChange={(e) => setInlineNewTag(e.target.value)}
                  className="bg-background border border-border-custom rounded-none px-3 py-1.5 text-[11px] focus:outline-none text-foreground flex-1 font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInlineTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddInlineTag}
                  className="px-3 py-1.5 bg-background hover:bg-foreground hover:text-background border border-border-custom text-[10px] font-mono uppercase font-bold transition-all text-foreground cursor-pointer"
                >
                  Tambah Tag
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                Link Live Demo
              </label>
              <input
                type="text"
                value={projectFormData.demoUrl}
                onChange={(e) =>
                  setProjectFormData({ ...projectFormData, demoUrl: e.target.value })
                }
                placeholder="https://example.com"
                className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                Link GitHub Repository
              </label>
              <input
                type="text"
                value={projectFormData.githubUrl}
                onChange={(e) =>
                  setProjectFormData({ ...projectFormData, githubUrl: e.target.value })
                }
                placeholder="https://github.com/..."
                className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
              />
            </div>

            <div className="flex items-center gap-2 mt-2 md:col-span-2">
              <input
                type="checkbox"
                id="featured"
                checked={projectFormData.featured}
                onChange={(e) =>
                  setProjectFormData({ ...projectFormData, featured: e.target.checked })
                }
                className="h-4 w-4 rounded-none bg-background border-border-custom accent-foreground"
              />
              <label htmlFor="featured" className="text-xs font-mono font-bold text-foreground cursor-pointer uppercase select-none">
                Tandai Proyek Unggulan (Tampil di grid utama)
              </label>
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                Deskripsi Singkat (Tampil di kartu) *
              </label>
              <input
                type="text"
                required
                value={projectFormData.description}
                onChange={(e) =>
                  setProjectFormData({ ...projectFormData, description: e.target.value })
                }
                placeholder="Ringkasan pendek proyek..."
                className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                Detail Proyek (Rich details / deskripsi panjang) *
              </label>
              <textarea
                required
                rows={3}
                value={projectFormData.details}
                onChange={(e) =>
                  setProjectFormData({ ...projectFormData, details: e.target.value })
                }
                placeholder="Uraikan detail fitur proyek..."
                className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground resize-none"
              />
            </div>

            {/* Screenshots Manager (Up to 10) */}
            <div className="flex flex-col gap-2 md:col-span-2 border-t border-border-custom pt-4 mt-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                  Screenshot Proyek ({projectFormData.screenshots.length} dari 10)
                </label>
                {projectFormData.screenshots.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddScreenshotSlot}
                    className="text-[10px] font-mono font-bold text-foreground hover:underline flex items-center gap-1 cursor-pointer uppercase"
                  >
                    <Plus className="h-3 w-3" /> Tambah Screenshot
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                {projectFormData.screenshots.map((shot, idx) => (
                  <div key={idx} className="border border-border-custom p-3 rounded-none bg-background flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold font-mono text-accent-custom uppercase">Screenshot #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshotSlot(idx)}
                        className="text-accent-custom hover:text-red-500 transition-colors cursor-pointer text-[10px] font-mono uppercase"
                      >
                        Hapus
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shot}
                        onChange={(e) => handleScreenshotChange(idx, e.target.value)}
                        placeholder="https://unsplash.com/... atau Base64"
                        className="flex-1 bg-background border border-border-custom rounded-none px-2.5 py-1.5 text-[11px] focus:outline-none text-foreground font-mono"
                      />
                      <label className="border border-border-custom hover:border-foreground bg-background hover:bg-foreground hover:text-background text-foreground text-[10px] font-mono font-bold rounded-none px-2 py-1 cursor-pointer flex items-center justify-center shrink-0 transition-colors uppercase">
                        <span>Pilih</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, (b64) => handleScreenshotChange(idx, b64))}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {shot && (
                      <div className="h-20 w-32 overflow-hidden rounded-none border border-border-custom bg-accent-light mt-1 self-start">
                        <img src={shot} alt={`screenshot ${idx + 1}`} className="object-cover w-full h-full filter grayscale hover:grayscale-0 transition-all" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-4 border-t border-border-custom pt-4">
              <button
                type="button"
                onClick={onClose}
                className="border border-border-custom px-4 py-2 rounded-none text-xs font-mono uppercase font-bold hover:bg-accent-light cursor-pointer text-foreground"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-foreground text-background border border-foreground hover:bg-background hover:text-foreground px-5 py-2 rounded-none text-xs font-mono uppercase font-bold transition-all cursor-pointer"
              >
                Simpan Proyek
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
