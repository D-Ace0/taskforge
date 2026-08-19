export type WorkspaceRole =
  | "OWNER"
  | "ADMIN"
  | "MEMBER";

export type WorkspaceSummary = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
};

export type WorkspaceMembership = {
  role: WorkspaceRole;
  joinedAt: string;
  workspace: WorkspaceSummary;
};

export type MyWorkspacesResponse =
  WorkspaceMembership[];

export type CreateWorkspaceInput = {
  name: string;
  description?: string;
};

export type CreatedWorkspace = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  memberships: Array<{
    id: string;
    userId: string;
    role: WorkspaceRole;
    joinedAt: string;
  }>;
};

export type WorkspaceDetailsResponse =
  WorkspaceMembership;

export type WorkspaceMember = {
  id: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type WorkspaceMembersResponse = {
  memberships: WorkspaceMember[];
};

export type UpdateWorkspaceInput = {
  name?: string;
  description?: string;
};

export type AddWorkspaceMemberInput = {
  email: string;
  role: Exclude<WorkspaceRole, "OWNER">;
};
