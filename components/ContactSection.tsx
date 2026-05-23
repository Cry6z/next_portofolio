"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle, Grid } from "lucide-react";
import { Profile, Message } from "@/context/CMSContext";

interface ContactSectionProps {
  profile: Profile;
  sendMessage: (msg: Omit<Message, "id" | "date" | "read">) => void;
}

export default function ContactSection({ profile, sendMessage }: ContactSectionProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formError, setFormError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError("Mohon lengkapi semua kolom formulir.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError("Alamat email tidak valid.");
      return;
    }

    // Call CMS action to send message
    sendMessage({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });

    setFormSubmitted(true);
    setFormData({ name: "", email: "", message: "" });

    // Reset success animation after a few seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 6000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section id="contact" className="py-24 border-t border-border-custom">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Direct Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col justify-center gap-6"
        >
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold tracking-widest font-mono text-accent-custom uppercase">
              HUBUNGAN & KOLABORASI / 05
            </span>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">CONTACT.</h3>
          </div>

          <p className="text-sm md:text-base text-accent-custom leading-relaxed font-sans max-w-md">
            Punya proyek menarik, lowongan pekerjaan, atau sekadar ingin berdiskusi santai tentang web? Kirim pesan dan mari berdiskusi!
          </p>

          <div className="flex flex-col gap-4 mt-4 font-mono text-sm">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 text-foreground hover:underline group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border-custom bg-card-custom group-hover:border-foreground transition-all">
                  <Mail className="h-4 w-4" />
                </div>
                <span>{profile.email}</span>
              </a>
            )}
            <div className="flex items-center gap-3 text-accent-custom">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border-custom bg-card-custom">
                <Grid className="h-4 w-4" />
              </div>
              <span>Bengkulu, Indonesia</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Dynamic Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="border border-border-custom bg-card-custom p-8 md:p-10 rounded-2xl">
            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleFormSubmit}
                  className="flex flex-col gap-6"
                >
                  {formError && (
                    <div className="text-xs font-semibold text-red-500 border border-red-500/20 bg-red-500/5 px-4 py-2.5 rounded-lg font-mono">
                      {formError}
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="name"
                      className="text-xs font-bold tracking-widest font-mono text-accent-custom uppercase"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tulis nama Anda..."
                      className="w-full bg-background border border-border-custom rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground text-foreground placeholder:text-accent-custom/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-xs font-bold tracking-widest font-mono text-accent-custom uppercase"
                    >
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="nama@email.com"
                      className="w-full bg-background border border-border-custom rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground text-foreground placeholder:text-accent-custom/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="message"
                      className="text-xs font-bold tracking-widest font-mono text-accent-custom uppercase"
                    >
                      Isi Pesan
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Apa yang ingin Anda bicarakan?..."
                      className="w-full bg-background border border-border-custom rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-foreground text-foreground placeholder:text-accent-custom/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-foreground text-background font-semibold rounded-lg py-3 hover:bg-accent-hover transition-all duration-300 w-full mt-2 group"
                  >
                    Kirim Pesan
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-12 gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle className="h-16 w-16 text-foreground" strokeWidth={1} />
                  </motion.div>
                  <h4 className="text-2xl font-bold tracking-tight text-foreground mt-2">
                    Pesan Berhasil Terkirim!
                  </h4>
                  <p className="text-sm text-accent-custom max-w-sm leading-relaxed font-sans">
                    Terima kasih! Pesan Anda telah terekam di sistem kami. Saya akan segera membalas pesan Anda lewat email.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
