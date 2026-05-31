-- ============================================================
-- U&M Music AI — Database Schema (Supabase/PostgreSQL)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Profiles (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  artist_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'creator', 'pro_artist', 'studio')),
  credits INTEGER DEFAULT 2,
  music_style TEXT[] DEFAULT '{}',
  singing_language TEXT DEFAULT 'Hindi',
  skill_level TEXT DEFAULT 'beginner',
  main_goal TEXT DEFAULT 'covers',
  onboarding_completed BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Projects
-- ============================================================
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Project',
  mode TEXT NOT NULL CHECK (mode IN ('home_studio', 'cover', 'original', 'ai_generate', 'mix_master')),
  genre TEXT DEFAULT '',
  mood TEXT DEFAULT '',
  mastering_style TEXT DEFAULT 'clean',
  vocal_file_url TEXT,
  instrumental_file_url TEXT,
  output_file_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'uploading', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
  ON public.projects FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- Processing Jobs
-- ============================================================
CREATE TABLE public.processing_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL DEFAULT 'full_pipeline',
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  logs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own jobs"
  ON public.processing_jobs FOR SELECT
  USING (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  );

-- ============================================================
-- Voice Models
-- ============================================================
CREATE TABLE public.voice_models (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Voice',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'training', 'ready', 'failed')),
  consent_confirmed BOOLEAN NOT NULL DEFAULT false,
  sample_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.voice_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own voice models"
  ON public.voice_models FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- Payments
-- ============================================================
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL,
  amount INTEGER NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- Support Tickets
-- ============================================================
CREATE TABLE public.support_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('payment', 'audio_processing', 'output_quality', 'copyright', 'account')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tickets"
  ON public.support_tickets FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_processing_jobs_project_id ON public.processing_jobs(project_id);
CREATE INDEX idx_processing_jobs_status ON public.processing_jobs(status);
CREATE INDEX idx_voice_models_user_id ON public.voice_models(user_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
