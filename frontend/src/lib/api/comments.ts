import { apiRequest } from "@/lib/api/client";
import type { Comment, CommentListResponse } from "@/types/comment";

const commentPath = (workspaceId: string, projectId: string, issueId: string) => `/workspaces/${encodeURIComponent(workspaceId)}/projects/${encodeURIComponent(projectId)}/issues/${encodeURIComponent(issueId)}/comments`;

export const getComments = (token: string, workspaceId: string, projectId: string, issueId: string, page = 1, signal?: AbortSignal) => apiRequest<CommentListResponse>(`${commentPath(workspaceId, projectId, issueId)}?page=${page}&limit=20`, token, { signal });
export const createComment = (token: string, workspaceId: string, projectId: string, issueId: string, content: string) => apiRequest<Comment>(commentPath(workspaceId, projectId, issueId), token, { method: "POST", body: JSON.stringify({ content }) });
export const updateComment = (token: string, workspaceId: string, projectId: string, issueId: string, commentId: string, content: string) => apiRequest<Comment>(`${commentPath(workspaceId, projectId, issueId)}/${encodeURIComponent(commentId)}`, token, { method: "PATCH", body: JSON.stringify({ content }) });
export const deleteComment = (token: string, workspaceId: string, projectId: string, issueId: string, commentId: string) => apiRequest<void>(`${commentPath(workspaceId, projectId, issueId)}/${encodeURIComponent(commentId)}`, token, { method: "DELETE" });
