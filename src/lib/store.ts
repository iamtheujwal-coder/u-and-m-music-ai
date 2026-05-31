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
