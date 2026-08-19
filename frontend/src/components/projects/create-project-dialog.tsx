"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useAuth } from "@/contexts/auth-context";
import { createProject } from "@/lib/api/projects";
import { type SubmitEvent, useState } from "react";

export default function CreateProjectDialog({ open, workspaceId, onClose, onCreated }: { open: boolean; workspaceId: string; onClose: () => void; onCreated: () => void }) {
  const { accessToken } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || name.trim().length < 2) return;
    setSubmitting(true); setError(null);
    try {
      await createProject(accessToken, workspaceId, { name: name.trim(), description: description.trim() || undefined });
      setName(""); setDescription(""); onCreated(); onClose();
    } catch (value) { setError(value instanceof Error ? value.message : "Unable to create project"); }
    finally { setSubmitting(false); }
  }

  return <Modal open={open} onClose={onClose} title="Create project" description="Group related issues and keep delivery focused.">
    <form onSubmit={submit} className="grid gap-5">
      <label className="grid gap-2 text-sm font-medium text-slate-700">Project name<input autoFocus required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-lg border border-slate-300 px-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">Description<textarea rows={4} maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" /></label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" disabled={submitting || name.trim().length < 2}>{submitting ? "Creating..." : "Create project"}</Button></div>
    </form>
  </Modal>;
}
