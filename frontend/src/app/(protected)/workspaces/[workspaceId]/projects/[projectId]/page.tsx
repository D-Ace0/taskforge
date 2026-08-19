"use client";

import IssueList from "@/components/issues/issue-list";
import EditProjectDialog from "@/components/projects/edit-project-dialog";
import Button from "@/components/ui/button";
import { ErrorBlock, LoadingBlock } from "@/components/ui/feedback";
import { useAuth } from "@/contexts/auth-context";
import { deleteProject, getProject, setProjectArchived } from "@/lib/api/projects";
import { getWorkspaceById } from "@/lib/api/workspaces";
import type { ProjectDetails } from "@/types/project";
import type { WorkspaceRole } from "@/types/workspace";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId: string }>();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [role, setRole] = useState<WorkspaceRole>("MEMBER");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    Promise.all([
      getProject(accessToken, workspaceId, projectId, controller.signal),
      getWorkspaceById(accessToken, workspaceId, controller.signal),
    ]).then(([projectData, membership]) => {
      setProject(projectData);
      setRole(membership.role);
    }).catch((value: unknown) => {
      if (!controller.signal.aborted) setError(value instanceof Error ? value.message : "Unable to load project");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [accessToken, workspaceId, projectId, reload]);

  async function toggleArchive() {
    if (!accessToken || !project) return;
    setBusy(true);
    setError(null);
    try {
      await setProjectArchived(accessToken, workspaceId, projectId, !project.archivedAt);
      setReload((value) => value + 1);
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to update project");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!accessToken || !project || !window.confirm(`Delete ${project.name} and all of its issues?`)) return;
    setBusy(true);
    try {
      await deleteProject(accessToken, workspaceId, projectId);
      router.replace(`/workspaces/${workspaceId}`);
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to delete project");
      setBusy(false);
    }
  }

  if (loading) return <LoadingBlock label="Loading project..." />;
  if (error && !project) return <ErrorBlock message={error} onRetry={() => setReload((value) => value + 1)} />;
  if (!project) return null;

  const archived = project.archivedAt !== null;
  const canManage = role === "OWNER" || role === "ADMIN";

  return (
    <div>
      <Link href={`/workspaces/${workspaceId}`} className="text-sm font-medium text-slate-600 hover:text-indigo-700">← Back to {project.workspace.name}</Link>
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-2"><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">Project</span>{archived && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Archived</span>}</div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{project.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{project.description || "No description provided."}</p>
          </div>
          {canManage && <div className="flex flex-wrap gap-2"><Button variant="secondary" disabled={busy || archived} onClick={() => setEditing(true)}>Edit</Button><Button variant="secondary" disabled={busy} onClick={() => void toggleArchive()}>{archived ? "Restore" : "Archive"}</Button><Button variant="danger" disabled={busy} onClick={() => void remove()}>Delete</Button></div>}
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex flex-wrap gap-5 border-t border-slate-100 pt-5 text-xs text-slate-500"><span>Created by {project.createdBy.name}</span><span>Updated {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(project.updatedAt))}</span><span>{role.toLowerCase()} access</span></div>
      </section>
      <IssueList workspaceId={workspaceId} projectId={projectId} archived={archived} />
      <EditProjectDialog open={editing} workspaceId={workspaceId} project={project} onClose={() => setEditing(false)} onUpdated={() => setReload((value) => value + 1)} />
    </div>
  );
}
