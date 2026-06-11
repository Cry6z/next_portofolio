"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import { useCMS, TerminalCommand } from "@/context/CMSContext";

export default function TerminalTab() {
  const {
    terminalCommands,
    addTerminalCommand,
    updateTerminalCommand,
    deleteTerminalCommand,
    terminalConfig,
    updateTerminalConfig,
  } = useCMS();

  const [terminalFormOpen, setTerminalFormOpen] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState<TerminalCommand | null>(null);
  const [terminalFormData, setTerminalFormData] = useState({
    command: "",
    description: "",
    output: "",
  });

  const [terminalConfigData, setTerminalConfigData] = useState({
    welcomeMessage: "",
    promptUser: "",
    promptHost: "",
  });

  // Sync terminal config
  useEffect(() => {
    if (terminalConfig) {
      setTimeout(() => {
        setTerminalConfigData({
          welcomeMessage: terminalConfig.welcomeMessage || "",
          promptUser: terminalConfig.promptUser || "",
          promptHost: terminalConfig.promptHost || "",
        });
      }, 0);
    }
  }, [terminalConfig]);

  const handleOpenTerminalAdd = () => {
    setEditingTerminal(null);
    setTerminalFormData({ command: "", description: "", output: "" });
    setTerminalFormOpen(true);
  };

  const handleOpenTerminalEdit = (c: TerminalCommand) => {
    setEditingTerminal(c);
    setTerminalFormData({
      command: c.command,
      description: c.description,
      output: c.output,
    });
    setTerminalFormOpen(true);
  };

  const handleSaveTerminal = (e: React.FormEvent) => {
    e.preventDefault();
    const cmdData = {
      command: terminalFormData.command.toLowerCase().trim().replace(/\s+/g, ""),
      description: terminalFormData.description,
      output: terminalFormData.output,
    };

    if (editingTerminal) {
      updateTerminalCommand(editingTerminal.id, cmdData);
    } else {
      addTerminalCommand(cmdData);
    }
    setTerminalFormOpen(false);
    setEditingTerminal(null);
  };

  const handleSaveTerminalConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateTerminalConfig(terminalConfigData);
    alert("Konfigurasi Terminal Shell berhasil diperbarui!");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-custom/50 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground font-mono">KELOLA TERMINAL SHELL</h2>
          <p className="text-xs text-accent-custom font-mono uppercase mt-1">
            Atur Konfigurasi & Perintah Shell Interaktif
          </p>
        </div>
        <button
          onClick={handleOpenTerminalAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-mono uppercase bg-foreground text-background rounded-none px-3.5 py-2 hover:bg-accent-hover hover:border-accent-hover transition-all cursor-pointer border border-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Perintah
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of Custom Terminal Commands */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="border border-border-custom bg-card-custom p-4 md:p-6 rounded-none flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-tight border-b border-border-custom pb-2 font-mono text-foreground">
              Daftar Perintah Terminal
            </h3>
            
            {/* Inline Command Add/Edit Form */}
            <AnimatePresence>
              {terminalFormOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border border-border-custom bg-background p-4 rounded-none flex flex-col gap-3 shadow-sm mb-4"
                >
                  <div className="flex justify-between items-center border-b border-border-custom/50 pb-1.5">
                    <span className="text-xs font-bold font-mono text-foreground uppercase">
                      {editingTerminal ? "Edit Perintah" : "Tambah Perintah Baru"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTerminalFormOpen(false)}
                      className="text-accent-custom hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveTerminal} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                        Nama Perintah * (Hanya huruf kecil/angka, tanpa spasi)
                      </label>
                      <input
                        type="text"
                        required
                        value={terminalFormData.command}
                        onChange={(e) =>
                          setTerminalFormData({ ...terminalFormData, command: e.target.value })
                        }
                        placeholder="contoh: about, hobi, proyek"
                        className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                        Deskripsi Perintah * (Ditampilkan pada daftar bantuan 'help')
                      </label>
                      <input
                        type="text"
                        required
                        value={terminalFormData.description}
                        onChange={(e) =>
                          setTerminalFormData({ ...terminalFormData, description: e.target.value })
                        }
                        placeholder="contoh: Menampilkan hobi saya..."
                        className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                        Teks Output / Respons Perintah * (Mendukung baris baru \n)
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={terminalFormData.output}
                        onChange={(e) =>
                          setTerminalFormData({ ...terminalFormData, output: e.target.value })
                        }
                        placeholder="Masukkan teks jawaban yang akan muncul di layar shell..."
                        className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setTerminalFormOpen(false)}
                        className="border border-border-custom px-3 py-1.5 rounded-none text-[10px] font-mono font-bold uppercase hover:bg-accent-light"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-foreground text-background border border-foreground hover:bg-background hover:text-foreground px-4 py-1.5 rounded-none text-[10px] font-mono font-bold uppercase transition-all"
                      >
                        Simpan Perintah
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List of Custom Commands */}
            <div className="flex flex-col gap-3">
              {terminalCommands.length === 0 ? (
                <p className="text-xs text-accent-custom text-center py-6 font-mono uppercase">
                  Belum ada perintah kustom. Pemicu 'help', 'clear', dan 'theme' adalah bawaan.
                </p>
              ) : (
                terminalCommands.map((cmd) => (
                  <div
                    key={cmd.id}
                    className="border border-border-custom bg-background p-3.5 rounded-none flex items-center justify-between gap-4 hover:border-foreground/30 transition-all"
                  >
                    <div className="flex flex-col min-w-0 font-mono text-xs">
                      <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        <span className="text-accent-custom select-none">$</span>
                        {cmd.command}
                      </span>
                      <span className="text-[10px] text-accent-custom mt-1 leading-relaxed">
                        {cmd.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenTerminalEdit(cmd)}
                        className="h-7 px-2.5 rounded-none border border-border-custom flex items-center justify-center hover:bg-foreground hover:text-background text-foreground font-mono text-[10px] uppercase cursor-pointer"
                        title="Edit Perintah"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus perintah "${cmd.command}"?`)) {
                            deleteTerminalCommand(cmd.id);
                          }
                        }}
                        className="h-7 px-2.5 rounded-none border border-border-custom flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 text-foreground font-mono text-[10px] uppercase cursor-pointer"
                        title="Hapus Perintah"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Terminal General Config */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="border border-border-custom bg-card-custom p-4 md:p-6 rounded-none flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-tight border-b border-border-custom pb-2 font-mono text-foreground">
              Pengaturan Shell
            </h3>

            <form onSubmit={handleSaveTerminalConfig} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                  Prompt Username
                </label>
                <input
                  type="text"
                  required
                  value={terminalConfigData.promptUser}
                  onChange={(e) =>
                    setTerminalConfigData({ ...terminalConfigData, promptUser: e.target.value })
                  }
                  className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                  Prompt Hostname
                </label>
                <input
                  type="text"
                  required
                  value={terminalConfigData.promptHost}
                  onChange={(e) =>
                    setTerminalConfigData({ ...terminalConfigData, promptHost: e.target.value })
                  }
                  className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                  Pesan Sambutan (Welcome Banner)
                </label>
                <textarea
                  required
                  rows={6}
                  value={terminalConfigData.welcomeMessage}
                  onChange={(e) =>
                    setTerminalConfigData({ ...terminalConfigData, welcomeMessage: e.target.value })
                  }
                  className="bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="bg-foreground text-background border border-foreground hover:bg-background hover:text-foreground font-bold px-4 py-2.5 rounded-none text-xs font-mono uppercase transition-all w-full mt-2 cursor-pointer"
              >
                Perbarui Konfigurasi Terminal
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
