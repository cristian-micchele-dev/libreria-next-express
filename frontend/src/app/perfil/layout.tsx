"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Heart, Package } from "lucide-react";

const tabs = [
  { href: "/perfil", label: "Mi cuenta", icon: User },
  { href: "/perfil/favoritos", label: "Favoritos", icon: Heart },
  { href: "/perfil/pedidos", label: "Mis pedidos", icon: Package },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1
        className="text-3xl sm:text-4xl font-bold tracking-tight editorial-rule mb-10"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Mi perfil
      </h1>

      <div className="flex gap-2 mb-10 border-b border-border/40 overflow-x-auto no-scrollbar">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
