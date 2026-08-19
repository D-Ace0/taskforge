"use client";

import AppHeader from "@/components/app-shell/app-header";
import AppSidebar from "@/components/app-shell/app-sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isInitializing, authenticationError, retryAuthentication } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !user && !authenticationError) {
      router.replace("/login");
    }
  }, [isInitializing, user, authenticationError, router]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Restoring your session...
          </p>
        </div>
      </div>
    );
  }

  if (authenticationError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <section className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-7 text-center shadow-lg">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">!</div>
          <h1 className="mt-4 text-xl font-bold text-slate-950">Unable to restore your session</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{authenticationError}</p>
          <button type="button" onClick={retryAuthentication} className="mt-6 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
            Try again
          </button>
        </section>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <AppSidebar />

      <div className="min-w-0">
        <AppHeader />

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
