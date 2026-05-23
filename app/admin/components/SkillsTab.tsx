"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import { useCMS, Skill } from "@/context/CMSContext";

export default function SkillsTab() {
  const { skills, addSkill, updateSkill, deleteSkill } = useCMS();

  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillFormData, setSkillFormData] = useState({
    name: "",
    category: "Frontend",
    level: 80,
  });

  const handleOpenSkillAdd = () => {
    setEditingSkill(null);
    setSkillFormData({ name: "", category: "Frontend", level: 80 });
    setSkillFormOpen(true);
  };

  const handleOpenSkillEdit = (s: Skill) => {
    setEditingSkill(s);
    setSkillFormData({
      name: s.name,
      category: s.category,
      level: s.level,
    });
    setSkillFormOpen(true);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkill) {
      updateSkill(editingSkill.id, skillFormData);
    } else {
      addSkill(skillFormData);
    }
    setSkillFormOpen(false);
    setEditingSkill(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">KELOLA KEAHLIAN</h2>
          <p className="text-xs text-accent-custom font-mono uppercase mt-1">
            Atur Kompetensi & Progres Bar
          </p>
        </div>
        <button
          onClick={handleOpenSkillAdd}
          className="flex items-center gap-1.5 text-xs font-semibold bg-foreground text-background rounded-full px-4 py-2 hover:bg-accent-hover transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Keahlian
        </button>
      </div>

      {/* Skill Edit Form Panel */}
      <AnimatePresence>
        {skillFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-foreground/15 bg-card-custom p-6 rounded-2xl flex flex-col gap-4 shadow-sm"
          >
            <div className="flex justify-between items-center border-b border-border-custom pb-2">
              <h3 className="text-md font-bold uppercase tracking-tight">
                {editingSkill ? "Edit Keahlian" : "Tambah Keahlian Baru"}
              </h3>
              <button
                onClick={() => setSkillFormOpen(false)}
                className="text-accent-custom hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                  Nama Keahlian *
                </label>
                <input
                  type="text"
                  required
                  value={skillFormData.name}
                  onChange={(e) =>
                    setSkillFormData({ ...skillFormData, name: e.target.value })
                  }
                  placeholder="Contoh: Next.js..."
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                  Kategori *
                </label>
                <select
                  value={skillFormData.category}
                  onChange={(e) =>
                    setSkillFormData({ ...skillFormData, category: e.target.value })
                  }
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Design">Design</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                    Kemahiran (%)
                  </label>
                  <span className="text-xs font-bold">{skillFormData.level}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={skillFormData.level}
                  onChange={(e) =>
                    setSkillFormData({ ...skillFormData, level: parseInt(e.target.value) })
                  }
                  className="h-2 bg-border-custom rounded-lg appearance-none cursor-pointer accent-foreground mt-3"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setSkillFormOpen(false)}
                  className="border border-border-custom px-4 py-2 rounded-lg text-xs font-semibold hover:bg-accent-light"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-foreground text-background px-5 py-2 rounded-lg text-xs font-semibold hover:bg-accent-hover"
                >
                  Simpan Keahlian
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skill Listing grouped by category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["Frontend", "Backend", "Design", "Tools"].map((category) => {
          const categorySkills = skills.filter((s) => s.category === category);
          return (
            <div
              key={category}
              className="border border-border-custom bg-card-custom p-5 rounded-2xl flex flex-col gap-4"
            >
              <h3 className="text-sm font-mono font-bold border-b border-border-custom pb-2 uppercase tracking-widest text-foreground">
                {category}
              </h3>
              <div className="flex flex-col gap-3">
                {categorySkills.length === 0 ? (
                  <p className="text-xs text-accent-custom py-2">Belum ada data.</p>
                ) : (
                  categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between gap-3 text-xs bg-background p-2 rounded-lg border border-border-custom"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold">{skill.name}</span>
                        <span className="text-[10px] text-accent-custom font-mono">
                          Level: {skill.level}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenSkillEdit(skill)}
                          className="h-6 w-6 rounded-full border border-border-custom flex items-center justify-center hover:bg-accent-light text-foreground"
                        >
                          <Edit2 className="h-2.5 w-2.5" />
                        </button>
                        <button
                          onClick={() => deleteSkill(skill.id)}
                          className="h-6 w-6 rounded-full border border-border-custom flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
