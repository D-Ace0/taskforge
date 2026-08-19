"use client";

import WorkspaceProjectList from "@/components/projects/workspace-project-list";
import { ErrorBlock, LoadingBlock } from "@/components/ui/feedback";
import WorkspaceMembersPanel from "@/components/workspaces/workspace-members-panel";
import WorkspaceSettingsActions from "@/components/workspaces/workspace-settings-actions";
import { useAuth } from "@/contexts/auth-context";
import { getWorkspaceById } from "@/lib/api/workspaces";
import type { WorkspaceDetailsResponse, WorkspaceRole } from "@/types/workspace";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const roleStyles: Record<WorkspaceRole, string> = { OWNER: "bg-indigo-50 text-indigo-700", ADMIN: "bg-violet-50 text-violet-700", MEMBER: "bg-slate-100 text-slate-700" };

export default function WorkspacePage() {
  const { accessToken } = useAuth();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [data, setData] = useState<WorkspaceDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController(); setLoading(true); setError(null);
    getWorkspaceById(accessToken, workspaceId, controller.signal).then(setData).catch((value: unknown) => { if (!controller.signal.aborted) setError(value instanceof Error ? value.message : "Unable to load workspace"); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [accessToken, workspaceId, reload]);

  if (loading) return <LoadingBlock label="Loading workspace..." />;
  if (error) return <ErrorBlock message={error} onRetry={() => setReload((v) => v + 1)} />;
  if (!data) return null;

  const { workspace, role, joinedAt } = data;
  return <div>
    <Link href="/workspaces" className="inline-flex text-sm font-medium text-slate-600 hover:text-indigo-700">← Back to workspaces</Link>
    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><div className="flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-xl font-bold ring-1 ring-white/15">{workspace.name.charAt(0).toUpperCase()}</span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[role]}`}>{role}</span></div><h1 className="mt-5 text-3xl font-bold tracking-tight">{workspace.name}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{workspace.description || "No description provided."}</p></div>{role === "OWNER" && <WorkspaceSettingsActions workspace={workspace} onUpdated={() => setReload((v) => v + 1)} />}</div>
      </div>
      <div className="grid gap-4 p-6 text-sm text-slate-600 sm:grid-cols-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Created by</p><p className="mt-1 font-medium text-slate-900">{workspace.createdBy.name}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Joined</p><p className="mt-1 font-medium text-slate-900">{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(joinedAt))}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last updated</p><p className="mt-1 font-medium text-slate-900">{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(workspace.updatedAt))}</p></div></div>
    </section>
    <WorkspaceProjectList workspaceId={workspaceId} role={role} />
    <WorkspaceMembersPanel workspaceId={workspaceId} role={role} />
  </div>;
}
