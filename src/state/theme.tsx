import create from "zustand";

import { THEME_MODE } from "../constants";

export type Mode = "light" | "dark";

export interface ThemeModeState {
  mode: Mode;
  toggleMode: () => void;
}

const useThemeModeStore = create<ThemeModeState>((set, get) => ({
  mode: window.localStorage.getItem(THEME_MODE)
    ? (window.localStorage.getItem(THEME_MODE) as Mode)
    : window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
  toggleMode: () => {
    const newMode = get().mode === "light" ? "dark" : "light";
    window.localStorage.setItem(THEME_MODE, newMode);
    set({ mode: newMode });
  },
}));

export default useThemeModeStore;
