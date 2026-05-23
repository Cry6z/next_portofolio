"use client";

import React, { useState } from "react";
import { Check, Trash2, Reply, Send, Loader2 } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function MessagesTab() {
  const { messages, markMessageRead, deleteMessage } = useCMS();
  
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
                  : "border-foreground/15 font-semibold shadow-sm"
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

              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    setReplyingTo(replyingTo === msg.id ? null : msg.id);
                    setReplyText('');
                  }}
                  className={`flex items-center gap-1.5 border hover:border-foreground rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all ${
                    replyingTo === msg.id ? "bg-foreground text-background border-foreground" : "border-border-custom"
                  }`}
                >
                  <Reply className="h-3 w-3" />
                  {replyingTo === msg.id ? "Batal Balas" : "Balas Pesan"}
                </button>
                
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
                  Hapus
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === msg.id && (
                <div className="mt-2 pt-4 border-t border-border-custom/50 flex flex-col gap-2">
                  <label className="text-[10px] font-mono font-bold tracking-widest text-accent-custom uppercase">
                    Tulis Balasan ke {msg.email}
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Ketik pesan balasan Anda di sini..."
                    className="w-full bg-background border border-border-custom rounded-lg p-3 text-xs focus:outline-none focus:border-foreground resize-y min-h-[100px] text-foreground"
                  />
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => handleSendReply(msg)}
                      disabled={isSending || !replyText.trim()}
                      className="flex items-center gap-2 bg-foreground text-background font-semibold rounded-lg px-4 py-2 text-[11px] hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      {isSending ? "Mengirim..." : "Kirim Email Sekarang"}
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
