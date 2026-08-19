"use client";

import CommentThread from "@/components/comments/comment-thread";
import EditIssueDialog from "@/components/issues/edit-issue-dialog";
import Button from "@/components/ui/button";
import { ErrorBlock, LoadingBlock } from "@/components/ui/feedback";
import { useAuth } from "@/contexts/auth-context";
import { deleteIssue, getIssue, updateIssue, updateIssueAssignee } from "@/lib/api/issues";
import { getWorkspaceById, getWorkspaceMembers } from "@/lib/api/workspaces";
import type { IssueDetails, IssuePriority, IssueStatus } from "@/types/issue";
import type { WorkspaceMember, WorkspaceRole } from "@/types/workspace";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function IssuePage() {
  const { accessToken, user } = useAuth();
  const router = useRouter();
  const { workspaceId, projectId, issueId } = useParams<{ workspaceId: string; projectId: string; issueId: string }>();
  const [issue, setIssue] = useState<IssueDetails | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [role, setRole] = useState<WorkspaceRole>("MEMBER");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    Promise.all([
      getIssue(accessToken, workspaceId, projectId, issueId, controller.signal),
      getWorkspaceById(accessToken, workspaceId, controller.signal),
      getWorkspaceMembers(accessToken, workspaceId, controller.signal),
    ]).then(([issueData, membership, memberData]) => {
      setIssue(issueData);
      setRole(membership.role);
      setMembers(memberData.memberships);
    }).catch((value: unknown) => {
      if (!controller.signal.aborted) setError(value instanceof Error ? value.message : "Unable to load issue");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [accessToken, workspaceId, projectId, issueId, reload]);

  async function changeDetails(input: { status?: IssueStatus; priority?: IssuePriority }) {
    if (!accessToken) return;
    setBusy(true);
    setError(null);
    try {
      await updateIssue(accessToken, workspaceId, projectId, issueId, input);
      setReload((value) => value + 1);
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to update issue");
    } finally {
      setBusy(false);
    }
  }

  async function assign(assigneeId: string) {
    if (!accessToken) return;
    setBusy(true);
    try {
      await updateIssueAssignee(accessToken, workspaceId, projectId, issueId, assigneeId || null);
      setReload((value) => value + 1);
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to assign issue");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!accessToken || !window.confirm("Permanently delete this issue?")) return;
    try {
      await deleteIssue(accessToken, workspaceId, projectId, issueId);
      router.replace(`/workspaces/${workspaceId}/projects/${projectId}`);
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to delete issue");
    }
  }

  if (loading) return <LoadingBlock label="Loading issue..." />;
  if (error && !issue) return <ErrorBlock message={error} onRetry={() => setReload((value) => value + 1)} />;
  if (!issue) return null;

  const archived = issue.project.archivedAt !== null;
  const privileged = role === "OWNER" || role === "ADMIN";
  const canEdit = !archived && (privileged || issue.createdBy.id === user?.id);

  return (
    <div>
      <Link href={`/workspaces/${workspaceId}/projects/${projectId}`} className="text-sm font-medium text-slate-600 hover:text-indigo-700">← Back to {issue.project.name}</Link>
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="max-w-3xl"><p className="text-sm font-semibold text-indigo-600">Issue</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{issue.title}</h1><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{issue.description || "No description provided."}</p></div>
          <div className="flex gap-2">{canEdit && <Button variant="secondary" onClick={() => setEditing(true)}>Edit issue</Button>}{!archived && privileged && <Button variant="danger" onClick={() => void remove()}>Delete issue</Button>}</div>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Status<select disabled={busy || archived || (!privileged && issue.createdBy.id !== user?.id)} value={issue.status} onChange={(event) => void changeDetails({ status: event.target.value as IssueStatus })} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700"><option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="DONE">Done</option></select></label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Priority<select disabled={busy || archived || (!privileged && issue.createdBy.id !== user?.id)} value={issue.priority} onChange={(event) => void changeDetails({ priority: event.target.value as IssuePriority })} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select></label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Assignee<select disabled={busy || archived || !privileged} value={issue.assignee?.id ?? ""} onChange={(event) => void assign(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700"><option value="">Unassigned</option>{members.map((member) => <option key={member.user.id} value={member.user.id}>{member.user.name}</option>)}</select></label>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Created by</p><p className="mt-3 text-sm font-medium text-slate-700">{issue.createdBy.name}</p></div>
        </div>
      </section>
      <CommentThread workspaceId={workspaceId} projectId={projectId} issueId={issueId} role={role} archived={archived} />
      <EditIssueDialog open={editing} workspaceId={workspaceId} projectId={projectId} issue={issue} onClose={() => setEditing(false)} onUpdated={() => setReload((value) => value + 1)} />
    </div>
  );
}
