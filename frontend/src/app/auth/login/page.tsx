import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { BookMarked } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookMarked className="h-7 w-7" />
          </div>
        </div>
        <div className="paper-texture rounded-xl border border-border/40 p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
