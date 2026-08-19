"use client";

import CreateProjectDialog from "@/components/projects/create-project-dialog";
import Button from "@/components/ui/button";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/ui/feedback";
import { useAuth } from "@/contexts/auth-context";
import { getWorkspaceProjects } from "@/lib/api/projects";
import type { ProjectListResponse, ProjectStatusFilter } from "@/types/project";
import type { WorkspaceRole } from "@/types/workspace";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WorkspaceProjectList({ workspaceId, role }: { workspaceId: string; role: WorkspaceRole }) {
  const { accessToken } = useAuth();
  const [data, setData] = useState<ProjectListResponse | null>(null);
  const [status, setStatus] = useState<ProjectStatusFilter>("active");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    setLoading(true); setError(null);
    getWorkspaceProjects(accessToken, workspaceId, { status, page, limit: 6 }, controller.signal)
      .then(setData)
      .catch((value: unknown) => { if (!controller.signal.aborted) setError(value instanceof Error ? value.message : "Unable to load projects"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [accessToken, workspaceId, status, page, reload]);

  function changeStatus(next: ProjectStatusFilter) { setStatus(next); setPage(1); }

  return <section className="mt-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-semibold text-indigo-600">Delivery</p><h2 className="mt-1 text-2xl font-bold text-slate-950">Projects</h2></div>
      {role !== "MEMBER" && <Button onClick={() => setDialogOpen(true)}>Create project</Button>}
    </div>
    <div className="mt-5 flex flex-wrap gap-2">{(["active", "archived", "all"] as const).map((item) => <button key={item} onClick={() => changeStatus(item)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${status === item ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{item}</button>)}</div>
    <div className="mt-5">{loading ? <LoadingBlock label="Loading projects..." /> : error ? <ErrorBlock message={error} onRetry={() => setReload((v) => v + 1)} /> : !data || data.projects.length === 0 ? <EmptyBlock title="No projects found" description={`There are no ${status} projects in this workspace.`} /> : <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.projects.map((project) => <Link key={project.id} href={`/workspaces/${workspaceId}/projects/${project.id}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"><div className="flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-xl bg-violet-50 font-bold text-violet-700">{project.name.charAt(0).toUpperCase()}</span>{project.archivedAt && <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">Archived</span>}</div><h3 className="mt-4 font-semibold text-slate-950 group-hover:text-indigo-700">{project.name}</h3><p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-600">{project.description || "No description provided."}</p><p className="mt-5 border-t border-slate-100 pt-3 text-xs text-slate-500">Created by {project.createdBy.name}</p></Link>)}</div>
      <div className="mt-5 flex items-center justify-between"><p className="text-sm text-slate-500">Page {data.pagination.page} of {Math.max(1, data.pagination.totalPages)} · {data.pagination.totalProjects} projects</p><div className="flex gap-2"><Button variant="secondary" disabled={page <= 1 || loading} onClick={() => setPage((v) => v - 1)}>Previous</Button><Button variant="secondary" disabled={page >= data.pagination.totalPages || loading} onClick={() => setPage((v) => v + 1)}>Next</Button></div></div>
    </>}</div>
    <CreateProjectDialog open={dialogOpen} workspaceId={workspaceId} onClose={() => setDialogOpen(false)} onCreated={() => setReload((v) => v + 1)} />
  </section>;
}
