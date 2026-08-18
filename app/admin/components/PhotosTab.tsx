"use client";

import React, { useState, useEffect } from "react";
import ProfileCard from "@/components/ProfileCard";
import { useCMS } from "@/context/CMSContext";
import { Upload } from "lucide-react";

export default function PhotosTab() {
  const { profile, updateProfile, gallery, addGalleryItem, deleteGalleryItem } = useCMS();

  const [photoFormData, setPhotoFormData] = useState({
    avatarUrl: "",
    miniAvatarUrl: "",
    heroBgUrl: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const validFiles: File[] = [];

    for (const file of filesArray) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Berkas "${file.name}" terlalu besar! Maksimal 5MB per foto.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    const promises = validFiles.map((file) => {
      return new Promise<{ title: string; caption: string; imageUrl: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve({
              title: file.name.split(".")[0] || "Foto Galeri",
              caption: "",
              imageUrl: reader.result,
            });
          } else {
            reject(new Error("Gagal membaca file"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(async (newItems) => {
        await addGalleryItem(newItems);
        alert(`${newItems.length} foto berhasil diunggah ke Galeri!`);
      })
      .catch((error) => {
        console.error("Gagal mengunggah foto", error);
        alert("Terjadi kesalahan saat memproses gambar.");
      })
      .finally(() => {
        setIsUploading(false);
        e.target.value = "";
      });
  };

  useEffect(() => {
    if (profile) {
      setTimeout(() => {
        setPhotoFormData({
          avatarUrl: profile.avatarUrl || "",
          miniAvatarUrl: profile.miniAvatarUrl || "",
          heroBgUrl: profile.heroBgUrl || "",
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
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 5MB untuk optimasi penyimpanan.");
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
    <div className="flex flex-col gap-6">
      <div className="border-b border-border-custom/50 pb-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground font-mono">FOTO PROFIL</h2>
        <p className="text-xs text-accent-custom font-mono uppercase mt-1">
          Kelola Foto Utama dan Mini Avatar Kartu Profil
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Live Preview */}
        <div className="flex flex-col items-center justify-center w-full bg-card-custom/50 border border-border-custom rounded-none p-6 min-h-[400px] relative overflow-hidden">
          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="relative group w-full max-w-70 sm:max-w-85 lg:w-full lg:max-w-90 aspect-[0.718] mx-auto">
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
            <p className="text-[9px] text-accent-custom font-mono mt-6 text-center uppercase tracking-widest border border-border-custom px-4 py-1.5 rounded-none bg-background/50">
              Pratinjau Langsung (Live Preview)
            </p>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="border border-border-custom bg-card-custom p-4 md:p-6 rounded-none flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-tight border-b border-border-custom pb-2 font-mono text-foreground">
            Pilih File Foto
          </h3>
          
          <form onSubmit={handleSavePhotos} className="flex flex-col gap-6">
            
            {/* Main Avatar */}
            <div className="flex flex-col gap-3">
              <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                Foto Utama (Hero Section)
              </label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-none border border-border-custom bg-background flex items-center justify-center overflow-hidden shrink-0">
                  {photoFormData.avatarUrl ? (
                    <img src={photoFormData.avatarUrl} alt="Preview Avatar" className="w-full h-full object-cover grayscale" />
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
                    className="w-full bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
                  />
                  <label className="border border-border-custom hover:border-foreground bg-background hover:bg-foreground hover:text-background text-foreground text-[10px] font-mono font-bold rounded-none px-3 py-2 cursor-pointer text-center transition-all uppercase">
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
              <label className="text-[9px] font-bold font-mono text-accent-custom uppercase">
                Mini Avatar (Sudut Kartu)
              </label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-none border border-border-custom bg-background flex items-center justify-center overflow-hidden shrink-0">
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
                    className="w-full bg-background border border-border-custom rounded-none px-3 py-2 text-xs focus:outline-none text-foreground font-mono"
                  />
                  <label className="border border-border-custom hover:border-foreground bg-background hover:bg-foreground hover:text-background text-foreground text-[10px] font-mono font-bold rounded-none px-3 py-2 cursor-pointer text-center transition-all uppercase">
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
              className="bg-foreground text-background border border-foreground hover:bg-background hover:text-foreground font-bold px-4 py-2.5 rounded-none text-xs font-mono uppercase transition-all w-full mt-2 cursor-pointer flex justify-center items-center gap-2"
            >
              Unggah & Simpan Foto
            </button>
          </form>
        </div>
      </div>

      {/* Gallery Photos Management Section */}
      <div className="border-t border-border-custom pt-8 mt-4 flex flex-col gap-6">
        <div className="border-b border-border-custom/50 pb-4">
          <h2 className="text-2xl font-black tracking-tight text-foreground font-mono">GALERI FOTO PORTOFOLIO</h2>
          <p className="text-xs text-accent-custom font-mono uppercase mt-1">
            Unggah dan Atur Jurnal Foto Visual Publik Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Add New Gallery Items (Left / Col-5) */}
          <div className="lg:col-span-5 border border-border-custom bg-card-custom p-4 md:p-6 rounded-none flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-tight border-b border-border-custom pb-2 font-mono text-foreground">
              Unggah Foto Masal (Batch Upload)
            </h3>
            <div className="flex flex-col gap-4 font-mono text-xs">
              <label
                className={`border border-dashed border-border-custom hover:border-foreground/35 bg-background hover:bg-foreground/5 cursor-pointer p-8 flex flex-col items-center justify-center gap-3 transition-all rounded-none text-center ${
                  isUploading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleFilesChange}
                  disabled={isUploading}
                  className="hidden"
                />
                <div className="h-10 w-10 flex items-center justify-center border border-border-custom bg-card-custom text-accent-custom">
                  <Upload className={`h-5 w-5 ${isUploading ? "animate-bounce" : ""}`} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-foreground">
                    {isUploading ? "SEDANG MENGUNGGAH..." : "PILIH BEBERAPA FOTO"}
                  </span>
                  <span className="text-[9px] text-accent-custom uppercase tracking-wide">
                    Klik untuk memilih banyak file gambar sekaligus (maksimal 5MB per foto)
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Gallery Items Grid List (Right / Col-7) */}
          <div className="lg:col-span-7 border border-border-custom bg-card-custom p-4 md:p-6 rounded-none flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-tight border-b border-border-custom pb-2 font-mono text-foreground">
              Daftar Koleksi Foto ({gallery?.length || 0})
            </h3>

            {gallery && gallery.length > 0 && (
              <div className="flex items-center justify-between bg-background border border-border-custom p-3 rounded-none font-mono text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={gallery.length > 0 && selectedPhotos.length === gallery.length}
                    onChange={() => {
                      if (selectedPhotos.length === gallery.length) {
                        setSelectedPhotos([]);
                      } else {
                        setSelectedPhotos(gallery.map((item) => item.id));
                      }
                    }}
                    className="h-4 w-4 rounded-none accent-foreground bg-background cursor-pointer"
                  />
                  <span className="font-bold text-foreground">PILIH SEMUA</span>
                </label>

                {selectedPhotos.length > 0 && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Hapus ${selectedPhotos.length} foto terpilih dari galeri?`)) {
                        await deleteGalleryItem(selectedPhotos);
                        setSelectedPhotos([]);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-650 text-white border-none rounded-none text-[10px] font-bold uppercase cursor-pointer transition-colors"
                  >
                    HAPUS TERPILIH ({selectedPhotos.length})
                  </button>
                )}
              </div>
            )}

            {!gallery || gallery.length === 0 ? (
              <p className="text-xs text-accent-custom py-10 text-center font-mono uppercase">
                Galeri kosong. Silakan unggah beberapa foto di sebelah kiri.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {gallery.map((item) => {
                  const isSelected = selectedPhotos.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedPhotos((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((id) => id !== item.id)
                            : [...prev, item.id]
                        );
                      }}
                      className={`border p-2 rounded-none flex flex-col gap-2 relative group transition-all cursor-pointer bg-background ${
                        isSelected ? "border-foreground" : "border-border-custom hover:border-foreground/35"
                      }`}
                    >
                      {/* Checkbox indicator */}
                      <div
                        className="absolute top-3 left-3 z-10 bg-background/95 border border-border-custom p-1 rounded-none flex items-center justify-center shadow-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedPhotos((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((id) => id !== item.id)
                                : [...prev, item.id]
                            );
                          }}
                          className="h-3.5 w-3.5 rounded-none accent-foreground bg-background cursor-pointer"
                        />
                      </div>

                      <div className="aspect-square w-full overflow-hidden border border-border-custom rounded-none bg-accent-light">
                        <img
                          src={item.imageUrl}
                          alt="Thumbnail Galeri"
                          className={`object-cover w-full h-full transition-all duration-300 ${
                            isSelected ? "grayscale-0" : "grayscale group-hover:grayscale-0"
                          }`}
                        />
                      </div>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm("Hapus foto ini dari galeri?")) {
                            await deleteGalleryItem(item.id);
                            setSelectedPhotos((prev) => prev.filter((id) => id !== item.id));
                          }
                        }}
                        className="w-full text-center py-1 border border-border-custom bg-background hover:bg-red-500 hover:text-white hover:border-red-500 rounded-none text-[9px] font-mono font-bold uppercase cursor-pointer transition-all"
                      >
                        Hapus
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
