"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import { useCMS, Experience } from "@/context/CMSContext";

export default function ExperienceTab() {
  const { experiences, addExperience, updateExperience, deleteExperience } = useCMS();

  const [expFormOpen, setExpFormOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expFormData, setExpFormData] = useState({
    role: "",
    company: "",
    period: "",
    description: "",
  });

  const handleOpenExpAdd = () => {
    setEditingExp(null);
    setExpFormData({ role: "", company: "", period: "", description: "" });
    setExpFormOpen(true);
  };

  const handleOpenExpEdit = (exp: Experience) => {
    setEditingExp(exp);
    setExpFormData({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      description: exp.description,
    });
    setExpFormOpen(true);
  };

  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExp) {
      updateExperience(editingExp.id, expFormData);
    } else {
      addExperience(expFormData);
    }
    setExpFormOpen(false);
    setEditingExp(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-custom/50 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground font-mono">GARIS WAKTU KARIR</h2>
          <p className="text-xs text-accent-custom font-mono uppercase mt-1">
            Kelola Pengalaman Karir
          </p>
        </div>
        <button
          onClick={handleOpenExpAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-mono uppercase bg-foreground text-background rounded-none px-3.5 py-2 hover:bg-accent-hover hover:border-accent-hover transition-all cursor-pointer border border-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Pengalaman
        </button>
      </div>

      {/* Experience Edit Form */}
      <AnimatePresence>
        {expFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-border-custom bg-card-custom p-4 md:p-6 rounded-none flex flex-col gap-4 shadow-sm"
          >
            <div className="flex justify-between items-center border-b border-border-custom pb-2">
              <h3 className="text-sm font-black font-mono uppercase tracking-tight">
                {editingExp ? "Edit Pengalaman" : "Tambah Pengalaman Baru"}
              </h3>
              <button
                onClick={() => setExpFormOpen(false)}
                className="text-accent-custom hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                  Perusahaan / Institusi *
                </label>
                <input
                  type="text"
                  required
                  value={expFormData.company}
                  onChange={(e) =>
                    setExpFormData({ ...expFormData, company: e.target.value })
                  }
                  placeholder="Contoh: PT. Studio..."
                  className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                  Posisi / Peran *
                </label>
                <input
                  type="text"
                  required
                  value={expFormData.role}
                  onChange={(e) => setExpFormData({ ...expFormData, role: e.target.value })}
                  placeholder="Contoh: Lead Developer..."
                  className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                  Durasi / Periode *
                </label>
                <input
                  type="text"
                  required
                  value={expFormData.period}
                  onChange={(e) => setExpFormData({ ...expFormData, period: e.target.value })}
                  placeholder="Contoh: 2024 - Sekarang"
                  className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-3">
                <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                  Uraian Tugas / Kontribusi pekerjaan *
                </label>
                <textarea
                  required
                  rows={3}
                  value={expFormData.description}
                  onChange={(e) =>
                    setExpFormData({ ...expFormData, description: e.target.value })
                  }
                  placeholder="Uraikan detail pekerjaan Anda di posisi ini..."
                  className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground resize-none"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setExpFormOpen(false)}
                  className="border border-border-custom px-4 py-2 rounded-none text-xs font-mono font-bold uppercase hover:bg-accent-light text-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-foreground text-background border border-foreground hover:bg-background hover:text-foreground px-5 py-2 rounded-none text-xs font-mono font-bold uppercase transition-all"
                >
                  Simpan Pengalaman
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience Listing */}
      <div className="flex flex-col gap-3">
        {experiences.length === 0 ? (
          <p className="text-xs text-accent-custom py-10 text-center border border-border-custom rounded-none bg-card-custom font-mono uppercase">
            Belum ada riwayat karir.
          </p>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="border border-border-custom bg-card-custom p-4 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-foreground/30 transition-all duration-200"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono font-bold text-accent-custom uppercase">
                  {exp.company}
                </span>
                <span className="font-bold text-sm text-foreground truncate mt-0.5 font-mono">
                  {exp.role}
                </span>
                <span className="text-[10px] font-mono text-accent-custom mt-1">
                  Periode: {exp.period}
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => handleOpenExpEdit(exp)}
                  className="h-8 px-3 rounded-none border border-border-custom flex items-center justify-center hover:bg-foreground hover:text-background text-foreground font-mono text-xs uppercase cursor-pointer"
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus pengalaman "${exp.role} di ${exp.company}"?`)) {
                      deleteExperience(exp.id);
                    }
                  }}
                  className="h-8 px-3 rounded-none border border-border-custom flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 text-foreground font-mono text-xs uppercase cursor-pointer"
                  title="Hapus"
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
