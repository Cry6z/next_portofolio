"use client";

import React, { useState, useEffect } from "react";
import ProfileCard from "@/components/ProfileCard";
import { useCMS } from "@/context/CMSContext";

export default function PhotosTab() {
  const { profile, updateProfile } = useCMS();

  const [photoFormData, setPhotoFormData] = useState({
    avatarUrl: "",
    miniAvatarUrl: "",
  });

  useEffect(() => {
    if (profile) {
      setTimeout(() => {
        setPhotoFormData({
          avatarUrl: profile.avatarUrl || "",
          miniAvatarUrl: profile.miniAvatarUrl || "",
        });
      }, 0);
    }
  }, [profile]);

  const handleSavePhotos = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      avatarUrl: photoFormData.avatarUrl,
      miniAvatarUrl: photoFormData.miniAvatarUrl,
    });
    alert("Foto profil berhasil diperbarui!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2MB untuk optimasi penyimpanan browser.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">FOTO PROFIL</h2>
        <p className="text-xs text-accent-custom font-mono uppercase mt-1">
          Kelola Foto Utama dan Mini Avatar Kartu Profil
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Live Preview */}
        <div className="flex flex-col items-center justify-center w-full bg-card-custom/50 border border-border-custom rounded-2xl p-8 min-h-[400px]">
          <div className="relative group w-full max-w-[280px] sm:max-w-[340px] lg:w-full lg:max-w-[360px] aspect-[0.718] mx-auto">
            <ProfileCard
              name={profile?.name || "GIBRAN"}
              title={profile?.title || "Creative Developer"}
              handle={profile?.name?.toLowerCase().replace(/\s+/g, '') || "gibran"}
              status="Tersedia untuk proyek"
              contactText="Sapa Saya"
              avatarUrl={photoFormData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"}
              miniAvatarUrl={photoFormData.miniAvatarUrl || photoFormData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"}
              showUserInfo={true}
              enableTilt={false}
              enableMobileTilt={false}
              onContactClick={() => {}}
            />
          </div>
          <p className="text-[10px] text-accent-custom font-mono mt-8 text-center uppercase tracking-widest border border-border-custom px-4 py-2 rounded-full bg-background/50">
            Pratinjau Langsung (Live Preview)
          </p>
        </div>

        {/* Right Column: Form */}
        <div className="border border-border-custom bg-card-custom p-6 rounded-2xl flex flex-col gap-6">
          <h3 className="text-md font-bold uppercase tracking-tight border-b border-border-custom pb-2">
            Pilih File Foto
          </h3>
          
          <form onSubmit={handleSavePhotos} className="flex flex-col gap-6">
            
            {/* Main Avatar */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Foto Utama (Hero Section)
              </label>
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-2xl border border-border-custom bg-background flex items-center justify-center overflow-hidden shrink-0">
                  {photoFormData.avatarUrl ? (
                    <img src={photoFormData.avatarUrl} alt="Preview Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-accent-custom font-mono">Kosong</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <input
                    type="text"
                    value={photoFormData.avatarUrl}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, avatarUrl: e.target.value })}
                    placeholder="URL / Base64 Foto Utama..."
                    className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                  />
                  <label className="border border-border-custom hover:border-foreground bg-background hover:bg-accent-light text-foreground text-xs font-bold rounded-lg px-3 py-2 cursor-pointer text-center transition-all">
                    Pilih File Foto Utama
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, (b64) => setPhotoFormData({ ...photoFormData, avatarUrl: b64 }))}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Mini Avatar */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Mini Avatar (Sudut Kartu)
              </label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full border border-border-custom bg-background flex items-center justify-center overflow-hidden shrink-0">
                  {photoFormData.miniAvatarUrl ? (
                    <img src={photoFormData.miniAvatarUrl} alt="Preview Mini Avatar" className="w-full h-full object-cover grayscale" />
                  ) : (
                    <span className="text-[9px] text-accent-custom font-mono text-center leading-none">Kosong</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <input
                    type="text"
                    value={photoFormData.miniAvatarUrl}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, miniAvatarUrl: e.target.value })}
                    placeholder="URL / Base64 Mini Avatar..."
                    className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                  />
                  <label className="border border-border-custom hover:border-foreground bg-background hover:bg-accent-light text-foreground text-xs font-bold rounded-lg px-3 py-2 cursor-pointer text-center transition-all">
                    Pilih File Mini Avatar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, (b64) => setPhotoFormData({ ...photoFormData, miniAvatarUrl: b64 }))}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-foreground text-background font-bold px-4 py-3 rounded-lg text-xs hover:bg-accent-hover transition-all w-full mt-4 flex justify-center items-center gap-2"
            >
              Unggah & Simpan Foto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
