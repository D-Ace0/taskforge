"use client";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function AuthAwareActions({ variant }: { variant: "header" | "hero" | "cta" }) {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return <span aria-label="Checking session" className={variant === "header" ? "h-10 w-28 animate-pulse rounded-lg bg-slate-100" : "h-12 w-40 animate-pulse rounded-xl bg-slate-200/70"} />;
  }

  if (user) {
    const classes = variant === "cta" ? "inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:shadow-xl" : variant === "hero" ? "inline-flex rounded-xl bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-indigo-700" : "rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700";
    return <Link href="/dashboard" className={classes}>{variant === "cta" ? "Return to your dashboard" : "Open dashboard"}</Link>;
  }

  if (variant === "header") {
    return <div className="flex items-center gap-2"><Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Sign in</Link><Link href="/register" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">Get started</Link></div>;
  }

  if (variant === "hero") {
    return <div className="flex flex-col gap-3 sm:flex-row"><Link href="/register" className="rounded-xl bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-indigo-700">Start building for free</Link><Link href="/login" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700">Open your workspace</Link></div>;
  }

  return <Link href="/register" className="inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:shadow-xl">Create your TaskForge account</Link>;
}
