"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 animate-fade-in">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Inicio</span>
          </Link>
        </li>

        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
              {isLast || !item.href ? (
                <span className="text-foreground font-medium truncate max-w-48">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors truncate max-w-48"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
