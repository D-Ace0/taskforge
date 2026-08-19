"use client";

import { ErrorBlock, LoadingBlock } from "@/components/ui/feedback";
import { useAuth } from "@/contexts/auth-context";
import { getWorkspaceProjects } from "@/lib/api/projects";
import { getMyWorkspaces } from "@/lib/api/workspaces";
import type { MyWorkspacesResponse } from "@/types/workspace";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const { user, accessToken } = useAuth();
  const [memberships, setMemberships] = useState<MyWorkspacesResponse>([]);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const token = accessToken;
    if (!token) return;
    const controller = new AbortController();
    setLoading(true); setError(null);
    async function load() {
      try {
        const workspaceData = await getMyWorkspaces(token as string, controller.signal);
        setMemberships(workspaceData);
        const responses = await Promise.all(workspaceData.map((item) => getWorkspaceProjects(token as string, item.workspace.id, { status: "active", page: 1, limit: 1 }, controller.signal)));
        setProjectCount(responses.reduce((total, value) => total + value.pagination.totalProjects, 0));
      } catch (value) {
        if (!controller.signal.aborted) setError(value instanceof Error ? value.message : "Unable to load dashboard");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [accessToken, reload]);

  const ownerCount = useMemo(() => memberships.filter((item) => item.role === "OWNER").length, [memberships]);
  if (loading) return <LoadingBlock label="Preparing your dashboard..." />;
  if (error) return <ErrorBlock message={error} onRetry={() => setReload((v) => v + 1)} />;

  const cards = [
    { label: "Workspaces", value: memberships.length, description: "Teams you belong to", accent: "bg-indigo-500" },
    { label: "Active projects", value: projectCount, description: "Across your workspaces", accent: "bg-violet-500" },
    { label: "Workspace owner", value: ownerCount, description: "Teams you lead", accent: "bg-emerald-500" },
  ];

  return <section><header><p className="text-sm font-semibold text-indigo-600">Overview</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Welcome back, {user?.name}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Here&apos;s a live overview of your TaskForge teams and current delivery work.</p></header><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <article key={card.label} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><span className={`absolute inset-x-0 top-0 h-1 ${card.accent}`} /><p className="text-sm font-medium text-slate-500">{card.label}</p><p className="mt-3 text-3xl font-bold text-slate-950">{card.value}</p><p className="mt-2 text-sm text-slate-600">{card.description}</p></article>)}</div><section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold text-slate-950">Recent workspaces</h2><p className="mt-1 text-sm text-slate-500">Jump back into your latest teams.</p></div><Link href="/workspaces" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">View all</Link></div><div className="mt-5 grid gap-3">{memberships.slice(0, 4).map(({ workspace, role }) => <Link key={workspace.id} href={`/workspaces/${workspace.id}`} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30"><div><p className="font-semibold text-slate-900">{workspace.name}</p><p className="mt-1 text-sm text-slate-500">{workspace.description || "No description"}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{role}</span></Link>)}{memberships.length === 0 && <p className="py-8 text-center text-sm text-slate-500">Create your first workspace to begin.</p>}</div></section></section>;
}
