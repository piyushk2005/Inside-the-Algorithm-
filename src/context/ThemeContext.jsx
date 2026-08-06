import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Mirrors the pattern you're already using in ModeContext — a context +
// a provider + a small hook, so this drops in next to it without
// introducing a new convention.

const ThemeContext = createContext(null);

const STORAGE_KEY = "ita-theme"; // "inside the algorithm"

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  // fall back to the user's OS preference on first visit
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
  return prefersLight ? "light" : "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Reflect the theme onto <html data-theme="..."> so plain CSS variables
  // (no CSS-in-JS, no re-render cost) can switch every color at once.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
