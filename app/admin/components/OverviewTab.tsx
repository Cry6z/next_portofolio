"use client";

import React from "react";
import Link from "next/link";
import { Home as HomeIcon, RefreshCw } from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import { supabase } from "@/lib/supabaseClient";

interface OverviewTabProps {
  setActiveTab: (tab: "messages") => void;
  handleResetData: () => void;
  unreadCount: number;
}

export default function OverviewTab({
  setActiveTab,
  handleResetData,
  unreadCount,
}: OverviewTabProps) {
  const { profile, projects, skills, experiences, messages, migrateLocalData } = useCMS();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground font-mono">RINGKASAN</h2>
          <p className="text-xs text-accent-custom font-mono uppercase mt-1">
            Statistik Konten Portofolio Anda
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-mono uppercase border border-border-custom hover:border-foreground rounded-none px-3.5 py-1.5 bg-card-custom transition-all duration-200"
        >
          <HomeIcon className="h-3.5 w-3.5" />
          Lihat Situs
        </Link>
      </div>

      {/* Dashboard Cards Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-border-custom bg-card-custom p-4 rounded-none transition-all duration-200 flex flex-col gap-1.5 relative overflow-hidden group">
          <span className="text-[9px] font-mono text-accent-custom tracking-widest uppercase block">
            TOTAL PROYEK
          </span>
          <span className="text-3xl font-black text-foreground tracking-tight font-mono">{projects.length}</span>
        </div>

        <div className="border border-border-custom bg-card-custom p-4 rounded-none transition-all duration-200 flex flex-col gap-1.5 relative overflow-hidden group">
          <span className="text-[9px] font-mono text-accent-custom tracking-widest uppercase block">
            TOTAL KEAHLIAN
          </span>
          <span className="text-3xl font-black text-foreground tracking-tight font-mono">{skills.length}</span>
        </div>

        <div className="border border-border-custom bg-card-custom p-4 rounded-none transition-all duration-200 flex flex-col gap-1.5 relative overflow-hidden group">
          <span className="text-[9px] font-mono text-accent-custom tracking-widest uppercase block">
            GARIS WAKTU KARIR
          </span>
          <span className="text-3xl font-black text-foreground tracking-tight font-mono">{experiences.length}</span>
        </div>

        <div className="border border-border-custom bg-card-custom p-4 rounded-none transition-all duration-200 flex flex-col gap-1.5 relative overflow-hidden group">
          <span className="text-[9px] font-mono text-accent-custom tracking-widest uppercase block">
            PESAN MASUK
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground tracking-tight font-mono">{messages.length}</span>
            {unreadCount > 0 && (
              <span className="text-[9px] font-bold font-mono text-red-500">
                ({unreadCount} baru)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Profile Bio Glance Card */}
        <div className="border border-border-custom bg-card-custom p-4 rounded-none flex flex-col gap-4 transition-all duration-300 relative overflow-hidden group">
          <h3 className="text-sm font-black border-b border-border-custom/50 pb-2 font-mono tracking-tight text-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-foreground" />
            SEKILAS PROFIL
          </h3>
          <div className="flex flex-col gap-4 text-xs mt-1">
            <div>
              <span className="text-[9px] font-mono text-accent-custom uppercase block tracking-wider">Nama Lengkap</span>
              <span className="font-bold text-foreground text-sm font-mono mt-0.5 block">{profile.name}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-accent-custom uppercase block tracking-wider">Peran & Spesialisasi</span>
              <span className="font-bold text-foreground text-sm mt-0.5 block">{profile.title}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-accent-custom uppercase block tracking-wider">Deskripsi Bio</span>
              <p className="text-xs text-accent-custom leading-relaxed mt-1.5 font-sans bg-background/50 border border-border-custom/40 p-3 rounded-none line-clamp-4">{profile.bio}</p>
            </div>
          </div>
        </div>

        {/* Inbox Preview Card */}
        <div className="border border-border-custom bg-card-custom p-4 rounded-none flex flex-col gap-4 transition-all duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-center border-b border-border-custom/50 pb-2">
            <h3 className="text-sm font-black font-mono tracking-tight text-foreground flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-foreground" />
              PESAN TERBARU
            </h3>
            <button
              onClick={() => setActiveTab("messages")}
              className="text-[9px] font-mono font-bold text-foreground hover:underline tracking-wider uppercase border border-border-custom/80 px-2 py-0.5 rounded-none bg-background cursor-pointer"
            >
              Buka Inbox
            </button>
          </div>
          
          <div className="flex flex-col gap-3 mt-1">
            {messages.length === 0 ? (
              <p className="text-xs text-accent-custom text-center py-8 bg-background/40 border border-dashed border-border-custom/50 rounded-none font-mono">
                Tidak ada pesan masuk.
              </p>
            ) : (
              messages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setActiveTab("messages")}
                  className={`p-3 rounded-none border text-xs flex flex-col gap-2 transition-all duration-300 cursor-pointer ${
                    msg.read
                      ? "bg-background/40 border-border-custom/40 opacity-70 hover:opacity-100 hover:border-border-custom"
                      : "bg-background border-foreground/30 font-semibold"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground font-mono">{msg.name}</span>
                    <span className="text-[8px] font-mono text-accent-custom bg-foreground/5 px-2 py-0.5 rounded-none">{msg.date}</span>
                  </div>
                  <p className="text-accent-custom line-clamp-1 font-sans mt-0.5">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System & Database Status Card */}
        <div className="border border-border-custom bg-card-custom p-4 rounded-none flex flex-col gap-4 transition-all duration-300 relative overflow-hidden group">
          <h3 className="text-sm font-black font-mono tracking-tight text-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-foreground" />
            STATUS DATABASE
          </h3>
          <div className="flex flex-col gap-4 text-xs mt-1">
            <div>
              <span className="text-[9px] font-mono text-accent-custom uppercase block tracking-wider font-bold">Status Integrasi</span>
              <span className={`font-mono text-[9px] mt-1.5 px-2 py-1 border inline-flex items-center gap-1.5 rounded-none ${
                supabase ? "bg-foreground text-background border-foreground" : "bg-card-custom border-border-custom text-accent-custom"
              }`}>
                {supabase ? "SUPABASE CLOUD (AKTIF)" : "LOCAL STORAGE MODE"}
              </span>
            </div>
            
            {/* Tombol Migrasi Darurat */}
            {supabase && (
              <div className="bg-foreground/5 border border-border-custom p-3 rounded-none -mt-1">
                <span className="text-[9px] font-mono text-foreground uppercase block tracking-wider mb-1 font-bold">Penyelamatan Data Lokal</span>
                <p className="text-[9px] text-accent-custom mb-2 font-mono">Jika data Anda hilang setelah terhubung ke Supabase, klik tombol ini untuk memindahkan data.</p>
                <button
                  onClick={async (e) => {
                    const btn = e.currentTarget;
                    btn.disabled = true;
                    btn.innerHTML = "Memigrasikan...";
                    await migrateLocalData();
                    btn.innerHTML = "Selesai!";
                    setTimeout(() => window.location.reload(), 1500);
                  }}
                  className="mt-1 flex items-center gap-2 border border-border-custom bg-background hover:bg-foreground hover:text-background text-foreground px-3 py-1.5 rounded-none text-[9px] font-mono uppercase font-bold transition-all duration-200 w-full justify-center cursor-pointer"
                >
                  Migrasikan Data Lama ke Cloud
                </button>
              </div>
            )}

            <div>
              <span className="text-[9px] font-mono text-accent-custom uppercase block tracking-wider">Host Database</span>
              <span className="font-bold text-foreground text-xs font-mono mt-0.5 block truncate max-w-full">
                {supabase ? "dkcgyorferwktamwnywl.supabase.co" : "Persistensi Klien Lokal"}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-accent-custom uppercase block tracking-wider">Pembersihan Sistem</span>
              <button
                onClick={handleResetData}
                className="mt-1 flex items-center gap-2 border border-red-500/30 bg-red-500/5 hover:bg-red-500 hover:text-white hover:border-red-500 text-red-500 px-3.5 py-2 rounded-none text-xs font-bold transition-all duration-300 w-full justify-center cursor-pointer font-mono uppercase"
              >
                <RefreshCw className="h-3 w-3" />
                Setel Ulang Data Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
