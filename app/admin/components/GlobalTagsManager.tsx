"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface GlobalTagsManagerProps {
  tags: string[];
  isOpen: boolean;
  onAddTag: (name: string) => void;
  onDeleteTag: (name: string) => void;
}

export default function GlobalTagsManager({ tags, isOpen, onAddTag, onDeleteTag }: GlobalTagsManagerProps) {
  const [newGlobalTag, setNewGlobalTag] = useState("");

  const handleAdd = () => {
    const trimmed = newGlobalTag.trim();
    if (trimmed) {
      onAddTag(trimmed);
      setNewGlobalTag("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden border border-foreground/15 bg-card-custom p-6 rounded-2xl flex flex-col gap-4 shadow-sm"
        >
          <div className="flex justify-between items-center border-b border-border-custom pb-2">
            <h3 className="text-sm font-bold uppercase tracking-tight">Kelola Pool Tag Global</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 bg-background border border-border-custom text-foreground rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => {
                      if (confirm(`Hapus tag "${tag}" dari pool global?`)) {
                        onDeleteTag(tag);
                      }
                    }}
                    className="text-accent-custom hover:text-red-500 transition-colors ml-1 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2 max-w-sm mt-2">
              <input
                type="text"
                value={newGlobalTag}
                onChange={(e) => setNewGlobalTag(e.target.value)}
                placeholder="Nama tag baru (misal: Svelte)..."
                className="flex-1 bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
              />
              <button
                onClick={handleAdd}
                className="bg-foreground text-background text-xs font-semibold px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors cursor-pointer"
              >
                Tambah
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
