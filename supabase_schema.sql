-- Skrip Inisialisasi Database Portofolio Gibran di Supabase
-- Tempelkan seluruh isi file ini di SQL Editor Supabase Anda dan klik RUN.

-- 1. TABEL PROFIL
CREATE TABLE IF NOT EXISTS profile (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT,
  title TEXT,
  bio TEXT,
  github TEXT,
  linkedin TEXT,
  instagram TEXT,
  email TEXT,
  resumeUrl TEXT,
  avatarUrl TEXT
);

-- Kebijakan RLS Profil (Buka Akses)
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buka akses baca profil untuk publik" ON profile FOR SELECT USING (true);
CREATE POLICY "Buka akses tulis profil untuk publik" ON profile FOR ALL USING (true) WITH CHECK (true);

-- Isi profil awal jika belum ada
INSERT INTO profile (id, name, title, bio, github, linkedin, instagram, email, resumeUrl, avatarUrl)
VALUES (
  'default',
  'GIBRAN',
  'Creative Frontend Developer & UI/UX Designer',
  'Saya adalah seorang developer yang mendedikasikan diri untuk menciptakan pengalaman digital yang minimalis, modern, dan interaktif. Berfokus pada detail estetika, tipografi yang kuat, serta performa web yang optimal.',
  'https://github.com',
  'https://linkedin.com',
  'https://instagram.com',
  'gibran@example.com',
  '#',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'
) ON CONFLICT (id) DO NOTHING;


-- 2. TABEL PROYEK
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  details TEXT,
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  demoUrl TEXT DEFAULT '#',
  githubUrl TEXT DEFAULT '#',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Kebijakan RLS Proyek (Buka Akses)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buka akses baca proyek untuk publik" ON projects FOR SELECT USING (true);
CREATE POLICY "Buka akses modifikasi proyek untuk publik" ON projects FOR ALL USING (true) WITH CHECK (true);


-- 3. TABEL PENGALAMAN
CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Kebijakan RLS Pengalaman (Buka Akses)
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buka akses baca pengalaman untuk publik" ON experiences FOR SELECT USING (true);
CREATE POLICY "Buka akses modifikasi pengalaman untuk publik" ON experiences FOR ALL USING (true) WITH CHECK (true);


-- 4. TABEL KEAHLIAN
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER DEFAULT 80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Kebijakan RLS Keahlian (Buka Akses)
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buka akses baca keahlian untuk publik" ON skills FOR SELECT USING (true);
CREATE POLICY "Buka akses modifikasi keahlian untuk publik" ON skills FOR ALL USING (true) WITH CHECK (true);


-- 5. TABEL PESAN MASUK
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  date TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Kebijakan RLS Pesan Masuk (Buka Akses)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buka akses baca pesan untuk publik" ON messages FOR SELECT USING (true);
CREATE POLICY "Buka akses modifikasi pesan untuk publik" ON messages FOR ALL USING (true) WITH CHECK (true);


-- 6. TABEL KONFIGURASI TERMINAL
CREATE TABLE IF NOT EXISTS terminal_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  welcomeMessage TEXT,
  promptUser TEXT,
  promptHost TEXT
);

-- Kebijakan RLS Konfigurasi Terminal (Buka Akses)
ALTER TABLE terminal_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buka akses baca terminal config untuk publik" ON terminal_config FOR SELECT USING (true);
CREATE POLICY "Buka akses modifikasi terminal config untuk publik" ON terminal_config FOR ALL USING (true) WITH CHECK (true);

-- Isi konfigurasi awal terminal jika belum ada
INSERT INTO terminal_config (id, welcomeMessage, promptUser, promptHost)
VALUES (
  'default',
  '==================================================\nPORTFOLIO INTERACTIVE SHELL v1.0.0\nKetik ''help'' untuk melihat daftar perintah.\n==================================================',
  'guest',
  'gibran'
) ON CONFLICT (id) DO NOTHING;


-- 7. TABEL PERINTAH TERMINAL
CREATE TABLE IF NOT EXISTS terminal_commands (
  id TEXT PRIMARY KEY,
  command TEXT NOT NULL UNIQUE,
  description TEXT,
  output TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Kebijakan RLS Perintah Terminal (Buka Akses)
ALTER TABLE terminal_commands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buka akses baca terminal command untuk publik" ON terminal_commands FOR SELECT USING (true);
CREATE POLICY "Buka akses modifikasi terminal command untuk publik" ON terminal_commands FOR ALL USING (true) WITH CHECK (true);

-- Isi perintah awal jika belum ada
INSERT INTO terminal_commands (id, command, description, output) VALUES
('tc-1', 'about', 'Menampilkan bio singkat dari saya', 'Saya adalah seorang developer yang mendedikasikan diri untuk menciptakan pengalaman digital yang minimalis, modern, dan interaktif. Berfokus pada detail estetika, tipografi yang kuat, serta performa web yang optimal.'),
('tc-2', 'skills', 'Menampilkan ringkasan keahlian', 'Keahlian Utama:\n- Frontend: React, Next.js, TypeScript, Tailwind CSS\n- UI/UX: Figma, Wireframing, Prototyping'),
('tc-3', 'contact', 'Menampilkan informasi kontak saya', 'Hubungi saya melalui:\n- Email: gibran@example.com\n- Dashboard Admin: Tab Inbox Kontak\n- Instagram: @gibran')
ON CONFLICT (id) DO NOTHING;

-- PERBARUAN: Menambahkan kolom miniAvatarUrl untuk foto kecil di Profile Card
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "miniAvatarUrl" TEXT;
