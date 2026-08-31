import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const returnTo = searchParams.get("returnTo") || "/";
  const error = searchParams.get("error");

  if (error) {
    const loginUrl = new URL("/auth/login", origin);
    loginUrl.searchParams.set("error", "oauth");
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      const loginUrl = new URL("/auth/login", origin);
      loginUrl.searchParams.set("error", "oauth");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.redirect(new URL(returnTo, origin));
}
