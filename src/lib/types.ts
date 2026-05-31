// ============================================================
// U&M Music AI — Type Definitions
// ============================================================

export type Plan = "free" | "creator" | "pro_artist" | "studio";
export type ProjectMode = "home_studio" | "cover" | "original" | "ai_generate" | "mix_master";
export type ProjectStatus = "draft" | "uploading" | "processing" | "completed" | "failed";
export type JobStatus = "queued" | "processing" | "completed" | "failed";
export type TicketCategory = "payment" | "audio_processing" | "output_quality" | "copyright" | "account";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type MasteringStyle = "warm" | "clean" | "bollywood_pop" | "indie_acoustic" | "lofi" | "commercial_loud" | "natural_vocal";

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

export interface ProcessingJob {
  id: string;
  project_id: string;
  type: string;
  status: JobStatus;
  progress: number;
  logs: { stage: string; message: string; timestamp: string }[];
  created_at: string;
}

export interface VoiceModel {
  id: string;
  user_id: string;
  name: string;
  status: "pending" | "training" | "ready" | "failed";
  consent_confirmed: boolean;
  sample_count: number;
  created_at: string;
}

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

export interface SupportTicket {
  id: string;
  user_id: string;
  category: TicketCategory;
  subject: string;
  message: string;
  status: TicketStatus;
  created_at: string;
}

export interface VocalAnalysis {
  pitch_accuracy: number;
  breath_control: number;
  vocal_stability: number;
  emotion_score: number;
  timing: number;
  clarity: number;
  room_noise_level: number;
  tips: string[];
  feedback: string;
}

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

export interface ProcessingStage {
  id: string;
  label: string;
  description: string;
  status: "pending" | "active" | "completed";
  progress: number;
}
