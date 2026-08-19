"use client";

import Button from "@/components/ui/button";
import CreateWorkspaceDialog from "@/components/workspaces/create-workspace-dialog";
import { useAuth } from "@/contexts/auth-context";
import { getMyWorkspaces } from "@/lib/api/workspaces";
import type {
  MyWorkspacesResponse,
  WorkspaceRole,
} from "@/types/workspace";
import Link from "next/link";
import { useEffect, useState } from "react";

const roleStyles: Record<WorkspaceRole, string> = {
  OWNER:
    "bg-indigo-50 text-indigo-700 ring-indigo-200",
  ADMIN:
    "bg-violet-50 text-violet-700 ring-violet-200",
  MEMBER:
    "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function WorkspacesPage() {
  const { accessToken } = useAuth();

  const [memberships, setMemberships] =
    useState<MyWorkspacesResponse>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null,
  );

  const [isCreateDialogOpen, setIsCreateDialogOpen] =
    useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const token = accessToken;

    if (!token) {
      return;
    }

    const controller = new AbortController();

    async function loadWorkspaces() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getMyWorkspaces(
          token as string,
          controller.signal,
        );

        setMemberships(data);
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          "Unable to load your workspaces. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadWorkspaces();

    return () => {
      controller.abort();
    };
  }, [accessToken, reloadKey]);

  function handleOpenDialog() {
    setIsCreateDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsCreateDialogOpen(false);
  }

  function handleWorkspaceCreated() {
    setReloadKey((current) => current + 1);
  }

  function handleRetry() {
    setReloadKey((current) => current + 1);
  }
  
  function handleRefresh() {
    setReloadKey((current) => current + 1);
  }


  return (
    <section>
      <PageHeader
        onCreate={handleOpenDialog}
        onRefresh={handleRefresh}
        isRefreshing={isLoading}
      />

      {isLoading ? (
        <WorkspacesLoadingState />
      ) : error ? (
        <WorkspacesErrorState
          message={error}
          onRetry={handleRetry}
        />
      ) : memberships.length === 0 ? (
        <WorkspaceEmptyState
          onCreate={handleOpenDialog}
        />
      ) : (
        <WorkspaceGrid memberships={memberships} />
      )}

      <CreateWorkspaceDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseDialog}
        onCreated={handleWorkspaceCreated}
      />
    </section>
  );
}


type PageHeaderProps = {
  onCreate: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};

function PageHeader({ onCreate, onRefresh, isRefreshing }: PageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-semibold text-indigo-600">
          Your teams
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Workspaces
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Select a workspace to view its projects,
          members, and ongoing work.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
            onClick={onCreate}
            className="shrink-0"
            >
            Create workspace
        </Button>
        <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="shrink-0"
            >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        </div>
    </header>
  );
}

type WorkspaceGridProps = {
  memberships: MyWorkspacesResponse;
};

function WorkspaceGrid({
  memberships,
}: WorkspaceGridProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {memberships.map((membership) => {
        const workspace = membership.workspace;

        return (
          <Link
            key={workspace.id}
            href={`/workspaces/${workspace.id}`}
            className="group flex min-h-56 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-700 transition-colors group-hover:bg-indigo-100">
                {workspace.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <span
                className={[
                  "rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                  roleStyles[membership.role],
                ].join(" ")}
              >
                {membership.role}
              </span>
            </div>

            <div className="mt-5">
              <h2 className="text-lg font-semibold text-slate-950 transition-colors group-hover:text-indigo-700">
                {workspace.name}
              </h2>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                {workspace.description ||
                  "No description provided."}
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span>
                Created by{" "}
                {workspace.createdBy.name}
              </span>

              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

type WorkspaceEmptyStateProps = {
  onCreate: () => void;
};

function WorkspaceEmptyState({
  onCreate,
}: WorkspaceEmptyStateProps) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
        ◇
      </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-950">
        No workspaces yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        Create your first workspace to organize
        projects, members, and issues in one place.
      </p>

      <Button
        className="mt-6"
        onClick={onCreate}
      >
        Create your first workspace
      </Button>
    </div>
  );
}

type WorkspacesErrorStateProps = {
  message: string;
  onRetry: () => void;
};

function WorkspacesErrorState({
  message,
  onRetry,
}: WorkspacesErrorStateProps) {
  return (
    <div
      role="alert"
      className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6"
    >
      <p className="font-semibold text-red-800">
        We couldn&apos;t load your workspaces
      </p>

      <p className="mt-1 text-sm text-red-700">
        {message}
      </p>

      <Button
        variant="secondary"
        className="mt-4"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  );
}

function WorkspacesLoadingState() {
  return (
    <div
      aria-label="Loading workspaces"
      className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="flex items-start justify-between">
            <div className="size-11 rounded-xl bg-slate-200" />

            <div className="h-6 w-16 rounded-full bg-slate-100" />
          </div>

          <div className="mt-5 h-5 w-2/3 rounded bg-slate-200" />

          <div className="mt-3 h-4 w-full rounded bg-slate-100" />

          <div className="mt-2 h-4 w-3/4 rounded bg-slate-100" />

          <div className="mt-8 h-px bg-slate-100" />

          <div className="mt-4 h-3 w-1/2 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}