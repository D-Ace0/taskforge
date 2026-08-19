"use client";

import Button from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { createWorkspace } from "@/lib/api/workspaces";
import {
  type SubmitEvent,
  useEffect,
  useState,
} from "react";

type CreateWorkspaceDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateWorkspaceDialog({
  isOpen,
  onClose,
  onCreated,
}: CreateWorkspaceDialogProps) {
  const { accessToken } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] = useState<string | null>(
    null,
  );

  const isNameValid =
    name.trim().length >= 2 &&
    name.trim().length <= 100;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) {
    return null;
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    setName("");
    setDescription("");
    setError(null);
    onClose();
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!accessToken || !isNameValid) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createWorkspace(accessToken, {
        name,
        description,
      });

      setName("");
      setDescription("");
      onCreated();
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create workspace. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close create workspace dialog"
        disabled={isSubmitting}
        onClick={handleClose}
        className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm"
      />

      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-workspace-title"
          className="pointer-events-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        >
          <div className="flex items-start justify-betwecen gap-4">
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                New workspace
              </p>

              <h2
                id="create-workspace-title"
                className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
              >
                Create a workspace
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Bring your team, projects, and issues
                together in one focused place.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close dialog"
              disabled={isSubmitting}
              onClick={handleClose}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5"
          >
            <div className="grid gap-2">
              <label
                htmlFor="workspace-name"
                className="text-sm font-medium text-slate-700"
              >
                Workspace name
              </label>

              <input
                id="workspace-name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={100}
                autoFocus
                autoComplete="off"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="For example: TaskForge Team"
                className="h-11 rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />

              <p className="text-xs text-slate-500">
                Use a recognizable team or organization
                name.
              </p>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="workspace-description"
                className="text-sm font-medium text-slate-700"
              >
                Description{" "}
                <span className="font-normal text-slate-400">
                  (optional)
                </span>
              </label>

              <textarea
                id="workspace-description"
                name="description"
                rows={4}
                maxLength={500}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="What will your team organize here?"
                className="resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />

              <p className="text-right text-xs text-slate-400">
                {description.length}/500
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={handleClose}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  !isNameValid || isSubmitting
                }
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create workspace"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}