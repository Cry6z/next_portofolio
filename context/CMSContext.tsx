"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Profile {
  name: string;
  title: string;
  bio: string;
  github: string;
  linkedin: string;
  instagram: string;
  email: string;
  resumeUrl: string;
  avatarUrl: string;
  miniAvatarUrl: string;
  welcomeMessage?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface TerminalCommand {
  id: string;
  command: string;
  description: string;
  output: string;
}

export interface TerminalConfig {
  welcomeMessage: string;
  promptUser: string;
  promptHost: string;
}

interface CMSContextType {
  profile: Profile;
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  messages: Message[];
  terminalConfig: TerminalConfig;
  terminalCommands: TerminalCommand[];
  adminPassword: string;
  isPortfolioOpen: boolean;
  
  // Update Profile
  updateProfile: (profile: Partial<Profile>) => void;
  updateAdminPassword: (password: string) => void;
  togglePortfolioStatus: (isOpen: boolean) => void;
  
  // Project CRUD
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Experience CRUD
  addExperience: (exp: Omit<Experience, "id">) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  
  // Skill CRUD
  addSkill: (skill: Omit<Skill, "id">) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  
  // Message Inbox
  sendMessage: (msg: Omit<Message, "id" | "date" | "read">) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  // Terminal CMS
  updateTerminalConfig: (config: TerminalConfig) => void;
  addTerminalCommand: (cmd: Omit<TerminalCommand, "id">) => void;
  updateTerminalCommand: (id: string, cmd: Partial<TerminalCommand>) => void;
  deleteTerminalCommand: (id: string) => void;

  // Restore Defaults
  resetAllData: () => void;
  
  // Migration
  migrateLocalData: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

// Initial Mock Data
const defaultProfile: Profile = {
  name: "GIBRAN",
  title: "Creative Frontend Developer & UI/UX Designer",
  bio: "Saya adalah seorang developer yang mendedikasikan diri untuk menciptakan pengalaman digital yang minimalis, modern, dan interaktif. Berfokus pada detail estetika, tipografi yang kuat, serta performa web yang optimal.",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  email: "gibran@example.com",
  resumeUrl: "#",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
  miniAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
  welcomeMessage: "To my portfolio",
};

const defaultProjects: Project[] = [];
const defaultExperiences: Experience[] = [];
const defaultSkills: Skill[] = [];
const defaultMessages: Message[] = [];

const defaultTerminalConfig: TerminalConfig = {
  welcomeMessage: "==================================================\nPORTFOLIO INTERACTIVE SHELL v1.0.0\nKetik 'help' untuk melihat daftar perintah.\n==================================================",
  promptUser: "guest",
  promptHost: "gibran",
};

const defaultTerminalCommands: TerminalCommand[] = [
  {
    id: "tc-1",
    command: "about",
    description: "Menampilkan bio singkat dari saya",
    output: "Saya adalah seorang developer yang mendedikasikan diri untuk menciptakan pengalaman digital yang minimalis, modern, dan interaktif. Berfokus pada detail estetika, tipografi yang kuat, serta performa web yang optimal.",
  },
  {
    id: "tc-2",
    command: "contact",
    description: "Mendapatkan kontak detail email dan sosial media",
    output: "Email: gibran@example.com\nGitHub: github.com/gibran\nLinkedIn: linkedin.com/in/gibran",
  },
  {
    id: "tc-3",
    command: "social",
    description: "Melihat tautan akun sosial media saya",
    output: "Instagram: @gibran\nGitHub: github.com/gibran",
  }
];

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [terminalConfig, setTerminalConfig] = useState<TerminalConfig>(defaultTerminalConfig);
  const [terminalCommands, setTerminalCommands] = useState<TerminalCommand[]>(defaultTerminalCommands);
  const [adminPassword, setAdminPassword] = useState<string>("admin123");
  const [isPortfolioOpen, setIsPortfolioOpen] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  // Load from Supabase (with fallback to localStorage)
  useEffect(() => {
    async function loadCMSData() {
      let isSupabaseLoaded = false;

      if (supabase) {
        try {
          const [
            { data: profileData, error: pError },
            { data: projectsData, error: prError },
            { data: experiencesData, error: exError },
            { data: skillsData, error: skError },
            { data: messagesData, error: msgError },
            { data: termConfigData, error: tcError },
            { data: termCmdsData, error: tcmdError }
          ] = await Promise.all([
            supabase.from("profile").select("*").eq("id", "default").maybeSingle(),
            supabase.from("projects").select("*").order("created_at", { ascending: true }),
            supabase.from("experiences").select("*").order("created_at", { ascending: true }),
            supabase.from("skills").select("*").order("created_at", { ascending: true }),
            supabase.from("messages").select("*").order("created_at", { ascending: false }),
            supabase.from("terminal_config").select("*").eq("id", "default").maybeSingle(),
            supabase.from("terminal_commands").select("*").order("created_at", { ascending: true })
          ]);

          // Check if it's a table missing error (PGRST205)
          const isTableMissing = [pError, prError, exError, skError, msgError, tcError, tcmdError].some(
            (err) => err?.code === 'PGRST205'
          );

          if (isTableMissing) {
            console.warn("Beberapa tabel Supabase belum ada. Pastikan sudah menjalankan skrip SQL.");
          } else {
            // Apply Data, ignore minor network errors to avoid wiping screen
            if (profileData) setProfile(profileData);
            if (projectsData) setProjects(projectsData);
            if (experiencesData) setExperiences(experiencesData);
            if (skillsData) setSkills(skillsData);
            if (messagesData) setMessages(messagesData);
            if (termConfigData) setTerminalConfig(termConfigData);
            if (termCmdsData && termCmdsData.length > 0) setTerminalCommands(termCmdsData);
            
            isSupabaseLoaded = true;
          }
        } catch (e) {
          console.error("Supabase load error, falling back to localStorage", e);
        }
      }

      if (!isSupabaseLoaded) {
        try {
          const savedProfile = localStorage.getItem("cms-profile");
          const savedProjects = localStorage.getItem("cms-projects");
          const savedExperiences = localStorage.getItem("cms-experiences");
          const savedSkills = localStorage.getItem("cms-skills");
          const savedMessages = localStorage.getItem("cms-messages");
          const savedTerminalConfig = localStorage.getItem("cms-terminal-config");
          const savedTerminalCommands = localStorage.getItem("cms-terminal-commands");
          const savedPassword = localStorage.getItem("cms-admin-password");
          const savedPortfolioOpen = localStorage.getItem("cms-portfolio-open");

          setTimeout(() => {
            if (savedProfile) setProfile(JSON.parse(savedProfile));
            if (savedProjects) setProjects(JSON.parse(savedProjects));
            if (savedExperiences) setExperiences(JSON.parse(savedExperiences));
            if (savedSkills) setSkills(JSON.parse(savedSkills));
            if (savedMessages) setMessages(JSON.parse(savedMessages));
            if (savedTerminalConfig) setTerminalConfig(JSON.parse(savedTerminalConfig));
            if (savedTerminalCommands) setTerminalCommands(JSON.parse(savedTerminalCommands));
            if (savedPassword) setAdminPassword(savedPassword);
            if (savedPortfolioOpen) setIsPortfolioOpen(JSON.parse(savedPortfolioOpen));
          }, 0);
        } catch (e) {
          console.error("Failed to load local CMS data", e);
        }
      }

      setTimeout(() => {
        setMounted(true);
      }, 0);
    }

    loadCMSData();
  }, []);

  // Save helpers (saves locally as secondary backup)
  const saveProfile = (newProfile: Profile) => {
    setProfile(newProfile);
    localStorage.setItem("cms-profile", JSON.stringify(newProfile));
  };

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem("cms-projects", JSON.stringify(newProjects));
  };

  const saveExperiences = (newExps: Experience[]) => {
    setExperiences(newExps);
    localStorage.setItem("cms-experiences", JSON.stringify(newExps));
  };

  const saveSkills = (newSkills: Skill[]) => {
    setSkills(newSkills);
    localStorage.setItem("cms-skills", JSON.stringify(newSkills));
  };

  const saveMessages = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    localStorage.setItem("cms-messages", JSON.stringify(newMsgs));
  };

  const saveTerminalConfig = (newConfig: TerminalConfig) => {
    setTerminalConfig(newConfig);
    localStorage.setItem("cms-terminal-config", JSON.stringify(newConfig));
  };

  const saveTerminalCommands = (newCmds: TerminalCommand[]) => {
    setTerminalCommands(newCmds);
    localStorage.setItem("cms-terminal-commands", JSON.stringify(newCmds));
  };

  const updateAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
    localStorage.setItem("cms-admin-password", newPassword);
  };

  // CRUD actions with Supabase write synchronization
  const updateProfile = async (updated: Partial<Profile>) => {
    const newProfile = { ...profile, ...updated };
    saveProfile(newProfile);
    if (supabase) {
      try {
        const { miniAvatarUrl, welcomeMessage, avatarUrl, resumeUrl, ...profileToSave } = newProfile;
        const supabasePayload = {
          ...profileToSave,
          avatarurl: avatarUrl,
          resumeurl: resumeUrl,
        };
        const { error } = await supabase.from("profile").upsert({ id: "default", ...supabasePayload });
        if (error) console.error("Supabase profile update failed", error);
      } catch (e) {
        console.error("Supabase profile update failed", e);
      }
    }
  };

  const addProject = async (proj: Omit<Project, "id">) => {
    const newProj: Project = { ...proj, id: `proj-${Date.now()}` };
    saveProjects([...projects, newProj]);
    if (supabase) {
      try {
        const { demoUrl, githubUrl, ...pToSave } = newProj;
        const pPayload = { ...pToSave, demourl: demoUrl, githuburl: githubUrl };
        const { error } = await supabase.from("projects").insert(pPayload);
        if (error) console.error("Supabase add project failed", error);
      } catch (e) {
        console.error("Supabase add project failed", e);
      }
    }
  };

  const updateProject = async (id: string, updated: Partial<Project>) => {
    const newProjs = projects.map((p) => (p.id === id ? { ...p, ...updated } : p));
    saveProjects(newProjs);
    if (supabase) {
      try {
        const payload: any = { ...updated };
        if (payload.demoUrl !== undefined) { payload.demourl = payload.demoUrl; delete payload.demoUrl; }
        if (payload.githubUrl !== undefined) { payload.githuburl = payload.githubUrl; delete payload.githubUrl; }
        const { error } = await supabase.from("projects").update(payload).eq("id", id);
        if (error) console.error("Supabase update project failed", error);
      } catch (e) {
        console.error("Supabase update project failed", e);
      }
    }
  };

  const deleteProject = async (id: string) => {
    saveProjects(projects.filter((p) => p.id !== id));
    if (supabase) {
      try {
        await supabase.from("projects").delete().eq("id", id);
      } catch (e) {
        console.error("Supabase delete project failed", e);
      }
    }
  };

  const addExperience = async (exp: Omit<Experience, "id">) => {
    const newExp: Experience = { ...exp, id: `exp-${Date.now()}` };
    saveExperiences([...experiences, newExp]);
    if (supabase) {
      try {
        await supabase.from("experiences").insert(newExp);
      } catch (e) {
        console.error("Supabase add experience failed", e);
      }
    }
  };

  const updateExperience = async (id: string, updated: Partial<Experience>) => {
    const newExps = experiences.map((e) => (e.id === id ? { ...e, ...updated } : e));
    saveExperiences(newExps);
    if (supabase) {
      try {
        await supabase.from("experiences").update(updated).eq("id", id);
      } catch (e) {
        console.error("Supabase update experience failed", e);
      }
    }
  };

  const deleteExperience = async (id: string) => {
    saveExperiences(experiences.filter((e) => e.id !== id));
    if (supabase) {
      try {
        await supabase.from("experiences").delete().eq("id", id);
      } catch (e) {
        console.error("Supabase delete experience failed", e);
      }
    }
  };

  const addSkill = async (skill: Omit<Skill, "id">) => {
    const newSkill: Skill = { ...skill, id: `sk-${Date.now()}` };
    saveSkills([...skills, newSkill]);
    if (supabase) {
      try {
        await supabase.from("skills").insert(newSkill);
      } catch (e) {
        console.error("Supabase add skill failed", e);
      }
    }
  };

  const updateSkill = async (id: string, updated: Partial<Skill>) => {
    const newSkills = skills.map((s) => (s.id === id ? { ...s, ...updated } : s));
    saveSkills(newSkills);
    if (supabase) {
      try {
        await supabase.from("skills").update(updated).eq("id", id);
      } catch (e) {
        console.error("Supabase update skill failed", e);
      }
    }
  };

  const deleteSkill = async (id: string) => {
    saveSkills(skills.filter((s) => s.id !== id));
    if (supabase) {
      try {
        await supabase.from("skills").delete().eq("id", id);
      } catch (e) {
        console.error("Supabase delete skill failed", e);
      }
    }
  };

  const sendMessage = async (msg: Omit<Message, "id" | "date" | "read">) => {
    const newMsg: Message = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toLocaleString("id-ID"),
      read: false,
    };
    saveMessages([newMsg, ...messages]);
    if (supabase) {
      try {
        await supabase.from("messages").insert(newMsg);
      } catch (e) {
        console.error("Supabase send message failed", e);
      }
    }
  };

  const markMessageRead = async (id: string) => {
    saveMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
    if (supabase) {
      try {
        await supabase.from("messages").update({ read: true }).eq("id", id);
      } catch (e) {
        console.error("Supabase read message failed", e);
      }
    }
  };

  const deleteMessage = async (id: string) => {
    saveMessages(messages.filter((m) => m.id !== id));
    if (supabase) {
      try {
        await supabase.from("messages").delete().eq("id", id);
      } catch (e) {
        console.error("Supabase delete message failed", e);
      }
    }
  };

  const updateTerminalConfig = async (config: TerminalConfig) => {
    setTerminalConfig(config);
    localStorage.setItem("cms-terminal-config", JSON.stringify(config));
    if (supabase) {
      try {
        const payload = {
          id: "default",
          welcomemessage: config.welcomeMessage,
          promptuser: config.promptUser,
          prompthost: config.promptHost
        };
        await supabase.from("terminal_config").upsert(payload);
      } catch (e) {
        console.error("Supabase update terminal config failed", e);
      }
    }
  };

  const addTerminalCommand = async (cmd: Omit<TerminalCommand, "id">) => {
    const newCmd: TerminalCommand = { ...cmd, id: `tc-${Date.now()}` };
    saveTerminalCommands([...terminalCommands, newCmd]);
    if (supabase) {
      try {
        await supabase.from("terminal_commands").insert(newCmd);
      } catch (e) {
        console.error("Supabase add terminal command failed", e);
      }
    }
  };

  const updateTerminalCommand = async (id: string, updated: Partial<TerminalCommand>) => {
    const newCmds = terminalCommands.map((c) => (c.id === id ? { ...c, ...updated } : c));
    saveTerminalCommands(newCmds);
    if (supabase) {
      try {
        await supabase.from("terminal_commands").update(updated).eq("id", id);
      } catch (e) {
        console.error("Supabase update terminal command failed", e);
      }
    }
  };

  const deleteTerminalCommand = async (id: string) => {
    saveTerminalCommands(terminalCommands.filter((c) => c.id !== id));
    if (supabase) {
      try {
        await supabase.from("terminal_commands").delete().eq("id", id);
      } catch (e) {
        console.error("Supabase delete terminal command failed", e);
      }
    }
  };

  const resetAllData = async () => {
    saveProfile(defaultProfile);
    saveProjects(defaultProjects);
    saveExperiences(defaultExperiences);
    saveSkills(defaultSkills);
    saveMessages(defaultMessages);
    saveTerminalConfig(defaultTerminalConfig);
    saveTerminalCommands(defaultTerminalCommands);
    
    if (supabase) {
      try {
        await supabase.from("profile").upsert({ id: "default", ...defaultProfile });
        await supabase.from("projects").delete().neq("id", "none");
        await supabase.from("experiences").delete().neq("id", "none");
        await supabase.from("skills").delete().neq("id", "none");
        await supabase.from("messages").delete().neq("id", "none");
        await supabase.from("terminal_config").upsert({ id: "default", ...defaultTerminalConfig });
        await supabase.from("terminal_commands").delete().neq("id", "none");
        for (const cmd of defaultTerminalCommands) {
          await supabase.from("terminal_commands").upsert(cmd);
        }
      } catch (e) {
        console.error("Supabase reset all data failed", e);
      }
    }
  };

  const togglePortfolioStatus = (isOpen: boolean) => {
    setIsPortfolioOpen(isOpen);
    localStorage.setItem("cms-portfolio-open", JSON.stringify(isOpen));
  };

  const migrateLocalData = async () => {
    if (!supabase) return;
    
    try {
      const savedProfile = localStorage.getItem("cms-profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        const { miniAvatarUrl, welcomeMessage, avatarUrl, resumeUrl, ...profileToSave } = parsed;
        const supabasePayload = { ...profileToSave, avatarurl: avatarUrl, resumeurl: resumeUrl };
        const { error } = await supabase.from("profile").upsert({ id: "default", ...supabasePayload });
        if (error) throw new Error("Gagal migrasi profil: " + error.message);
      }

      const savedProjects = localStorage.getItem("cms-projects");
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed);
        await supabase.from("projects").delete().neq("id", "none");
        for (const p of parsed) {
           const { demoUrl, githubUrl, ...pToSave } = p;
           const pPayload = { ...pToSave, demourl: demoUrl, githuburl: githubUrl };
           const { error } = await supabase.from("projects").upsert(pPayload);
           if (error) throw new Error("Gagal migrasi proyek: " + error.message);
        }
      }

      const savedExperiences = localStorage.getItem("cms-experiences");
      if (savedExperiences) {
        const parsed = JSON.parse(savedExperiences);
        setExperiences(parsed);
        await supabase.from("experiences").delete().neq("id", "none");
        for (const e of parsed) {
           const { error } = await supabase.from("experiences").upsert(e);
           if (error) throw new Error("Gagal migrasi pengalaman: " + error.message);
        }
      }

      const savedSkills = localStorage.getItem("cms-skills");
      if (savedSkills) {
        const parsed = JSON.parse(savedSkills);
        setSkills(parsed);
        await supabase.from("skills").delete().neq("id", "none");
        for (const s of parsed) {
           const { error } = await supabase.from("skills").upsert(s);
           if (error) throw new Error("Gagal migrasi keahlian: " + error.message);
        }
      }

      alert("Penyelamatan data berhasil! Semua data lokal Anda telah dipindahkan ke Cloud.");
    } catch (e: any) {
      console.error(e);
      alert("Terjadi kesalahan saat migrasi data: " + e.message);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <CMSContext.Provider
      value={{
        profile,
        projects,
        experiences,
        skills,
        messages,
        terminalConfig,
        terminalCommands,
        adminPassword,
        isPortfolioOpen,
        updateProfile,
        updateAdminPassword,
        togglePortfolioStatus,
        addProject,
        updateProject,
        deleteProject,
        addExperience,
        updateExperience,
        deleteExperience,
        addSkill,
        updateSkill,
        deleteSkill,
        sendMessage,
        markMessageRead,
        deleteMessage,
        updateTerminalConfig,
        addTerminalCommand,
        updateTerminalCommand,
        deleteTerminalCommand,
        resetAllData,
        migrateLocalData,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
}
