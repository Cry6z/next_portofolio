"use client";

import React, { useState } from "react";
import { Check, Trash2, Reply, Send, Loader2 } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

const replyTemplates = [
  {
    name: "Pilih Template Balasan...",
    text: () => "",
  },
  {
    name: "Terima Kasih / Umum",
    text: (visitorName: string, adminName: string) => 
      `Halo ${visitorName},\n\nTerima kasih telah menghubungi saya melalui portofolio. Saya telah membaca pesan Anda.\n\nSaya akan meninjau detailnya dan memberikan tanggapan lebih lanjut sesegera mungkin.\n\nSalam hangat,\n${adminName}`,
  },
  {
    name: "Tawaran Kolaborasi Proyek",
    text: (visitorName: string, adminName: string) => 
      `Halo ${visitorName},\n\nTerima kasih atas tawaran kolaborasinya! Pesan Anda sangat menarik perhatian saya.\n\nSaya sangat senang untuk berdiskusi lebih lanjut mengenai detail dan kebutuhan proyek ini. Apakah Anda memiliki waktu senggang untuk online meeting singkat minggu ini?\n\nSalam hangat,\n${adminName}`,
  },
  {
    name: "Peluang Karir / Rekrutmen",
    text: (visitorName: string, adminName: string) => 
      `Halo ${visitorName},\n\nTerima kasih atas peluang karir dan ketertarikan Anda terhadap profil saya.\n\nSaya sangat tertarik untuk mendengar lebih banyak mengenai posisi ini. Silakan beri tahu saya waktu yang tepat untuk kita berdiskusi lebih lanjut.\n\nSalam hangat,\n${adminName}`,
  }
];

export default function MessagesTab() {
  const { messages, markMessageRead, deleteMessage, profile } = useCMS();
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendReply = async (msg: any) => {
    if (!replyText.trim()) return;
    setIsSending(true);
    
    try {
      const response = await fetch('/api/send-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: msg.email,
          subject: `Balasan: Pesan Anda di Portofolio`,
          text: replyText,
        }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal mengirim email');
      
      alert('Email balasan berhasil dikirim!');
      setReplyingTo(null);
      setReplyText('');
      if (!msg.read) markMessageRead(msg.id);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border-custom/50 pb-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground font-mono">KOTAK MASUK</h2>
        <p className="text-xs text-accent-custom font-mono uppercase mt-1">
          Pesan Masuk Pengunjung Situs
        </p>
      </div>

      {/* Messages Listing */}
      <div className="flex flex-col gap-4">
        {messages.length === 0 ? (
          <p className="text-xs text-accent-custom py-12 text-center border border-border-custom rounded-none bg-card-custom font-mono uppercase">
            Kotak masuk kosong. Belum ada pesan dari kontak.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`border rounded-none p-4 bg-card-custom flex flex-col gap-3 transition-all relative overflow-hidden ${
                msg.read
                  ? "border-border-custom opacity-85"
                  : "border-foreground/30 font-semibold"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border-custom/50 pb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground flex items-center gap-2 font-mono">
                    {msg.name}
                    {!msg.read && (
                      <span className="text-[9px] font-bold font-mono bg-foreground text-background px-1.5 py-0.5 rounded-none">
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

              <p className="text-xs text-accent-custom leading-relaxed font-sans mt-1 bg-background p-3 rounded-none border border-border-custom/30 whitespace-pre-line">
                {msg.message}
              </p>

              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    setReplyingTo(replyingTo === msg.id ? null : msg.id);
                    setReplyText('');
                  }}
                  className={`flex items-center gap-1.5 border hover:border-foreground rounded-none px-3 py-1.5 text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                    replyingTo === msg.id ? "bg-foreground text-background border-foreground" : "border-border-custom bg-background"
                  }`}
                >
                  <Reply className="h-3 w-3" />
                  {replyingTo === msg.id ? "Batal Balas" : "Balas Pesan"}
                </button>
                
                {!msg.read && (
                  <button
                    onClick={() => markMessageRead(msg.id)}
                    className="flex items-center gap-1.5 border border-border-custom hover:border-foreground bg-background rounded-none px-3 py-1.5 text-[10px] font-mono uppercase font-bold transition-all cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                    Tandai Dibaca
                  </button>
                )}
                
                <button
                  onClick={() => {
                    if (confirm(`Hapus pesan dari "${msg.name}"?`)) {
                      deleteMessage(msg.id);
                    }
                  }}
                  className="flex items-center gap-1.5 border border-border-custom hover:border-red-500 hover:text-white bg-background rounded-none px-3 py-1.5 text-[10px] font-mono uppercase font-bold transition-all cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  Hapus
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === msg.id && (
                <div className="mt-2 pt-4 border-t border-border-custom/50 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-[9px] font-mono font-bold tracking-widest text-accent-custom uppercase">
                      Tulis Balasan ke {msg.email}
                    </label>
                    <div className="flex items-center gap-1.5 font-mono text-[9px]">
                      <span className="text-accent-custom uppercase font-semibold">Gunakan Template:</span>
                      <select
                        onChange={(e) => {
                          const idx = Number(e.target.value);
                          if (idx > 0) {
                            const selected = replyTemplates[idx];
                            setReplyText(selected.text(msg.name, profile?.name || "Gibran"));
                          }
                        }}
                        className="bg-background border border-border-custom text-foreground px-2 py-0.5 text-[9px] focus:outline-none cursor-pointer rounded-none"
                      >
                        {replyTemplates.map((t, idx) => (
                          <option key={idx} value={idx}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Ketik pesan balasan Anda di sini..."
                    className="w-full bg-background border border-border-custom rounded-none p-3 text-xs focus:outline-none focus:border-foreground resize-y min-h-30 text-foreground font-mono"
                  />
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => handleSendReply(msg)}
                      disabled={isSending || !replyText.trim()}
                      className="flex items-center gap-2 bg-foreground text-background border border-foreground hover:bg-background hover:text-foreground font-semibold rounded-none px-4 py-2 text-[10px] font-mono uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      {isSending ? "Mengirim..." : "Kirim Email"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
