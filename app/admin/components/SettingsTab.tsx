"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

interface SettingsTabProps {
  handleResetData: () => void;
}

export default function SettingsTab({ handleResetData }: SettingsTabProps) {
  const { profile, updateProfile, adminPassword, updateAdminPassword, isPortfolioOpen, togglePortfolioStatus } = useCMS();

  const [profileFormData, setProfileFormData] = useState({
    name: "",
    title: "",
    bio: "",
    email: "",
    resumeUrl: "",
    github: "",
    linkedin: "",
    instagram: "",
    welcomeMessage: "",
    handle: "",
    status: "",
    contactText: "",
  });

  const [passwordChangeData, setPasswordChangeData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (profile) {
      setTimeout(() => {
        setProfileFormData({
          name: profile.name || "",
          title: profile.title || "",
          bio: profile.bio || "",
          email: profile.email || "",
          resumeUrl: profile.resumeUrl || "",
          github: profile.github || "",
          linkedin: profile.linkedin || "",
          instagram: profile.instagram || "",
          welcomeMessage: profile.welcomeMessage || "",
          handle: profile.handle || "",
          status: profile.status || "",
          contactText: profile.contactText || "",
        });
      }, 0);
    }
  }, [profile]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileFormData);
    alert("Profil berhasil diperbarui!");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordChangeData.currentPassword !== adminPassword) {
      setPasswordError("Kata sandi saat ini salah!");
      return;
    }
    if (passwordChangeData.newPassword.length < 5) {
      setPasswordError("Kata sandi baru minimal 5 karakter!");
      return;
    }
    if (passwordChangeData.newPassword !== passwordChangeData.confirmPassword) {
      setPasswordError("Konfirmasi sandi baru tidak cocok!");
      return;
    }

    updateAdminPassword(passwordChangeData.newPassword);
    setPasswordSuccess("Sandi berhasil diubah! Gunakan sandi baru pada login berikutnya.");
    setPasswordChangeData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">PENGATURAN</h2>
        <p className="text-xs text-accent-custom font-mono uppercase mt-1">
          Ubah Konten Profil & Kata Sandi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Config Form */}
        <div className="lg:col-span-7 border border-border-custom bg-card-custom p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="text-md font-bold uppercase tracking-tight border-b border-border-custom pb-2">
            Edit Profil Utama
          </h3>

          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Nama Utama *
              </label>
              <input
                type="text"
                required
                value={profileFormData.name}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, name: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Judul Peran *
              </label>
              <input
                type="text"
                required
                value={profileFormData.title}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, title: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Alamat Email *
              </label>
              <input
                type="email"
                required
                value={profileFormData.email}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, email: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Tautan Link Resume (CV PDF)
              </label>
              <input
                type="text"
                value={profileFormData.resumeUrl}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, resumeUrl: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Link GitHub
              </label>
              <input
                type="text"
                value={profileFormData.github}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, github: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Link LinkedIn
              </label>
              <input
                type="text"
                value={profileFormData.linkedin}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, linkedin: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Link Instagram
              </label>
              <input
                type="text"
                value={profileFormData.instagram}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, instagram: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Bio Singkat *
              </label>
              <textarea
                required
                rows={4}
                value={profileFormData.bio}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, bio: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground resize-none"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Pesan Layar Selamat Datang (Splash Screen)
              </label>
              <input
                type="text"
                value={profileFormData.welcomeMessage}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, welcomeMessage: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
              />
            </div>

            {/* Profile Card Customization */}
            <div className="md:col-span-2 border-t border-border-custom/40 pt-4 mt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent-custom mb-1">
                Kustomisasi Kartu Profil (Profile Card)
              </h4>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Username Handle Kartu (contoh: gibran)
              </label>
              <input
                type="text"
                value={profileFormData.handle}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, handle: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Status Kartu (contoh: Tersedia untuk proyek)
              </label>
              <input
                type="text"
                value={profileFormData.status}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, status: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[10px] font-bold font-mono text-accent-custom uppercase">
                Teks Tombol Kontak Kartu (contoh: Sapa Saya)
              </label>
              <input
                type="text"
                value={profileFormData.contactText}
                onChange={(e) =>
                  setProfileFormData({ ...profileFormData, contactText: e.target.value })
                }
                className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-foreground text-background font-semibold px-5 py-2.5 rounded-lg text-xs hover:bg-accent-hover transition-all mt-2"
              >
                Perbarui Profil
              </button>
            </div>
          </form>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Maintenance Toggle */}
          <div className="border border-border-custom bg-card-custom p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
            <div className={`absolute inset-0 opacity-10 transition-colors duration-500 pointer-events-none ${isPortfolioOpen ? 'bg-green-500' : 'bg-red-500'}`} />
            
            <h3 className="text-md font-bold uppercase tracking-tight border-b border-border-custom pb-2 relative z-10">
              Status Portofolio
            </h3>
            
            <div className="flex items-center justify-between mt-2 relative z-10">
              <div className="flex flex-col">
                <span className={`font-black tracking-widest text-sm ${isPortfolioOpen ? 'text-green-500' : 'text-red-500'}`}>
                  {isPortfolioOpen ? 'ONLINE' : 'MAINTENANCE'}
                </span>
                <span className="text-[10px] text-accent-custom mt-1 max-w-[200px]">
                  {isPortfolioOpen 
                    ? "Situs dapat diakses oleh publik." 
                    : "Situs ditutup dan menampilkan layar Maintenance."}
                </span>
              </div>
              
              <button 
                onClick={() => {
                  if (isPortfolioOpen) {
                    if (confirm("Apakah Anda yakin ingin menutup portofolio? Pengunjung tidak akan bisa melihat konten Anda.")) {
                      togglePortfolioStatus(false);
                    }
                  } else {
                    togglePortfolioStatus(true);
                  }
                }}
                className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${isPortfolioOpen ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}
              >
                <div 
                  className={`absolute top-1 bottom-1 w-5 rounded-full transition-all duration-300 shadow-sm ${isPortfolioOpen ? 'left-8 bg-green-500' : 'left-1 bg-red-500'}`} 
                />
              </button>
            </div>
          </div>
          
          {/* Change Password Form */}
          <div className="border border-border-custom bg-card-custom p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-md font-bold uppercase tracking-tight border-b border-border-custom pb-2">
              Ubah Sandi Masuk
            </h3>

            <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
              {passwordError && (
                <div className="text-[10px] font-semibold text-red-500 border border-red-500/20 bg-red-500/5 px-3 py-2 rounded font-mono">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="text-[10px] font-semibold text-green-500 border border-green-500/20 bg-green-500/5 px-3 py-2 rounded font-mono">
                  {passwordSuccess}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                  Sandi Saat Ini *
                </label>
                <input
                  type="password"
                  required
                  value={passwordChangeData.currentPassword}
                  onChange={(e) =>
                    setPasswordChangeData({
                      ...passwordChangeData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                  Sandi Baru *
                </label>
                <input
                  type="password"
                  required
                  value={passwordChangeData.newPassword}
                  onChange={(e) =>
                    setPasswordChangeData({
                      ...passwordChangeData,
                      newPassword: e.target.value,
                    })
                  }
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                  Konfirmasi Sandi Baru *
                </label>
                <input
                  type="password"
                  required
                  value={passwordChangeData.confirmPassword}
                  onChange={(e) =>
                    setPasswordChangeData({
                      ...passwordChangeData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none text-foreground"
                />
              </div>

              <button
                type="submit"
                className="bg-foreground text-background font-semibold px-4 py-2.5 rounded-lg text-xs hover:bg-accent-hover transition-all w-full mt-2"
              >
                Ubah Sandi
              </button>
            </form>
          </div>

          {/* Dangerous content management */}
          <div className="border border-red-500/15 bg-red-500/5 p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-md font-bold uppercase tracking-tight border-b border-red-500/20 pb-2 text-red-500">
              Zona Bahaya
            </h3>
            <p className="text-xs text-accent-custom leading-relaxed">
              Setel ulang semua konten portofolio dan kontak kembali ke data default bawaan. Ini akan menghapus data yang telah Anda tambahkan secara permanen.
            </p>
            <button
              onClick={handleResetData}
              className="flex items-center justify-center gap-1.5 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-lg py-2.5 text-xs font-bold transition-all text-red-500"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Semua Data
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
