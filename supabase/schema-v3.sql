-- ============================================================
-- UANM Music AI — Schema V3 Migration (Additive)
-- Run AFTER schema.sql and schema-v2.sql.
-- ============================================================

-- Alter public.projects with new MVP columns
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS prompt TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS lyrics TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English',
  ADD COLUMN IF NOT EXISTS bpm INTEGER DEFAULT 120,
  ADD COLUMN IF NOT EXISTS key TEXT DEFAULT 'C Major',
  ADD COLUMN IF NOT EXISTS duration REAL DEFAULT 180.0,
  ADD COLUMN IF NOT EXISTS selected_voice_model_id UUID,
  ADD COLUMN IF NOT EXISTS raw_vocal_url TEXT,
  ADD COLUMN IF NOT EXISTS reference_audio_url TEXT,
  ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_step TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS customization JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS quality_score REAL DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS release_quality_score REAL DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS producer_notes JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS output_mp3_url TEXT,
  ADD COLUMN IF NOT EXISTS output_wav_url TEXT,
  ADD COLUMN IF NOT EXISTS output_flac_url TEXT,
  ADD COLUMN IF NOT EXISTS instrumental_url TEXT,
  ADD COLUMN IF NOT EXISTS acapella_url TEXT,
  ADD COLUMN IF NOT EXISTS stems_zip_url TEXT,
  ADD COLUMN IF NOT EXISTS lyrics_txt_url TEXT,
  ADD COLUMN IF NOT EXISTS project_zip_url TEXT,
  ADD COLUMN IF NOT EXISTS versions JSONB DEFAULT '[]'::jsonb;

-- Add foreign key constraint for selected_voice_model_id safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_projects_selected_voice_model'
  ) THEN
    ALTER TABLE public.projects
      ADD CONSTRAINT fk_projects_selected_voice_model
      FOREIGN KEY (selected_voice_model_id) REFERENCES public.voice_models(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Alter public.voice_models with new MVP columns
ALTER TABLE public.voice_models
  ADD COLUMN IF NOT EXISTS verification_phrase_url TEXT,
  ADD COLUMN IF NOT EXISTS sample_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS dataset_minutes REAL DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS estimated_training_time TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS model_url TEXT;

-- Create secure download logs table for downloads logging
CREATE TABLE IF NOT EXISTS public.download_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  file_type TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own download logs" ON public.download_logs FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_user_id ON public.download_logs(user_id);
