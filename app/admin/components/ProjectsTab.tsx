"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import { useCMS, Project } from "@/context/CMSContext";
import GlobalTagsManager from "./GlobalTagsManager";
import ProjectForm from "./ProjectForm";

export default function ProjectsTab() {
  const { projects, addProject, updateProject, deleteProject, tags, addTag, deleteTag } = useCMS();

  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showTagsManager, setShowTagsManager] = useState(false);

  const handleOpenProjectAdd = () => {
    setEditingProject(null);
    setProjectFormOpen(true);
  };

  const handleOpenProjectEdit = (p: Project) => {
    setEditingProject(p);
    setProjectFormOpen(true);
  };

  const handleSaveProject = (formData: Omit<Project, "id"> | Partial<Project>) => {
    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      addProject(formData as Omit<Project, "id">);
    }
    setProjectFormOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-custom/50 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground font-mono">KELOLA PROYEK</h2>
          <p className="text-xs text-accent-custom font-mono uppercase mt-1">
            Atur Galeri Portofolio Anda
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowTagsManager(!showTagsManager)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs font-mono uppercase rounded-none px-3.5 py-2 border transition-all cursor-pointer ${
              showTagsManager 
                ? "bg-foreground text-background border-foreground" 
                : "border-border-custom hover:border-foreground text-foreground bg-card-custom"
            }`}
          >
            {showTagsManager ? "Tutup Tag" : "Tag Global"}
          </button>
          <button
            onClick={handleOpenProjectAdd}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs font-mono uppercase bg-foreground text-background rounded-none px-3.5 py-2 hover:bg-accent-hover hover:border-accent-hover transition-all cursor-pointer border border-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Proyek
          </button>
        </div>
      </div>

      {/* Global Tags Manager Panel */}
      <GlobalTagsManager
        tags={tags}
        isOpen={showTagsManager}
        onAddTag={addTag}
        onDeleteTag={deleteTag}
      />

      {/* Inline Project Add/Edit Form */}
      <ProjectForm
        isOpen={projectFormOpen}
        onClose={() => {
          setProjectFormOpen(false);
          setEditingProject(null);
        }}
        editingProject={editingProject}
        onSave={handleSaveProject}
        tags={tags}
        addTag={addTag}
      />

      {/* Projects Table/List */}
      <div className="flex flex-col gap-3">
        {projects.length === 0 ? (
          <p className="text-xs text-accent-custom py-10 text-center border border-border-custom rounded-none bg-card-custom font-mono">
            Tidak ada proyek. Klik "Tambah Proyek" untuk membuat proyek baru.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="border border-border-custom bg-card-custom p-3 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-foreground/30 transition-all duration-200"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-12 w-20 overflow-hidden rounded-none bg-accent-light shrink-0 border border-border-custom">
                  <img
                    src={project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800"}
                    alt={project.title}
                    className="object-cover w-full h-full filter grayscale"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground truncate font-mono">
                      {project.title}
                    </span>
                    {project.featured && (
                      <span className="flex items-center gap-0.5 text-[8px] font-bold font-mono tracking-wider px-1.5 py-0.5 bg-foreground text-background rounded-none">
                        <Star className="h-2 w-2 fill-background stroke-none" />
                        UNGGULAN
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-accent-custom font-mono truncate mt-1">
                    Kategori: <span className="font-bold text-foreground">{project.tags[0] || "-"}</span> • Tech: {project.tags.slice(1).join(", ") || "-"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => handleOpenProjectEdit(project)}
                  className="h-8 px-3 rounded-none border border-border-custom flex items-center justify-center hover:bg-foreground hover:text-background text-foreground cursor-pointer font-mono text-xs uppercase"
                  title="Edit Proyek"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus proyek "${project.title}"?`)) {
                      deleteProject(project.id);
                    }
                  }}
                  className="h-8 px-3 rounded-none border border-border-custom flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 text-foreground cursor-pointer font-mono text-xs uppercase"
                  title="Hapus Proyek"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
