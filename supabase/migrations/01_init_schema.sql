-- 1. Create Custom Types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE user_plan AS ENUM ('free', 'creator', 'pro', 'premier');
CREATE TYPE project_status AS ENUM ('draft', 'processing', 'completed', 'failed');
CREATE TYPE voice_model_status AS ENUM ('uploading', 'cleaning', 'validating', 'training', 'testing', 'ready', 'failed');
CREATE TYPE job_type AS ENUM ('lyrics_to_song', 'raw_vocal_to_song', 'voice_training', 'mix_master', 'stem_separation', 'extend');

-- 2. Create Users Extension Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  plan user_plan DEFAULT 'free',
  credits INTEGER DEFAULT 50,
  commercial_rights BOOLEAN DEFAULT false,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Voice Models Table
CREATE TABLE IF NOT EXISTS public.voice_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  training_level TEXT DEFAULT 'starter',
  consent_confirmed BOOLEAN DEFAULT false,
  verification_phrase_url TEXT,
  sample_urls TEXT[],
  dataset_minutes FLOAT DEFAULT 0.0,
  dataset_quality_score INTEGER DEFAULT 0,
  similarity_score INTEGER DEFAULT 0,
  stability_score INTEGER DEFAULT 0,
  status voice_model_status DEFAULT 'uploading',
  progress INTEGER DEFAULT 0,
  estimated_training_time INTEGER,
  model_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Untitled',
  mode TEXT NOT NULL,
  prompt TEXT,
  lyrics TEXT,
  genre TEXT,
  mood TEXT,
  language TEXT DEFAULT 'English',
  bpm INTEGER,
  key_signature TEXT,
  duration INTEGER,
  selected_voice_model_id UUID REFERENCES public.voice_models(id) ON DELETE SET NULL,
  raw_vocal_url TEXT,
  reference_audio_url TEXT,
  status project_status DEFAULT 'draft',
  progress INTEGER DEFAULT 0,
  current_step TEXT,
  customization JSONB DEFAULT '{}'::jsonb,
  audio_analysis JSONB DEFAULT '{}'::jsonb,
  quality_score INTEGER DEFAULT 0,
  release_quality_score INTEGER DEFAULT 0,
  producer_notes TEXT,
  output_mp3_url TEXT,
  output_wav_url TEXT,
  output_flac_url TEXT,
  instrumental_url TEXT,
  acapella_url TEXT,
  stems_zip_url TEXT,
  lyrics_txt_url TEXT,
  project_zip_url TEXT,
  versions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Processing Jobs Table
CREATE TABLE IF NOT EXISTS public.processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  job_type job_type NOT NULL,
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  current_step TEXT,
  logs JSONB DEFAULT '[]'::jsonb,
  failed_reason TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create Credit Transactions Table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create Download Logs Table
CREATE TABLE IF NOT EXISTS public.download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to read and update their own profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Allow users to manage their own projects
CREATE POLICY "Users can select own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Allow users to manage their own voice models
CREATE POLICY "Users can manage own voice models" ON public.voice_models FOR ALL USING (auth.uid() = user_id);

-- Allow users to read their own jobs and transactions
CREATE POLICY "Users can read own jobs" ON public.processing_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own downloads" ON public.download_logs FOR SELECT USING (auth.uid() = user_id);
