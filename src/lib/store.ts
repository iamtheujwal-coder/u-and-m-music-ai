import { create } from "zustand";
import type { UserProfile, Project, ProcessingJob } from "./types";

// ============================================================
// Auth Store
// ============================================================
interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ============================================================
// Theme Store
// ============================================================
interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      return { theme: next };
    }),
  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    set({ theme });
  },
}));

// ============================================================
// Projects Store
// ============================================================
interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  currentProject: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (currentProject) => set({ currentProject }),
  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),
}));

// ============================================================
// Processing Store
// ============================================================
interface ProcessingState {
  currentJob: ProcessingJob | null;
  setCurrentJob: (job: ProcessingJob | null) => void;
  updateProgress: (progress: number) => void;
}

export const useProcessingStore = create<ProcessingState>((set) => ({
  currentJob: null,
  setCurrentJob: (currentJob) => set({ currentJob }),
  updateProgress: (progress) =>
    set((state) => ({
      currentJob: state.currentJob
        ? { ...state.currentJob, progress }
        : null,
    })),
}));

// ============================================================
// UI Store
// ============================================================
interface UIState {
  sidebarOpen: boolean;
  splashDone: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSplashDone: (done: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  splashDone: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSplashDone: (splashDone) => set({ splashDone }),
}));

// ============================================================
// Studio Store — Real-time effect parameters
// ============================================================
interface StudioEffectState {
  id: string;
  enabled: boolean;
  params: Record<string, number>;
}

interface StudioState {
  effects: StudioEffectState[];
  exportFormat: "mp3" | "wav" | "flac";
  platformPreset: string | null;
  beforeAfter: "before" | "after";
  setEffects: (effects: StudioEffectState[]) => void;
  toggleEffect: (id: string) => void;
  updateEffectParam: (id: string, param: string, value: number) => void;
  setExportFormat: (format: "mp3" | "wav" | "flac") => void;
  setPlatformPreset: (preset: string | null) => void;
  setBeforeAfter: (mode: "before" | "after") => void;
}

const defaultEffects: StudioEffectState[] = [
  { id: "noise_removal", enabled: true, params: { strength: 70 } },
  { id: "echo_removal", enabled: false, params: { strength: 50 } },
  { id: "breath_cleanup", enabled: false, params: { sensitivity: 60 } },
  { id: "pitch_correction", enabled: true, params: { speed: 50, strength: 40 } },
  { id: "auto_tune", enabled: false, params: { speed: 80, retune: 90 } },
  { id: "vocal_enhancement", enabled: true, params: { presence: 60, brightness: 50 } },
  { id: "vocal_thickening", enabled: false, params: { amount: 40, width: 50 } },
  { id: "harmony_generation", enabled: false, params: { voices: 2, blend: 30 } },
  { id: "double_tracking", enabled: false, params: { delay: 20, variation: 30 } },
  { id: "smart_eq", enabled: true, params: { low: 0, mid: 5, high: 8 } },
  { id: "smart_compression", enabled: true, params: { threshold: -18, ratio: 40 } },
  { id: "ai_mixing", enabled: false, params: { intensity: 60 } },
  { id: "ai_mastering", enabled: true, params: { loudness: 70, warmth: 40 } },
];

export const useStudioStore = create<StudioState>((set) => ({
  effects: defaultEffects,
  exportFormat: "mp3",
  platformPreset: null,
  beforeAfter: "after",
  setEffects: (effects) => set({ effects }),
  toggleEffect: (id) =>
    set((state) => ({
      effects: state.effects.map((e) =>
        e.id === id ? { ...e, enabled: !e.enabled } : e
      ),
    })),
  updateEffectParam: (id, param, value) =>
    set((state) => ({
      effects: state.effects.map((e) =>
        e.id === id
          ? { ...e, params: { ...e.params, [param]: value } }
          : e
      ),
    })),
  setExportFormat: (exportFormat) => set({ exportFormat }),
  setPlatformPreset: (platformPreset) => set({ platformPreset }),
  setBeforeAfter: (beforeAfter) => set({ beforeAfter }),
}));

// ============================================================
// Composer Store — Composition state
// ============================================================
interface ComposerState {
  inputMode: "lyrics" | "humming" | "voice_note" | "text_prompt" | "upload_vocals";
  inputText: string;
  genre: string;
  bpm: number;
  keySignature: string;
  structure: string;
  generating: boolean;
  progress: number;
  setInputMode: (mode: "lyrics" | "humming" | "voice_note" | "text_prompt" | "upload_vocals") => void;
  setInputText: (text: string) => void;
  setGenre: (genre: string) => void;
  setBpm: (bpm: number) => void;
  setKeySignature: (key: string) => void;
  setStructure: (structure: string) => void;
  setGenerating: (generating: boolean) => void;
  setProgress: (progress: number | ((prev: number) => number)) => void;
}

export const useComposerStore = create<ComposerState>((set) => ({
  inputMode: "text_prompt",
  inputText: "",
  genre: "Bollywood Pop",
  bpm: 120,
  keySignature: "C Major",
  structure: "Verse-Chorus-Verse-Chorus-Bridge-Chorus",
  generating: false,
  progress: 0,
  setInputMode: (inputMode) => set({ inputMode }),
  setInputText: (inputText) => set({ inputText }),
  setGenre: (genre) => set({ genre }),
  setBpm: (bpm) => set({ bpm }),
  setKeySignature: (keySignature) => set({ keySignature }),
  setStructure: (structure) => set({ structure }),
  setGenerating: (generating) => set({ generating }),
  setProgress: (progress) =>
    set((state) => ({
      progress: typeof progress === "function" ? progress(state.progress) : progress,
    })),
}));

// ============================================================
// Global Player Store
// ============================================================
export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  progress: 0,
  playTrack: (track) => set({ currentTrack: track, isPlaying: true, progress: 0 }),
  togglePlay: () => set((state) => ({ isPlaying: state.currentTrack ? !state.isPlaying : false })),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
}));
