"use client";

import LogoutButton from "@/components/auth/logout-button";
import TaskForgeLogo from "@/components/brand/taskforge-logo";
import MobileNavigation from "@/components/app-shell/mobile-navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useState } from "react";

export default function AppHeader() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const initial = user?.name.charAt(0).toUpperCase() ?? "?";

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          {/* menu button */}
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen(true)}
            className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 transition hover:bg-slate-50 hover:text-slate-950 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>

          <Link href="/dashboard" className="lg:hidden">
            <TaskForgeLogo />
          </Link>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              TaskForge workspace
            </p>

            <p className="hidden text-xs text-slate-500 sm:block">
              Plan, collaborate, and keep work moving.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {initial}
            </div>

            <span className="max-w-32 truncate text-sm font-medium text-slate-700">
              {user?.name}
            </span>
          </div>

          <div className="hidden lg:block">
            <LogoutButton />
          </div>
        </div>
      </header>

      <MobileNavigation
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}