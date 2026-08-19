import { apiRequest } from "@/lib/api/client";
import type { AddWorkspaceMemberInput, CreateWorkspaceInput, CreatedWorkspace, MyWorkspacesResponse, UpdateWorkspaceInput, WorkspaceDetailsResponse, WorkspaceMember, WorkspaceMembersResponse, WorkspaceRole, WorkspaceSummary } from "@/types/workspace";

export const getMyWorkspaces = (token: string, signal?: AbortSignal) => apiRequest<MyWorkspacesResponse>("/workspaces", token, { signal });

export const createWorkspace = (token: string, input: CreateWorkspaceInput) => apiRequest<CreatedWorkspace>("/workspaces", token, { method: "POST", body: JSON.stringify({ name: input.name.trim(), description: input.description?.trim() || undefined }) });

export const getWorkspaceById = (token: string, id: string, signal?: AbortSignal) => apiRequest<WorkspaceDetailsResponse>(`/workspaces/${encodeURIComponent(id)}`, token, { signal });

export const updateWorkspace = (token: string, id: string, input: UpdateWorkspaceInput) => apiRequest<Pick<WorkspaceSummary, "id" | "name" | "description" | "updatedAt">>(`/workspaces/${encodeURIComponent(id)}`, token, { method: "PATCH", body: JSON.stringify(input) });

export const deleteWorkspace = (token: string, id: string) => apiRequest<void>(`/workspaces/${encodeURIComponent(id)}`, token, { method: "DELETE" });

export const getWorkspaceMembers = (token: string, id: string, signal?: AbortSignal) => apiRequest<WorkspaceMembersResponse>(`/workspaces/${encodeURIComponent(id)}/members`, token, { signal });

export const addWorkspaceMember = (token: string, id: string, input: AddWorkspaceMemberInput) => apiRequest<WorkspaceMember>(`/workspaces/${encodeURIComponent(id)}/members`, token, { method: "POST", body: JSON.stringify(input) });

export const updateWorkspaceMemberRole = (token: string, workspaceId: string, membershipId: string, role: Exclude<WorkspaceRole, "OWNER">) => apiRequest<WorkspaceMember>(`/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(membershipId)}/role`, token, { method: "PATCH", body: JSON.stringify({ role }) });

export const removeWorkspaceMember = (token: string, workspaceId: string, membershipId: string) => apiRequest<void>(`/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(membershipId)}`, token, { method: "DELETE" });
