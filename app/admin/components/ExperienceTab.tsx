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
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">GARIS WAKTU KARIR</h2>
          <p className="text-xs text-accent-custom font-mono uppercase mt-1">
            Kelola Pengalaman Karir
          </p>
        </div>
        <button
          onClick={handleOpenExpAdd}
          className="flex items-center gap-1.5 text-xs font-semibold bg-foreground text-background rounded-full px-4 py-2 hover:bg-accent-hover transition-all"
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
            className="border border-foreground/15 bg-card-custom p-6 rounded-2xl flex flex-col gap-4 shadow-sm"
          >
            <div className="flex justify-between items-center border-b border-border-custom pb-2">
              <h3 className="text-md font-bold uppercase tracking-tight">
                {editingExp ? "Edit Pengalaman" : "Tambah Pengalaman Baru"}
              </h3>
              <button
                onClick={() => setExpFormOpen(false)}
                className="text-accent-custom hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
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
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                  Posisi / Peran *
                </label>
                <input
                  type="text"
                  required
                  value={expFormData.role}
                  onChange={(e) => setExpFormData({ ...expFormData, role: e.target.value })}
                  placeholder="Contoh: Lead Developer..."
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                  Durasi / Periode *
                </label>
                <input
                  type="text"
                  required
                  value={expFormData.period}
                  onChange={(e) => setExpFormData({ ...expFormData, period: e.target.value })}
                  placeholder="Contoh: 2024 - Sekarang"
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-3">
                <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
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
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground resize-none"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setExpFormOpen(false)}
                  className="border border-border-custom px-4 py-2 rounded-lg text-xs font-semibold hover:bg-accent-light"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-foreground text-background px-5 py-2 rounded-lg text-xs font-semibold hover:bg-accent-hover"
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
          <p className="text-sm text-accent-custom py-10 text-center border border-border-custom rounded-xl bg-card-custom">
            Belum ada riwayat karir.
          </p>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="border border-border-custom bg-card-custom p-4 rounded-xl flex justify-between items-center gap-4 hover:border-foreground/20 transition-all"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-mono font-bold text-accent-custom uppercase">
                  {exp.company}
                </span>
                <span className="font-bold text-sm text-foreground truncate mt-0.5">
                  {exp.role}
                </span>
                <span className="text-[10px] font-mono text-accent-custom mt-1">
                  Periode: {exp.period}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenExpEdit(exp)}
                  className="h-8 w-8 rounded-full border border-border-custom flex items-center justify-center hover:bg-accent-light text-foreground"
                  title="Edit"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteExperience(exp.id)}
                  className="h-8 w-8 rounded-full border border-border-custom flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500"
                  title="Hapus"
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
