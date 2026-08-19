export type ProjectStatusFilter =
  | "active"
  | "archived"
  | "all";

export type ProjectSummary = {
  id: string;
  name: string;
  description: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
};

export type ProjectListQuery = {
  status: ProjectStatusFilter;
  page: number;
  limit: number;
};

export type ProjectListResponse = {
  projects: ProjectSummary[];
  pagination: {
    page: number;
    limit: number;
    totalProjects: number;
    totalPages: number;
  };
};

export type ProjectDetails = ProjectSummary & {
  workspace: {
    id: string;
    name: string;
    createdAt: string;
  };
};

export type CreateProjectInput = {
  name: string;
  description?: string;
};

export type UpdateProjectInput = Partial<CreateProjectInput>;
