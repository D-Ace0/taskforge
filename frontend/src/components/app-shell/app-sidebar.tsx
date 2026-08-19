"use client";

import TaskForgeLogo from "@/components/brand/taskforge-logo";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  isNavigationItemActive,
  navigation,
} from "./navigation";


export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const initial = user?.name.charAt(0).toUpperCase() ?? "?";

  return (
    <aside className="sticky top-0 hidden h-screen border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <Link
        href="/dashboard"
        className="flex h-16 items-center gap-3 border-b border-slate-200 px-6"
      >
        <TaskForgeLogo />

        <span className="text-lg font-bold tracking-tight text-slate-950">
          TaskForge
        </span>
      </Link>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <nav className="mt-3 grid gap-1" aria-label="Primary navigation">
          {navigation.map((item) => {
            const isActive = isNavigationItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className={[
                    "flex size-7 items-center justify-center rounded-md text-base",
                    isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
            {initial}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.name}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}