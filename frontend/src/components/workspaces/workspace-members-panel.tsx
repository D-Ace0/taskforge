"use client";

import Button from "@/components/ui/button";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "@/components/ui/feedback";
import Modal from "@/components/ui/modal";
import { useAuth } from "@/contexts/auth-context";
import { addWorkspaceMember, getWorkspaceMembers, removeWorkspaceMember, updateWorkspaceMemberRole } from "@/lib/api/workspaces";
import type { WorkspaceMember, WorkspaceRole } from "@/types/workspace";
import { type SubmitEvent, useEffect, useState } from "react";

export default function WorkspaceMembersPanel({ workspaceId, role }: { workspaceId: string; role: WorkspaceRole }) {
  const { accessToken } = useAuth();
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    setLoading(true); setError(null);
    getWorkspaceMembers(accessToken, workspaceId, controller.signal)
      .then((value) => setMembers(value.memberships))
      .catch((value: unknown) => { if (!controller.signal.aborted) setError(value instanceof Error ? value.message : "Unable to load members"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [accessToken, workspaceId, reload]);

  async function addMember(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault(); if (!accessToken) return;
    setSubmitting(true); setFormError(null);
    try { await addWorkspaceMember(accessToken, workspaceId, { email: email.trim().toLowerCase(), role: newRole }); setEmail(""); setOpen(false); setReload((v) => v + 1); }
    catch (value) { setFormError(value instanceof Error ? value.message : "Unable to add member"); }
    finally { setSubmitting(false); }
  }

  async function changeRole(member: WorkspaceMember, nextRole: "ADMIN" | "MEMBER") {
    if (!accessToken || member.role === "OWNER") return;
    try { await updateWorkspaceMemberRole(accessToken, workspaceId, member.id, nextRole); setReload((v) => v + 1); }
    catch (value) { setError(value instanceof Error ? value.message : "Unable to change role"); }
  }

  async function remove(member: WorkspaceMember) {
    if (!accessToken || member.role === "OWNER" || !window.confirm(`Remove ${member.user.name} from this workspace?`)) return;
    try { await removeWorkspaceMember(accessToken, workspaceId, member.id); setReload((v) => v + 1); }
    catch (value) { setError(value instanceof Error ? value.message : "Unable to remove member"); }
  }

  const canManage = role === "OWNER" || role === "ADMIN";

  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-indigo-600">Collaboration</p><h2 className="mt-1 text-xl font-bold text-slate-950">Members</h2></div>{canManage && <Button variant="secondary" onClick={() => setOpen(true)}>Add member</Button>}</div>
    <div className="mt-5">{loading ? <LoadingBlock label="Loading members..." /> : error ? <ErrorBlock message={error} onRetry={() => setReload((v) => v + 1)} /> : members.length === 0 ? <EmptyBlock title="No members" description="Invite teammates to collaborate in this workspace." /> : <div className="divide-y divide-slate-100">{members.map((member) => <div key={member.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">{member.user.name.charAt(0).toUpperCase()}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{member.user.name}</p><p className="truncate text-xs text-slate-500">{member.user.email}</p></div></div><div className="flex items-center gap-2">{role === "OWNER" && member.role !== "OWNER" ? <select aria-label={`Role for ${member.user.name}`} value={member.role} onChange={(e) => void changeRole(member, e.target.value as "ADMIN" | "MEMBER")} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"><option value="ADMIN">Admin</option><option value="MEMBER">Member</option></select> : <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{member.role}</span>}{canManage && member.role !== "OWNER" && <Button variant="danger" onClick={() => void remove(member)}>Remove</Button>}</div></div>)}</div>}</div>
    <Modal open={open} onClose={() => setOpen(false)} title="Add workspace member" description="The user must already have a TaskForge account."><form onSubmit={addMember} className="grid gap-5"><label className="grid gap-2 text-sm font-medium text-slate-700">Email address<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-lg border border-slate-300 px-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label><label className="grid gap-2 text-sm font-medium text-slate-700">Role<select value={newRole} onChange={(e) => setNewRole(e.target.value as "ADMIN" | "MEMBER")} className="h-11 rounded-lg border border-slate-300 px-3"><option value="MEMBER">Member</option><option value="ADMIN">Admin</option></select></label>{formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}<div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add member"}</Button></div></form></Modal>
  </section>;
}
