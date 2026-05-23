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
          className="flex items-center gap-1.5 text-xs font-bold border border-border-custom hover:border-foreground rounded-full px-4 py-2 bg-card-custom hover:shadow-md transition-all duration-300"
        >
          <HomeIcon className="h-3.5 w-3.5" />
          Lihat Situs
        </Link>
      </div>

      {/* Dashboard Cards Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-border-custom bg-card-custom hover:border-foreground/30 hover:-translate-y-1 p-6 rounded-2xl transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group shadow-sm hover:shadow-md">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <span className="text-[9px] font-mono text-accent-custom tracking-widest uppercase block">
            TOTAL PROYEK
          </span>
          <span className="text-4xl font-black text-foreground tracking-tight">{projects.length}</span>
        </div>

        <div className="border border-border-custom bg-card-custom hover:border-foreground/30 hover:-translate-y-1 p-6 rounded-2xl transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group shadow-sm hover:shadow-md">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <span className="text-[9px] font-mono text-accent-custom tracking-widest uppercase block">
            TOTAL KEAHLIAN
          </span>
          <span className="text-4xl font-black text-foreground tracking-tight">{skills.length}</span>
        </div>

        <div className="border border-border-custom bg-card-custom hover:border-foreground/30 hover:-translate-y-1 p-6 rounded-2xl transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group shadow-sm hover:shadow-md">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <span className="text-[9px] font-mono text-accent-custom tracking-widest uppercase block">
            GARIS WAKTU KARIR
          </span>
          <span className="text-4xl font-black text-foreground tracking-tight">{experiences.length}</span>
        </div>

        <div className="border border-border-custom bg-card-custom hover:border-foreground/30 hover:-translate-y-1 p-6 rounded-2xl transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group shadow-sm hover:shadow-md">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <span className="text-[9px] font-mono text-accent-custom tracking-widest uppercase block">
            PESAN MASUK
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground tracking-tight">{messages.length}</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold font-mono text-red-500 animate-pulse">
                ({unreadCount} baru)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Profile Bio Glance Card */}
        <div className="border border-border-custom bg-card-custom hover:border-foreground/20 p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <h3 className="text-base font-black border-b border-border-custom/50 pb-2 font-mono tracking-tight text-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            SEKILAS PROFIL
          </h3>
          <div className="flex flex-col gap-4 text-sm mt-1">
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
              <p className="text-xs text-accent-custom leading-relaxed mt-1.5 font-sans bg-background/50 border border-border-custom/40 p-3 rounded-xl line-clamp-4">{profile.bio}</p>
            </div>
          </div>
        </div>

        {/* Inbox Preview Card */}
        <div className="border border-border-custom bg-card-custom hover:border-foreground/20 p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <div className="flex justify-between items-center border-b border-border-custom/50 pb-2">
            <h3 className="text-base font-black font-mono tracking-tight text-foreground flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              PESAN TERBARU
            </h3>
            <button
              onClick={() => setActiveTab("messages")}
              className="text-[9px] font-mono font-bold text-foreground hover:underline tracking-wider uppercase border border-border-custom/80 px-2 py-0.5 rounded bg-background animate-fade-in"
            >
              Buka Inbox
            </button>
          </div>
          
          <div className="flex flex-col gap-3 mt-1">
            {messages.length === 0 ? (
              <p className="text-xs text-accent-custom text-center py-8 bg-background/40 border border-dashed border-border-custom/50 rounded-xl font-mono">
                Tidak ada pesan masuk.
              </p>
            ) : (
              messages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setActiveTab("messages")}
                  className={`p-3 rounded-xl border text-xs flex flex-col gap-2 transition-all duration-300 cursor-pointer ${
                    msg.read
                      ? "bg-background/40 border-border-custom/40 opacity-70 hover:opacity-100 hover:border-border-custom"
                      : "bg-background border-foreground/15 font-semibold shadow-sm hover:shadow-md hover:border-foreground/30"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground font-mono">{msg.name}</span>
                    <span className="text-[8px] font-mono text-accent-custom bg-foreground/5 px-2 py-0.5 rounded">{msg.date}</span>
                  </div>
                  <p className="text-accent-custom line-clamp-1 font-sans mt-0.5">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System & Database Status Card */}
        <div className="border border-border-custom bg-card-custom hover:border-foreground/20 p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          <h3 className="text-base font-black font-mono tracking-tight text-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            STATUS DATABASE
          </h3>
          <div className="flex flex-col gap-4 text-sm mt-1">
            <div>
              <span className="text-[9px] font-mono text-accent-custom uppercase block tracking-wider">Status Integrasi</span>
              <span className={`font-bold text-xs font-mono mt-1 px-2.5 py-1 rounded border inline-flex items-center gap-1.5 ${
                supabase ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full animate-ping ${supabase ? "bg-green-500" : "bg-yellow-500"}`} />
                {supabase ? "SUPABASE CLOUD (AKTIF)" : "LOCAL STORAGE MODE"}
              </span>
            </div>
            
            {/* Tombol Migrasi Darurat */}
            {supabase && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 p-3 rounded-xl mt-[-4px]">
                <span className="text-[9px] font-mono text-yellow-500/80 uppercase block tracking-wider mb-1">Penyelamatan Data Lokal</span>
                <p className="text-[9px] text-accent-custom mb-2">Jika data Anda hilang setelah terhubung ke Supabase, klik tombol ini untuk memindahkan data dari memori browser lama Anda ke Cloud.</p>
                <button
                  onClick={async (e) => {
                    const btn = e.currentTarget;
                    btn.disabled = true;
                    btn.innerHTML = "Memigrasikan...";
                    await migrateLocalData();
                    btn.innerHTML = "Selesai!";
                    setTimeout(() => window.location.reload(), 1500);
                  }}
                  className="mt-1 flex items-center gap-2 border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500 hover:text-black text-yellow-500 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 w-full justify-center"
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
                className="mt-1 flex items-center gap-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500 hover:text-white hover:border-red-500 text-red-500 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 w-full justify-center"
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
