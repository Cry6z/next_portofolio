"use client";

import React from "react";
import { Check, Trash2 } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function MessagesTab() {
  const { messages, markMessageRead, deleteMessage } = useCMS();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">KOTAK MASUK</h2>
        <p className="text-xs text-accent-custom font-mono uppercase mt-1">
          Pesan Masuk Pengunjung Situs
        </p>
      </div>

      {/* Messages Listing */}
      <div className="flex flex-col gap-4">
        {messages.length === 0 ? (
          <p className="text-sm text-accent-custom py-12 text-center border border-border-custom rounded-xl bg-card-custom">
            Kotak masuk kosong. Belum ada pesan dari formulir kontak.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`border rounded-xl p-5 bg-card-custom flex flex-col gap-3 transition-all relative overflow-hidden ${
                msg.read
                  ? "border-border-custom opacity-85"
                  : "border-foreground/15 font-semibold"
              }`}
            >
              {!msg.read && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 animate-ping" />
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border-custom/50 pb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground flex items-center gap-2">
                    {msg.name}
                    {!msg.read && (
                      <span className="text-[8px] font-bold font-mono bg-red-500 text-white px-1.5 py-0.5 rounded">
                        BARU
                      </span>
                    )}
                  </span>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-[10px] font-mono text-accent-custom hover:underline mt-0.5"
                  >
                    {msg.email}
                  </a>
                </div>
                <span className="text-[10px] font-mono text-accent-custom">{msg.date}</span>
              </div>

              <p className="text-xs text-accent-custom leading-relaxed font-sans mt-1 bg-background p-3 rounded-lg border border-border-custom/30 whitespace-pre-line">
                {msg.message}
              </p>

              <div className="flex justify-end gap-2 pt-1">
                {!msg.read && (
                  <button
                    onClick={() => markMessageRead(msg.id)}
                    className="flex items-center gap-1.5 border border-border-custom hover:border-foreground rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all"
                  >
                    <Check className="h-3 w-3" />
                    Tandai Dibaca
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="flex items-center gap-1.5 border border-border-custom hover:border-red-500/30 hover:text-red-500 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all"
                >
                  <Trash2 className="h-3 w-3" />
                  Hapus Pesan
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
