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
  handle?: string;
  status?: string;
  contactText?: string;
  heroBgUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
  thumbnail?: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
  screenshots?: string[];
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
  tags: string[];
  
  // Update Profile
  updateProfile: (profile: Partial<Profile>) => void;
  updateAdminPassword: (password: string) => void;
  togglePortfolioStatus: (isOpen: boolean) => void;
  
  // Global Tags CRUD
  addTag: (name: string) => Promise<void>;
  deleteTag: (name: string) => Promise<void>;
  
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
  handle: "gibran",
  status: "Tersedia untuk proyek",
  contactText: "Sapa Saya",
  heroBgUrl: "",
};

const defaultProjects: Project[] = [];
const defaultExperiences: Experience[] = [];
const defaultSkills: Skill[] = [];
const defaultMessages: Message[] = [];
const defaultTags: string[] = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Figma", "Node.js", "Python"];

const defaultTerminalConfig: TerminalConfig = {
  welcomeMessage: "==================================================\nportfolio interactive shell v1.0.0\nketik 'help' untuk melihat daftar perintah.\n==================================================",
  promptUser: "guest",
  promptHost: "gibran",
};

const defaultTerminalCommands: TerminalCommand[] = [
  {
    id: "tc-1",
    command: "about",
    description: "menampilkan bio singkat dari saya",
    output: "saya adalah seorang developer yang mendedikasikan diri untuk menciptakan pengalaman digital yang minimalis, modern, dan interaktif. berfokus pada detail estetika, tipografi yang kuat, serta performa web yang optimal.",
  },
  {
    id: "tc-2",
    command: "contact",
    description: "mendapatkan kontak detail email dan sosial media",
    output: "email: gibran@example.com\ngithub: github.com/gibran\nlinkedin: linkedin.com/in/gibran",
  },
  {
    id: "tc-3",
    command: "social",
    description: "melihat tautan akun sosial media saya",
    output: "instagram: @gibran\ngithub: github.com/gibran",
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
  const [tags, setTags] = useState<string[]>(defaultTags);
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
            { data: termCmdsData, error: tcmdError },
            { data: tagsData, error: tError }
          ] = await Promise.all([
            supabase.from("profile").select("*").eq("id", "default").maybeSingle(),
            supabase.from("projects").select("*").order("created_at", { ascending: true }),
            supabase.from("experiences").select("*").order("created_at", { ascending: true }),
            supabase.from("skills").select("*").order("created_at", { ascending: true }),
            supabase.from("messages").select("*").order("created_at", { ascending: false }),
            supabase.from("terminal_config").select("*").eq("id", "default").maybeSingle(),
            supabase.from("terminal_commands").select("*").order("created_at", { ascending: true }),
            supabase.from("tags").select("*").order("name", { ascending: true })
          ]);

          // Check if it's a table missing error (PGRST205)
          const isTableMissing = [pError, prError, exError, skError, msgError, tcError, tcmdError, tError].some(
            (err) => err?.code === 'PGRST205'
          );

          if (isTableMissing) {
            console.warn("Beberapa tabel Supabase belum ada. Pastikan sudah menjalankan skrip SQL.");
          } else {
            // Apply Profile
            if (profileData) {
              let localHeroBg = "";
              try {
                const savedProfile = localStorage.getItem("cms-profile");
                if (savedProfile) {
                  const parsed = JSON.parse(savedProfile);
                  localHeroBg = parsed.heroBgUrl || "";
                }
              } catch (e) {
                console.error("Failed to parse local profile for heroBgUrl fallback", e);
              }

              const mappedProfile = {
                ...profileData,
                avatarUrl: profileData.avatarurl || profileData.avatarUrl,
                resumeUrl: profileData.resumeurl || profileData.resumeUrl,
                miniAvatarUrl: profileData.miniAvatarUrl || profileData.miniavatarurl || profileData.avatarurl || profileData.avatarUrl,
                welcomeMessage: defaultProfile.welcomeMessage,
                handle: profileData.handle || defaultProfile.handle,
                status: profileData.status || defaultProfile.status,
                contactText: profileData.contactText || profileData.contacttext || defaultProfile.contactText,
                heroBgUrl: profileData.heroBgUrl || profileData.herobgurl || localHeroBg || "",
              };
              setProfile(mappedProfile);
            } else {
              // Seed default profile if empty
              const { miniAvatarUrl, welcomeMessage, avatarUrl, resumeUrl, handle, status, contactText, heroBgUrl, ...pToSave } = defaultProfile;
              const payload = { 
                ...pToSave, 
                avatarurl: avatarUrl, 
                resumeurl: resumeUrl,
                miniAvatarUrl: miniAvatarUrl,
                handle: handle,
                status: status,
                contactText: contactText,
                heroBgUrl: heroBgUrl
              };
              const { error } = await supabase.from("profile").upsert({ id: "default", ...payload });
              if (error) {
                console.warn("Seeding default profile failed, retrying without heroBgUrl:", error.message);
                const { heroBgUrl: _, ...retryPayload } = payload;
                await supabase.from("profile").upsert({ id: "default", ...retryPayload });
              }
              setProfile(defaultProfile);
            }

            // Apply Projects
            if (projectsData && projectsData.length > 0) {
              const mappedProjects = projectsData.map((p: any) => ({
                ...p,
                demoUrl: p.demourl || p.demoUrl,
                githubUrl: p.githuburl || p.githubUrl,
                screenshots: p.screenshots || [],
                thumbnail: p.thumbnail || "",
              }));
              setProjects(mappedProjects);
            } else {
              // Seed default projects
              for (const p of defaultProjects) {
                const { demoUrl, githubUrl, ...pToSave } = p;
                await supabase.from("projects").upsert({ ...pToSave, demourl: demoUrl, githuburl: githubUrl });
              }
              setProjects(defaultProjects);
            }

            // Apply Experiences
            if (experiencesData && experiencesData.length > 0) {
              setExperiences(experiencesData);
            } else {
              for (const e of defaultExperiences) {
                await supabase.from("experiences").upsert(e);
              }
              setExperiences(defaultExperiences);
            }

            // Apply Skills
            if (skillsData && skillsData.length > 0) {
              setSkills(skillsData);
            } else {
              for (const s of defaultSkills) {
                await supabase.from("skills").upsert(s);
              }
              setSkills(defaultSkills);
            }

            // Apply Messages
            if (messagesData) setMessages(messagesData);

            // Apply Terminal Config
            if (termConfigData) {
              const mappedTermConfig = {
                ...termConfigData,
                welcomeMessage: termConfigData.welcomemessage || termConfigData.welcomeMessage,
                promptUser: termConfigData.promptuser || termConfigData.promptUser,
                promptHost: termConfigData.prompthost || termConfigData.promptHost,
              };
              setTerminalConfig(mappedTermConfig);
            }
            if (termCmdsData && termCmdsData.length > 0) setTerminalCommands(termCmdsData);

            // Apply Tags
            if (tagsData && tagsData.length > 0) {
              setTags(tagsData.map((t: any) => t.name));
            } else {
              // Seed default tags if empty
              for (const name of defaultTags) {
                await supabase.from("tags").upsert({ id: `tag-${name.toLowerCase().replace(/\s+/g, '-')}`, name });
              }
              setTags(defaultTags);
            }
            
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
          const savedTags = localStorage.getItem("cms-tags");

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
            if (savedTags) setTags(JSON.parse(savedTags));
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
  const saveTags = (newTags: string[]) => {
    setTags(newTags);
    localStorage.setItem("cms-tags", JSON.stringify(newTags));
  };

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
  const addTag = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    const newTags = [...tags, trimmed];
    saveTags(newTags);
    if (supabase) {
      try {
        await supabase.from("tags").upsert({ id: `tag-${trimmed.toLowerCase().replace(/\s+/g, '-')}`, name: trimmed });
      } catch (e) {
        console.error("Supabase add tag failed", e);
      }
    }
  };

  const deleteTag = async (name: string) => {
    const newTags = tags.filter((t) => t !== name);
    saveTags(newTags);
    if (supabase) {
      try {
        await supabase.from("tags").delete().eq("name", name);
      } catch (e) {
        console.error("Supabase delete tag failed", e);
      }
    }
  };

  const updateProfile = async (updated: Partial<Profile>) => {
    const newProfile = { ...profile, ...updated };
    saveProfile(newProfile);
    if (supabase) {
      try {
        const { miniAvatarUrl, welcomeMessage, avatarUrl, resumeUrl, handle, status, contactText, heroBgUrl, ...profileToSave } = newProfile;
        const supabasePayload = {
          ...profileToSave,
          avatarurl: avatarUrl,
          resumeurl: resumeUrl,
          miniAvatarUrl: miniAvatarUrl,
          handle: handle,
          status: status,
          contactText: contactText,
          heroBgUrl: heroBgUrl,
        };
        const { error } = await supabase.from("profile").upsert({ id: "default", ...supabasePayload });
        if (error) {
          console.warn("First upsert attempt failed, retrying without heroBgUrl:", error.message);
          const { heroBgUrl: _, ...retryPayload } = supabasePayload;
          const { error: retryError } = await supabase.from("profile").upsert({ id: "default", ...retryPayload });
          if (retryError) {
            console.error("Supabase profile update failed:", retryError.message, "| Details:", retryError.details, "| Hint:", retryError.hint);
          }
        }
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
    saveTags(defaultTags);
    
    if (supabase) {
      try {
        const { miniAvatarUrl, welcomeMessage, avatarUrl, resumeUrl, handle, status, contactText, heroBgUrl, ...pToSave } = defaultProfile;
        const payload = {
          ...pToSave,
          avatarurl: avatarUrl,
          resumeurl: resumeUrl,
          miniAvatarUrl: miniAvatarUrl,
          handle: handle,
          status: status,
          contactText: contactText,
          heroBgUrl: heroBgUrl
        };
        const { error } = await supabase.from("profile").upsert({ id: "default", ...payload });
        if (error) {
          console.warn("Reset profile failed, retrying without heroBgUrl:", error.message);
          const { heroBgUrl: _, ...retryPayload } = payload;
          await supabase.from("profile").upsert({ id: "default", ...retryPayload });
        }
        await supabase.from("projects").delete().neq("id", "none");
        await supabase.from("experiences").delete().neq("id", "none");
        await supabase.from("skills").delete().neq("id", "none");
        await supabase.from("messages").delete().neq("id", "none");
        await supabase.from("terminal_config").upsert({ id: "default", ...defaultTerminalConfig });
        await supabase.from("terminal_commands").delete().neq("id", "none");
        for (const cmd of defaultTerminalCommands) {
          await supabase.from("terminal_commands").upsert(cmd);
        }
        await supabase.from("tags").delete().neq("id", "none");
        for (const name of defaultTags) {
          await supabase.from("tags").upsert({ id: `tag-${name.toLowerCase().replace(/\s+/g, '-')}`, name });
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
        const { miniAvatarUrl, welcomeMessage, avatarUrl, resumeUrl, handle, status, contactText, heroBgUrl, ...profileToSave } = parsed;
        const supabasePayload = { 
          ...profileToSave, 
          avatarurl: avatarUrl, 
          resumeurl: resumeUrl,
          miniAvatarUrl: miniAvatarUrl,
          handle: handle,
          status: status,
          contactText: contactText,
          heroBgUrl: heroBgUrl,
        };
        const { error } = await supabase.from("profile").upsert({ id: "default", ...supabasePayload });
        if (error) {
          console.warn("Migration profile failed, retrying without heroBgUrl:", error.message);
          const { heroBgUrl: _, ...retryPayload } = supabasePayload;
          const { error: retryError } = await supabase.from("profile").upsert({ id: "default", ...retryPayload });
          if (retryError) throw new Error("Gagal migrasi profil: " + retryError.message);
        }
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

      const savedTags = localStorage.getItem("cms-tags");
      if (savedTags) {
        const parsed = JSON.parse(savedTags);
        setTags(parsed);
        await supabase.from("tags").delete().neq("id", "none");
        for (const name of parsed) {
          const { error } = await supabase.from("tags").upsert({ id: `tag-${name.toLowerCase().replace(/\s+/g, '-')}`, name });
          if (error) throw new Error("Gagal migrasi tag: " + error.message);
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
        tags,
        updateProfile,
        updateAdminPassword,
        togglePortfolioStatus,
        addTag,
        deleteTag,
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
