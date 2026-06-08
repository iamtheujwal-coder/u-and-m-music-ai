-- ============================================================
-- UANM Music AI — Schema V2 Migration (Additive)
-- Run AFTER schema.sql. Does NOT drop any existing tables.
-- ============================================================

-- ============================================================
-- Enhance: Voice Models — add analysis columns
-- ============================================================
ALTER TABLE public.voice_models
  ADD COLUMN IF NOT EXISTS training_level TEXT DEFAULT 'starter' CHECK (training_level IN ('starter', 'pro', 'studio_level')),
  ADD COLUMN IF NOT EXISTS similarity_score REAL,
  ADD COLUMN IF NOT EXISTS quality_score REAL,
  ADD COLUMN IF NOT EXISTS confidence_score REAL,
  ADD COLUMN IF NOT EXISTS vocal_range TEXT,
  ADD COLUMN IF NOT EXISTS timbre TEXT,
  ADD COLUMN IF NOT EXISTS vibrato_strength REAL,
  ADD COLUMN IF NOT EXISTS vocal_strength REAL,
  ADD COLUMN IF NOT EXISTS emotional_style TEXT,
  ADD COLUMN IF NOT EXISTS language_adaptability TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS singing_consistency REAL;

-- ============================================================
-- Compositions (Composer Module)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.compositions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Composition',
  input_mode TEXT NOT NULL CHECK (input_mode IN ('lyrics', 'humming', 'voice_note', 'text_prompt')),
  input_text TEXT,
  input_audio_url TEXT,
  genre TEXT DEFAULT '',
  bpm INTEGER DEFAULT 120,
  key_signature TEXT DEFAULT 'C Major',
  structure TEXT DEFAULT 'Verse-Chorus-Verse-Chorus-Bridge-Chorus',
  output_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'uploading', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.compositions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own compositions" ON public.compositions FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_compositions_user_id ON public.compositions(user_id);

-- ============================================================
-- Cover Projects (Cover Studio Module)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cover_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Cover',
  vocal_url TEXT,
  reference_url TEXT,
  detected_key TEXT,
  detected_bpm INTEGER,
  output_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'uploading', 'processing', 'completed', 'failed')),
  processing_stages JSONB DEFAULT '{"timing_alignment":"pending","key_detection":"pending","vocal_processing":"pending","mixing":"pending","mastering":"pending"}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cover_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own covers" ON public.cover_projects FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_cover_projects_user_id ON public.cover_projects(user_id);

-- ============================================================
-- Dream Songs (Dream Song Engine Module)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.dream_songs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  voice_analysis JSONB DEFAULT '{}',
  ai_choices JSONB DEFAULT '{}',
  output_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'uploading', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.dream_songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own dream songs" ON public.dream_songs FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_dream_songs_user_id ON public.dream_songs(user_id);

-- ============================================================
-- Artist Profiles (Collaboration Module)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.artist_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  genres TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  looking_for TEXT[] DEFAULT '{}',
  sample_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable" ON public.artist_profiles FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can manage own artist profile" ON public.artist_profiles FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_user_id ON public.artist_profiles(user_id);

-- ============================================================
-- Collaborations (Collaboration Module)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.collaborations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own collabs" ON public.collaborations FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Users can create collabs" ON public.collaborations FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Users can update own collabs" ON public.collaborations FOR UPDATE USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_from ON public.collaborations(from_user_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_to ON public.collaborations(to_user_id);

-- ============================================================
-- Career Stats (Career OS Module) — Materialized view concept
-- ============================================================
CREATE TABLE IF NOT EXISTS public.career_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_streams INTEGER DEFAULT 0,
  monthly_growth REAL DEFAULT 0,
  followers INTEGER DEFAULT 0,
  engagement_rate REAL DEFAULT 0,
  top_song TEXT DEFAULT '',
  best_release_day TEXT DEFAULT 'Friday',
  best_genre TEXT DEFAULT '',
  content_suggestions TEXT[] DEFAULT '{}',
  weekly_data JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.career_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own career stats" ON public.career_stats FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_career_stats_user_id ON public.career_stats(user_id);
