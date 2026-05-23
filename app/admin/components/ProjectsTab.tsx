"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Star, Edit2, Trash2 } from "lucide-react";
import { useCMS, Project } from "@/context/CMSContext";

export default function ProjectsTab() {
  const { projects, addProject, updateProject, deleteProject } = useCMS();

  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: "",
    description: "",
    details: "",
    image: "",
    tags: "",
    demoUrl: "",
    githubUrl: "",
    featured: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2MB untuk optimasi penyimpanan browser.");
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

  const handleOpenProjectAdd = () => {
    setEditingProject(null);
    setProjectFormData({
      title: "",
      description: "",
      details: "",
      image: "",
      tags: "",
      demoUrl: "",
      githubUrl: "",
      featured: false,
    });
    setProjectFormOpen(true);
  };

  const handleOpenProjectEdit = (p: Project) => {
    setEditingProject(p);
    setProjectFormData({
      title: p.title,
      description: p.description,
      details: p.details || "",
      image: p.image,
      tags: p.tags.join(", "),
      demoUrl: p.demoUrl || "",
      githubUrl: p.githubUrl || "",
      featured: p.featured || false,
    });
    setProjectFormOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...projectFormData,
      tags: projectFormData.tags.split(",").map((t) => t.trim()).filter((t) => t),
    };

    if (editingProject) {
      updateProject(editingProject.id, formattedData);
    } else {
      addProject(formattedData);
    }
    setProjectFormOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">KELOLA PROYEK</h2>
          <p className="text-xs text-accent-custom font-mono uppercase mt-1">
            Atur Galeri Portofolio Anda
          </p>
        </div>
        <button
          onClick={handleOpenProjectAdd}
          className="flex items-center gap-1.5 text-xs font-semibold bg-foreground text-background rounded-full px-4 py-2 hover:bg-accent-hover transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Proyek
        </button>
      </div>

      {/* Inline Project Add/Edit Form */}
      <AnimatePresence>
        {projectFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-foreground/15 bg-card-custom p-6 rounded-2xl flex flex-col gap-4 shadow-sm"
          >
            <div className="flex justify-between items-center border-b border-border-custom pb-2">
              <h3 className="text-md font-bold uppercase tracking-tight">
                {editingProject ? "Edit Proyek" : "Tambah Proyek Baru"}
              </h3>
              <button
                onClick={() => setProjectFormOpen(false)}
                className="text-accent-custom hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
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
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
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
                    className="flex-1 bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                  />
                  <label className="border border-border-custom hover:border-foreground bg-background hover:bg-accent-light text-foreground text-xs font-bold rounded-lg px-3 py-1.5 cursor-pointer flex items-center justify-center shrink-0">
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
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                  Teknologi / Tags * (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  required
                  value={projectFormData.tags}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, tags: e.target.value })
                  }
                  placeholder="Next.js, Framer Motion, Tailwind"
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                  Link Live Demo
                </label>
                <input
                  type="text"
                  value={projectFormData.demoUrl}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, demoUrl: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                  Link GitHub Repository
                </label>
                <input
                  type="text"
                  value={projectFormData.githubUrl}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, githubUrl: e.target.value })
                  }
                  placeholder="https://github.com/..."
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="featured"
                  checked={projectFormData.featured}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded bg-background border-border-custom accent-foreground"
                />
                <label htmlFor="featured" className="text-xs font-semibold text-foreground">
                  Tandai Proyek Unggulan (Tampil di grid utama)
                </label>
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
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
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                  Detail Proyek (Rich details / deskripsi panjang) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={projectFormData.details}
                  onChange={(e) =>
                    setProjectFormData({ ...projectFormData, details: e.target.value })
                  }
                  placeholder="Uraikan detail fitur proyek, kontribusi Anda, dll..."
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground resize-none"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setProjectFormOpen(false)}
                  className="border border-border-custom px-4 py-2 rounded-lg text-xs font-semibold hover:bg-accent-light"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-foreground text-background px-5 py-2 rounded-lg text-xs font-semibold hover:bg-accent-hover"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Table/List */}
      <div className="flex flex-col gap-3">
        {projects.length === 0 ? (
          <p className="text-sm text-accent-custom py-10 text-center border border-border-custom rounded-xl bg-card-custom">
            Tidak ada proyek. Klik &quot;Tambah Proyek&quot; untuk membuat proyek baru.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="border border-border-custom bg-card-custom p-4 rounded-xl flex items-center justify-between gap-4 hover:border-foreground/20 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-12 w-20 overflow-hidden rounded bg-accent-light shrink-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full filter grayscale"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground truncate">
                      {project.title}
                    </span>
                    {project.featured && (
                      <span className="flex items-center gap-0.5 text-[8px] font-bold font-mono tracking-wider px-1.5 py-0.5 bg-foreground text-background rounded">
                        <Star className="h-2 w-2 fill-background stroke-none" />
                        UNGGULAN
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-accent-custom font-mono truncate mt-1">
                    {project.tags.join(" • ")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenProjectEdit(project)}
                  className="h-8 w-8 rounded-full border border-border-custom flex items-center justify-center hover:bg-accent-light text-foreground"
                  title="Edit Proyek"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="h-8 w-8 rounded-full border border-border-custom flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500"
                  title="Hapus Proyek"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
