"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
    }
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);

    document.documentElement.classList.add("transitioning");
    document.documentElement.classList.toggle("dark", next === "dark");
    setTimeout(() => {
      document.documentElement.classList.remove("transitioning");
    }, 400);
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 relative overflow-hidden"
      onClick={toggle}
      title={theme === "light" ? "Modo oscuro" : "Modo claro"}
    >
      <Sun
        className="h-4 w-4 absolute transition-all duration-500"
        style={{
          opacity: theme === "light" ? 1 : 0,
          transform: theme === "light" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
        }}
      />
      <Moon
        className="h-4 w-4 absolute transition-all duration-500"
        style={{
          opacity: theme === "dark" ? 1 : 0,
          transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0)",
        }}
      />
    </Button>
  );
}
