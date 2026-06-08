// ============================================================
// UANM Music AI — Demo Store (Works without Supabase)
// In-memory + localStorage project/voice model store
// ============================================================

export interface DemoProject {
  id: string;
  user_id: string;
  title: string;
  mode: string;
  genre: string;
  mood: string;
  mastering_style: string;
  vocal_file_url: string | null;
  instrumental_file_url: string | null;
  output_file_url: string | null;
  status: "draft" | "uploading" | "processing" | "completed" | "failed";
  created_at: string;
  prompt?: string;
  lyrics?: string;
  language?: string;
  bpm?: number;
  key?: string;
  duration?: number;
  customization?: Record<string, unknown>;
  // Audio blob URLs (for demo-generated audio)
  audio_blobs?: Record<string, string>;
}

export interface DemoVoiceModel {
  id: string;
  user_id: string;
  name: string;
  status: "pending" | "training" | "ready" | "failed";
  sample_count: number;
  training_level: string;
  similarity_score: number | null;
  quality_score: number | null;
  vocal_range: string | null;
  timbre: string | null;
  created_at: string;
}

const STORAGE_KEY = "uanm_demo_projects";
const VOICE_STORAGE_KEY = "uanm_demo_voice_models";
const DEMO_USER_ID = "demo-user-001";

function generateId(): string {
  return `demo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadProjects(): DemoProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: DemoProject[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // storage full — silently fail
  }
}

function loadVoiceModels(): DemoVoiceModel[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VOICE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveVoiceModels(models: DemoVoiceModel[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VOICE_STORAGE_KEY, JSON.stringify(models));
  } catch {}
}

// ============================================================
// Project CRUD
// ============================================================

export function listProjects(): DemoProject[] {
  return loadProjects().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getProject(id: string): DemoProject | null {
  return loadProjects().find((p) => p.id === id) || null;
}

export function createProject(data: Partial<DemoProject>): DemoProject {
  const projects = loadProjects();
  const project: DemoProject = {
    id: generateId(),
    user_id: DEMO_USER_ID,
    title: data.title || "Untitled Project",
    mode: data.mode || "home_studio",
    genre: data.genre || "Pop",
    mood: data.mood || "Happy",
    mastering_style: data.mastering_style || "clean",
    vocal_file_url: data.vocal_file_url || null,
    instrumental_file_url: data.instrumental_file_url || null,
    output_file_url: data.output_file_url || null,
    status: data.status || "processing",
    created_at: new Date().toISOString(),
    prompt: data.prompt || "",
    lyrics: data.lyrics || "",
    language: data.language || "English",
    bpm: data.bpm || 120,
    key: data.key || "C Major",
    duration: data.duration || 20,
    customization: data.customization || {},
    audio_blobs: data.audio_blobs || {},
  };
  projects.unshift(project);
  saveProjects(projects);
  return project;
}

export function updateProject(id: string, updates: Partial<DemoProject>): DemoProject | null {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...updates };
  saveProjects(projects);
  return projects[idx];
}

export function deleteProject(id: string): boolean {
  const projects = loadProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  saveProjects(filtered);
  return true;
}

// ============================================================
// Voice Model CRUD
// ============================================================

export function listVoiceModels(): DemoVoiceModel[] {
  return loadVoiceModels().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getVoiceModel(id: string): DemoVoiceModel | null {
  return loadVoiceModels().find((m) => m.id === id) || null;
}

export function createVoiceModel(data: Partial<DemoVoiceModel>): DemoVoiceModel {
  const models = loadVoiceModels();
  const model: DemoVoiceModel = {
    id: generateId(),
    user_id: DEMO_USER_ID,
    name: data.name || "My Voice Model",
    status: "pending",
    sample_count: data.sample_count || 0,
    training_level: data.training_level || "starter",
    similarity_score: null,
    quality_score: null,
    vocal_range: null,
    timbre: null,
    created_at: new Date().toISOString(),
  };
  models.unshift(model);
  saveVoiceModels(models);
  return model;
}

export function updateVoiceModel(id: string, updates: Partial<DemoVoiceModel>): DemoVoiceModel | null {
  const models = loadVoiceModels();
  const idx = models.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  models[idx] = { ...models[idx], ...updates };
  saveVoiceModels(models);
  return models[idx];
}

// ============================================================
// Utility: Check if we're in demo mode
// ============================================================
export function isDemoMode(): boolean {
  if (typeof window !== "undefined") {
    // Client-side: check if supabase URL is configured
    return !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "";
  }
  // Server-side
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "";
}

export function getDemoUserId(): string {
  return DEMO_USER_ID;
}
