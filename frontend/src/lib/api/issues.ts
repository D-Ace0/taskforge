import { apiRequest } from "@/lib/api/client";
import type { CreateIssueInput, IssueDetails, IssueListQuery, IssueListResponse, IssueSummary, UpdateIssueInput } from "@/types/issue";

const issuePath = (workspaceId: string, projectId: string) => `/workspaces/${encodeURIComponent(workspaceId)}/projects/${encodeURIComponent(projectId)}/issues`;

export function getIssues(token: string, workspaceId: string, projectId: string, query: IssueListQuery, signal?: AbortSignal) {
  const params = new URLSearchParams({ page: String(query.page), limit: String(query.limit) });
  if (query.status) params.set("status", query.status);
  if (query.priority) params.set("priority", query.priority);
  return apiRequest<IssueListResponse>(`${issuePath(workspaceId, projectId)}?${params}`, token, { signal });
}

export const getIssue = (token: string, workspaceId: string, projectId: string, issueId: string, signal?: AbortSignal) => apiRequest<IssueDetails>(`${issuePath(workspaceId, projectId)}/${encodeURIComponent(issueId)}`, token, { signal });
export const createIssue = (token: string, workspaceId: string, projectId: string, input: CreateIssueInput) => apiRequest<IssueSummary>(issuePath(workspaceId, projectId), token, { method: "POST", body: JSON.stringify(input) });
export const updateIssue = (token: string, workspaceId: string, projectId: string, issueId: string, input: UpdateIssueInput) => apiRequest<IssueSummary>(`${issuePath(workspaceId, projectId)}/${encodeURIComponent(issueId)}`, token, { method: "PATCH", body: JSON.stringify(input) });
export const updateIssueAssignee = (token: string, workspaceId: string, projectId: string, issueId: string, assigneeId: string | null) => apiRequest<Pick<IssueSummary, "id" | "title" | "updatedAt" | "assignee">>(`${issuePath(workspaceId, projectId)}/${encodeURIComponent(issueId)}/assignee`, token, { method: "PATCH", body: JSON.stringify({ assigneeId }) });
export const deleteIssue = (token: string, workspaceId: string, projectId: string, issueId: string) => apiRequest<void>(`${issuePath(workspaceId, projectId)}/${encodeURIComponent(issueId)}`, token, { method: "DELETE" });
