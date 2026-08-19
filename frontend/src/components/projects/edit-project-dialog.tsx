"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useAuth } from "@/contexts/auth-context";
import { updateProject } from "@/lib/api/projects";
import type { ProjectDetails } from "@/types/project";
import { type SubmitEvent, useEffect, useState } from "react";

type Props = { open: boolean; workspaceId: string; project: ProjectDetails; onClose: () => void; onUpdated: () => void };

export default function EditProjectDialog({ open, workspaceId, project, onClose, onUpdated }: Props) {
  const { accessToken } = useAuth();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(project.name);
    setDescription(project.description ?? "");
    setError(null);
  }, [open, project]);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setBusy(true);
    setError(null);
    try {
      await updateProject(accessToken, workspaceId, project.id, { name: name.trim(), description: description.trim() });
      onUpdated();
      onClose();
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to update project.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} title="Edit project" description="Update the project name and its purpose." onClose={onClose}>
      <form onSubmit={submit} className="grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-slate-700">Project name<input required minLength={2} maxLength={120} value={name} onChange={(event) => setName(event.target.value)} className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">Description<textarea rows={4} maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} className="resize-none rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label>
        {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy || name.trim().length < 2}>{busy ? "Saving..." : "Save project"}</Button></div>
      </form>
    </Modal>
  );
}
