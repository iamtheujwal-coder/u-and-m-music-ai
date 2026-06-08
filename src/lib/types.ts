// ============================================================
// UANM Music AI — Type Definitions (Complete Platform)
// ============================================================

// ---- Enums & Unions ----
export type Plan = "free" | "creator" | "pro_artist" | "studio" | "enterprise";
export type ProjectMode = "home_studio" | "cover" | "original" | "ai_generate" | "mix_master";
export type ProjectStatus = "draft" | "uploading" | "processing" | "completed" | "failed";
export type JobStatus = "queued" | "processing" | "completed" | "failed";
export type TicketCategory = "payment" | "audio_processing" | "output_quality" | "copyright" | "account";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type MasteringStyle = "warm" | "clean" | "bollywood_pop" | "indie_acoustic" | "lofi" | "commercial_loud" | "natural_vocal";
export type ExportFormat = "mp3" | "wav" | "flac";
export type PlatformPreset = "spotify" | "youtube" | "instagram" | "apple_music" | "radio" | "bollywood" | "indie" | "lofi" | "acoustic";
export type ComposerInputMode = "lyrics" | "humming" | "voice_note" | "text_prompt";
export type CollabStatus = "pending" | "accepted" | "declined" | "completed";
export type VoiceTrainingLevel = "starter" | "pro" | "studio_level";

// ---- User Profile ----
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  artist_name: string;
  avatar_url: string | null;
  plan: Plan;
  credits: number;
  music_style: string[];
  singing_language: string;
  skill_level: string;
  main_goal: string;
  onboarding_completed: boolean;
  role: "user" | "admin";
  created_at: string;
}

// ---- Project ----
export interface Project {
  id: string;
  user_id: string;
  title: string;
  mode: ProjectMode;
  genre: string;
  mood: string;
  mastering_style: MasteringStyle;
  vocal_file_url: string | null;
  instrumental_file_url: string | null;
  output_file_url: string | null;
  status: ProjectStatus;
  created_at: string;
}

// ---- Processing Job ----
export interface ProcessingJob {
  id: string;
  project_id: string;
  type: string;
  status: JobStatus;
  progress: number;
  logs: { stage: string; message: string; timestamp: string }[];
  created_at: string;
}

// ---- Voice Model (Enhanced) ----
export interface VoiceModel {
  id: string;
  user_id: string;
  name: string;
  status: "pending" | "training" | "ready" | "failed";
  consent_confirmed: boolean;
  sample_count: number;
  training_level: VoiceTrainingLevel;
  similarity_score: number | null;
  quality_score: number | null;
  confidence_score: number | null;
  vocal_range: string | null;
  timbre: string | null;
  vibrato_strength: number | null;
  vocal_strength: number | null;
  emotional_style: string | null;
  language_adaptability: string[];
  singing_consistency: number | null;
  created_at: string;
}

// ---- Payment ----
export interface Payment {
  id: string;
  user_id: string;
  plan: Plan;
  amount: number;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  status: "pending" | "completed" | "failed" | "refunded";
  created_at: string;
}

// ---- Support Ticket ----
export interface SupportTicket {
  id: string;
  user_id: string;
  category: TicketCategory;
  subject: string;
  message: string;
  status: TicketStatus;
  created_at: string;
}

// ---- Vocal Analysis (Enhanced) ----
export interface VocalAnalysis {
  pitch_accuracy: number;
  breath_control: number;
  vocal_stability: number;
  emotion_score: number;
  timing: number;
  clarity: number;
  energy: number;
  room_noise_level: number;
  tips: string[];
  feedback: string;
  overall: number;
}

// ---- Release Kit ----
export interface ReleaseKit {
  title_ideas: string[];
  cover_art_prompt: string;
  instagram_caption: string;
  youtube_description: string;
  hashtags: string[];
  checklist: { item: string; done: boolean }[];
  metadata: {
    artist_name: string;
    genre: string;
    language: string;
    mood: string;
    bpm: number;
  };
}

// ---- Processing Stage ----
export interface ProcessingStage {
  id: string;
  label: string;
  description: string;
  status: "pending" | "active" | "completed";
  progress: number;
}

// ============================================================
// NEW MODULE TYPES
// ============================================================

// ---- Studio Session ----
export interface StudioEffect {
  id: string;
  name: string;
  enabled: boolean;
  params: Record<string, number>;
}

export interface StudioSession {
  id: string;
  project_id: string;
  effects: StudioEffect[];
  export_format: ExportFormat;
  platform_preset: PlatformPreset | null;
  created_at: string;
}

// ---- Composer (Module 3) ----
export interface Composition {
  id: string;
  user_id: string;
  title: string;
  input_mode: ComposerInputMode;
  input_text: string | null;
  input_audio_url: string | null;
  genre: string;
  bpm: number;
  key_signature: string;
  structure: string;
  output_url: string | null;
  status: ProjectStatus;
  created_at: string;
}

// ---- Cover Studio (Module 4) ----
export interface CoverProject {
  id: string;
  user_id: string;
  title: string;
  vocal_url: string;
  reference_url: string;
  detected_key: string | null;
  detected_bpm: number | null;
  output_url: string | null;
  status: ProjectStatus;
  processing_stages: {
    timing_alignment: "pending" | "done";
    key_detection: "pending" | "done";
    vocal_processing: "pending" | "done";
    mixing: "pending" | "done";
    mastering: "pending" | "done";
  };
  created_at: string;
}

// ---- AI Producer (Module 5) ----
export interface ProducerFeedback {
  song_title: string;
  genre_fit: { genre: string; confidence: number }[];
  key_recommendation: string;
  bpm_detected: number;
  arrangement_suggestions: string[];
  commercial_potential: number;
  overall_feedback: string;
  strengths: string[];
  improvements: string[];
}

// ---- Dream Song Engine (Module 7) ----
export interface DreamSong {
  id: string;
  user_id: string;
  voice_analysis: {
    vocal_range: string;
    timbre: string;
    strength: string;
    emotion: string;
  };
  ai_choices: {
    genre: string;
    scale: string;
    tempo: number;
    mood: string;
    arrangement: string;
  };
  output_url: string | null;
  status: ProjectStatus;
  created_at: string;
}

// ---- Career OS (Module 9) ----
export interface CareerStats {
  total_streams: number;
  monthly_growth: number;
  followers: number;
  engagement_rate: number;
  top_song: string;
  best_release_day: string;
  best_genre: string;
  content_suggestions: string[];
  weekly_data: { week: string; streams: number; followers: number }[];
}

// ---- Collaboration (Module 10) ----
export interface ArtistProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  genres: string[];
  skills: string[];
  looking_for: string[];
  sample_url: string | null;
  is_public: boolean;
  created_at: string;
}

export interface Collaboration {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  status: CollabStatus;
  project_id: string | null;
  created_at: string;
}
