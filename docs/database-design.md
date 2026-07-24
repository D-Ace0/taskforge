# TaskForge Database Design

## User and Workspace

A user can belong to multiple workspaces.

A workspace can contain multiple users.

This is a many-to-many relationship.

The relationship is implemented through the `WorkspaceMember` entity because it contains foreign keys referencing both the user and the workspace:

```text
userId
workspaceId
```

`WorkspaceMember` also stores information about the relationship itself, such as the user's role and the date they joined the workspace.

For example:

```text
userId: 5
workspaceId: 2
role: ADMIN
joinedAt: 2026-07-24
```

The combination of `userId` and `workspaceId` should be unique so that the same user cannot become a member of the same workspace more than once.

## Workspace and Project

A workspace can contain multiple projects.

A project belongs to one workspace.

This is a one-to-many relationship.

The `Project` entity stores the relationship using:

```text
workspaceId
```

Users gain access to projects through their membership in the project's workspace.

A project does not directly belong to multiple users in the first version.

## Project and Issue

A project can contain multiple issues.

An issue belongs to one project.

This is a one-to-many relationship.

The `Issue` entity stores the relationship using:

```text
projectId
```

An issue cannot belong to multiple projects in the first version.

## User and Issue

A user can create multiple issues.

An issue is created by one user.

The `Issue` entity stores this relationship using:

```text
createdById
```

A user can also be assigned to multiple issues.

An issue can have zero or one assignee.

The `Issue` entity stores the assignee using:

```text
assigneeId
```

The `assigneeId` field is optional because an issue may not be assigned immediately.

The creator and assignee are separate relationships.

For example:

```text
createdById: 10
assigneeId: 15
```

This means user `10` created the issue, while user `15` is responsible for working on it.

The backend must verify that the assigned user is a member of the workspace containing the issue.

## Issue and Comment

An issue can contain multiple comments.

A comment belongs to one issue.

The `Comment` entity stores this relationship using:

```text
issueId
```

A user can write multiple comments.

Each comment is written by one user.

The `Comment` entity stores the author relationship using:

```text
authorId
```

Therefore, every comment connects two important entities:

```text
Comment
├── belongs to one Issue
└── is written by one User
```

## Relationship Summary

```text
User
  │
  │ many
  ▼
WorkspaceMember
  ▲
  │ many
  │
Workspace
  │
  │ one-to-many
  ▼
Project
  │
  │ one-to-many
  ▼
Issue
  │
  │ one-to-many
  ▼
Comment
```

Additional user relationships:

```text
User ─── creates many ───> Issue

User ─── is assigned many ───> Issue

User ─── writes many ───> Comment
```

## Foreign Keys

| Entity | Foreign Key | References | Purpose |
|---|---|---|---|
| Workspace | `createdById` | `User.id` | Identifies the user who originally created the workspace |
| WorkspaceMember | `workspaceId` | `Workspace.id` | Identifies the workspace to which the membership belongs |
| WorkspaceMember | `userId` | `User.id` | Identifies the user represented by the membership |
| Project | `workspaceId` | `Workspace.id` | Identifies the workspace that contains the project |
| Project | `createdById` | `User.id` | Identifies the user who created the project |
| Issue | `projectId` | `Project.id` | Identifies the project that contains the issue |
| Issue | `createdById` | `User.id` | Identifies the user who created the issue |
| Issue | `assigneeId` | `User.id` | Identifies the user assigned to work on the issue |
| Comment | `issueId` | `Issue.id` | Identifies the issue that contains the comment |
| Comment | `authorId` | `User.id` | Identifies the user who wrote the comment |