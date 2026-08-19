"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useAuth } from "@/contexts/auth-context";
import { createIssue } from "@/lib/api/issues";
import type { IssuePriority } from "@/types/issue";
import { type SubmitEvent, useState } from "react";

export default function CreateIssueDialog({ open, workspaceId, projectId, onClose, onCreated }: { open: boolean; workspaceId: string; projectId: string; onClose: () => void; onCreated: () => void }) {
  const { accessToken } = useAuth(); const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [priority, setPriority] = useState<IssuePriority>("MEDIUM"); const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null);
  async function submit(event: SubmitEvent<HTMLFormElement>) { event.preventDefault(); if (!accessToken) return; setBusy(true); setError(null); try { await createIssue(accessToken, workspaceId, projectId, { title: title.trim(), description: description.trim() || undefined, priority }); setTitle(""); setDescription(""); setPriority("MEDIUM"); onCreated(); onClose(); } catch (value) { setError(value instanceof Error ? value.message : "Unable to create issue"); } finally { setBusy(false); } }
  return <Modal open={open} onClose={onClose} title="Create issue" description="Capture a clear, actionable piece of work."><form onSubmit={submit} className="grid gap-5"><label className="grid gap-2 text-sm font-medium text-slate-700">Title<input autoFocus required minLength={2} maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 rounded-lg border border-slate-300 px-3" /></label><label className="grid gap-2 text-sm font-medium text-slate-700">Description<textarea rows={5} maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none rounded-lg border border-slate-300 p-3" /></label><label className="grid gap-2 text-sm font-medium text-slate-700">Priority<select value={priority} onChange={(e) => setPriority(e.target.value as IssuePriority)} className="h-11 rounded-lg border border-slate-300 px-3"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select></label>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy || title.trim().length < 2}>{busy ? "Creating..." : "Create issue"}</Button></div></form></Modal>;
}
