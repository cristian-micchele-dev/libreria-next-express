"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg group">
      <div
        className={`
          flex items-center gap-3 rounded-full border px-4 py-2.5
          transition-all duration-300
          ${focused
            ? "border-primary/40 bg-card shadow-md shadow-primary/5 ring-2 ring-primary/10"
            : "border-border/60 bg-secondary/50 hover:border-border"
          }
        `}
      >
        <Search className={`h-4 w-4 shrink-0 transition-colors ${focused ? "text-primary" : "text-muted-foreground"}`} />
        <input
          type="search"
          placeholder="Buscar titulo, autor, genero..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
        {query.length > 0 && (
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border/60 bg-background px-1.5 text-[10px] text-muted-foreground">
            Enter
          </kbd>
        )}
      </div>
    </form>
  );
}
