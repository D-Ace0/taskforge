import { apiRequest } from "@/lib/api/client";
import type { CreateProjectInput, ProjectDetails, ProjectListQuery, ProjectListResponse, ProjectSummary, UpdateProjectInput } from "@/types/project";

const projectPath = (workspaceId: string) => `/workspaces/${encodeURIComponent(workspaceId)}/projects`;

export function getWorkspaceProjects(token: string, workspaceId: string, query: ProjectListQuery, signal?: AbortSignal) {
  const params = new URLSearchParams({ status: query.status, page: String(query.page), limit: String(query.limit) });
  return apiRequest<ProjectListResponse>(`${projectPath(workspaceId)}?${params}`, token, { signal });
}

export const getProject = (token: string, workspaceId: string, projectId: string, signal?: AbortSignal) => apiRequest<ProjectDetails>(`${projectPath(workspaceId)}/${encodeURIComponent(projectId)}`, token, { signal });
export const createProject = (token: string, workspaceId: string, input: CreateProjectInput) => apiRequest<ProjectSummary>(projectPath(workspaceId), token, { method: "POST", body: JSON.stringify(input) });
export const updateProject = (token: string, workspaceId: string, projectId: string, input: UpdateProjectInput) => apiRequest<ProjectSummary>(`${projectPath(workspaceId)}/${encodeURIComponent(projectId)}`, token, { method: "PATCH", body: JSON.stringify(input) });
export const setProjectArchived = (token: string, workspaceId: string, projectId: string, archived: boolean) => apiRequest<Pick<ProjectSummary, "id" | "name" | "archivedAt" | "updatedAt">>(`${projectPath(workspaceId)}/${encodeURIComponent(projectId)}/${archived ? "archive" : "restore"}`, token, { method: "PATCH" });
export const deleteProject = (token: string, workspaceId: string, projectId: string) => apiRequest<void>(`${projectPath(workspaceId)}/${encodeURIComponent(projectId)}`, token, { method: "DELETE" });
