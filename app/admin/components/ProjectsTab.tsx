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
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">KELOLA PROYEK</h2>
          <p className="text-xs text-accent-custom font-mono uppercase mt-1">
            Atur Galeri Portofolio Anda
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTagsManager(!showTagsManager)}
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-full px-4 py-2 border transition-all cursor-pointer ${
              showTagsManager 
                ? "bg-accent-light text-foreground border-foreground" 
                : "border-border-custom hover:border-foreground text-foreground"
            }`}
          >
            {showTagsManager ? "Tutup Tag Manager" : "Kelola Tag Global"}
          </button>
          <button
            onClick={handleOpenProjectAdd}
            className="flex items-center gap-1.5 text-xs font-semibold bg-foreground text-background rounded-full px-4 py-2 hover:bg-accent-hover transition-all cursor-pointer"
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
                    src={project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800"}
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
                  className="h-8 w-8 rounded-full border border-border-custom flex items-center justify-center hover:bg-accent-light text-foreground cursor-pointer"
                  title="Edit Proyek"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus proyek "${project.title}"?`)) {
                      deleteProject(project.id);
                    }
                  }}
                  className="h-8 w-8 rounded-full border border-border-custom flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 cursor-pointer"
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
