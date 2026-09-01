import { create } from "zustand";
import type { DockHost } from "./ask-sikao";

export type SectionId =
  | "overview"
  | "density"
  | "families"
  | "entry"
  | "sources"
  | "matrix"
  | "rules"
  | "tokens"
  | "playground"
  | "dock";

export type DockPlace = "float" | "rail" | "ios";
export type ThemeMode = "light" | "dark";

export type DensityId = "short" | "tool" | "teach" | "gate";

interface AppState {
  section: SectionId;
  theme: ThemeMode;
  density: DensityId;
  dockHost: DockHost;
  dockOpen: boolean;
  dockPlace: DockPlace;
  setSection: (section: SectionId) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setDensity: (density: DensityId) => void;
  setDockHost: (host: DockHost) => void;
  setDockOpen: (open: boolean) => void;
  setDockPlace: (place: DockPlace) => void;
}

const THEME_KEY = "sikao-stream-spec-theme";

function readTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
}

export const useAppStore = create<AppState>((set, get) => ({
  section: "overview",
  theme: "light",
  density: "tool",
  dockHost: "overview",
  dockOpen: false,
  dockPlace: "float",
  setSection: (section) => set({ section, dockOpen: section === "dock" ? true : get().dockOpen }),
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, theme);
      document.documentElement.dataset.theme = theme;
    }
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    get().setTheme(next);
  },
  setDensity: (density) => set({ density }),
  setDockHost: (dockHost) => set({ dockHost }),
  setDockOpen: (dockOpen) => set({ dockOpen }),
  setDockPlace: (dockPlace) => set({ dockPlace }),
}));

export function hydrateTheme() {
  const theme = readTheme();
  document.documentElement.dataset.theme = theme;
  useAppStore.setState({ theme });
}
