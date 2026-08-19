import type { User } from "@/types/auth";

export type IssueStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type IssueSummary = {
  id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: string;
  updatedAt: string;
  createdBy: Pick<User, "id" | "name" | "email">;
  assignee: Pick<User, "id" | "name" | "email"> | null;
};

export type IssueDetails = IssueSummary & {
  project: {
    id: string;
    name: string;
    archivedAt: string | null;
  };
};

export type IssueListQuery = {
  status?: IssueStatus;
  priority?: IssuePriority;
  page: number;
  limit: number;
};

export type IssueListResponse = {
  issues: IssueSummary[];
  pagination: {
    page: number;
    limit: number;
    totalIssues: number;
    totalPages: number;
  };
};

export type CreateIssueInput = {
  title: string;
  description?: string;
  priority?: IssuePriority;
  assigneeId?: string;
};

export type UpdateIssueInput = {
  title?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
};
