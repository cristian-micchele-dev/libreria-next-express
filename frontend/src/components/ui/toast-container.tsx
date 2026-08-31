"use client";

import { useToastStore } from "@/lib/toast-store";
import { X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-[100] flex flex-col gap-3 sm:max-w-sm sm:w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-slide-in pointer-events-auto flex items-start gap-4 rounded-lg border border-border/60 bg-card/95 backdrop-blur-md p-4 shadow-xl shadow-black/5"
          style={{
            borderLeft: "3px solid var(--primary)",
          }}
        >
          {/* Book thumbnail */}
          {toast.thumbnailUrl && (
            <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-sm book-shadow">
              <Image
                src={toast.thumbnailUrl}
                alt=""
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              {toast.title}
            </p>
            {toast.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {toast.description}
              </p>
            )}
            {toast.href && (
              <Link
                href={toast.href}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2 hover:gap-2 transition-all"
                onClick={() => removeToast(toast.id)}
              >
                {toast.hrefLabel || "Ver"}
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {/* Close */}
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 rounded-full p-1 text-muted-foreground/50 hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
