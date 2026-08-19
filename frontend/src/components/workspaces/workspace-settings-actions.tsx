"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useAuth } from "@/contexts/auth-context";
import { deleteWorkspace, updateWorkspace } from "@/lib/api/workspaces";
import type { WorkspaceSummary } from "@/types/workspace";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";

export default function WorkspaceSettingsActions({ workspace, onUpdated }: { workspace: WorkspaceSummary; onUpdated: () => void }) {
  const { accessToken } = useAuth(); const router = useRouter();
  const [open, setOpen] = useState(false); const [name, setName] = useState(workspace.name); const [description, setDescription] = useState(workspace.description ?? "");
  const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null);

  async function save(event: SubmitEvent<HTMLFormElement>) { event.preventDefault(); if (!accessToken) return; setBusy(true); setError(null); try { await updateWorkspace(accessToken, workspace.id, { name: name.trim(), description: description.trim() }); setOpen(false); onUpdated(); } catch (value) { setError(value instanceof Error ? value.message : "Unable to update workspace"); } finally { setBusy(false); } }
  async function remove() { if (!accessToken || !window.confirm(`Permanently delete ${workspace.name} and all of its projects?`)) return; setBusy(true); try { await deleteWorkspace(accessToken, workspace.id); router.replace("/workspaces"); } catch (value) { setError(value instanceof Error ? value.message : "Unable to delete workspace"); setBusy(false); } }

  return <><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => setOpen(true)}>Edit workspace</Button><Button variant="danger" disabled={busy} onClick={() => void remove()}>Delete</Button></div><Modal open={open} onClose={() => setOpen(false)} title="Edit workspace"><form onSubmit={save} className="grid gap-5"><label className="grid gap-2 text-sm font-medium text-slate-700">Name<input required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-lg border border-slate-300 px-3" /></label><label className="grid gap-2 text-sm font-medium text-slate-700">Description<textarea rows={4} maxLength={100} value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-lg border border-slate-300 p-3" /></label>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={busy || name.trim().length < 2}>{busy ? "Saving..." : "Save changes"}</Button></div></form></Modal></>;
}
