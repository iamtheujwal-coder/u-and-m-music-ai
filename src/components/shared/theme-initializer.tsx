"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store";

export function ThemeInitializer() {
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    const stored = localStorage.getItem("uanm-theme") as "light" | "dark" | null;
    const theme = stored || "dark";
    setTheme(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [setTheme]);

  // Sync to localStorage
  useEffect(() => {
    const unsub = useThemeStore.subscribe((state) => {
      localStorage.setItem("uanm-theme", state.theme);
    });
    return unsub;
  }, []);

  return null;
}
