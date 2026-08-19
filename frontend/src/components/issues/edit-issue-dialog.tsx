"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useAuth } from "@/contexts/auth-context";
import { updateIssue } from "@/lib/api/issues";
import type { IssueDetails } from "@/types/issue";
import { type SubmitEvent, useEffect, useState } from "react";

type Props = { open: boolean; workspaceId: string; projectId: string; issue: IssueDetails; onClose: () => void; onUpdated: () => void };

export default function EditIssueDialog({ open, workspaceId, projectId, issue, onClose, onUpdated }: Props) {
  const { accessToken } = useAuth();
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(issue.title);
    setDescription(issue.description ?? "");
    setError(null);
  }, [open, issue]);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setBusy(true);
    setError(null);
    try {
      await updateIssue(accessToken, workspaceId, projectId, issue.id, { title: title.trim(), description: description.trim() });
      onUpdated();
      onClose();
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to update issue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} title="Edit issue" description="Clarify the work without losing its activity history." onClose={onClose}>
      <form onSubmit={submit} className="grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-slate-700">Title<input required minLength={2} maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">Description<textarea rows={5} maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} className="resize-none rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label>
        {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy || title.trim().length < 2}>{busy ? "Saving..." : "Save issue"}</Button></div>
      </form>
    </Modal>
  );
}
