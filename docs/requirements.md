# TaskForge Requirements

## Project Description

TaskForge helps software development teams communicate, organize their projects, manage issues, and collaborate more effectively. It provides a central workspace where team members can track work and discuss problems related to their projects.

## First Version Features

### Authentication

Users will be able to register, log in, log out, and view or update their profiles.

Password reset and email verification will be implemented in a later version.

### Workspaces

A workspace represents a team or organization in which users collaborate on one or more projects.

Users may belong to multiple workspaces and may have a different role in each workspace.

### Members and Roles

Each workspace contains members. Every member has a role that determines which actions they are authorized to perform inside that workspace.

The initial roles are Owner, Admin, and Member.

### Projects

A project belongs to a workspace and represents a product, application, or development effort that workspace members are collaborating on.

Workspace members can access projects according to their workspace role.

### Issues

An issue represents a task, bug, feature request, or improvement related to a project.

Each issue has a title, description, status, priority, creator, and optional assignee. Workspace members collaborate to resolve these issues.

### Comments

Workspace members can add comments to issues to discuss problems, share updates, and coordinate their work.

## Roles

### Owner

The Owner controls the workspace.

The Owner can:

- View and update the workspace.
- Delete the workspace.
- Add and remove members.
- Change member roles.
- Create, view, update, archive, and delete projects.
- Create, view, update, assign, and delete issues.
- Comment on issues.
- Access all content inside the workspace.

A workspace has one Owner in the first version.

### Admin

An Admin is a privileged workspace member appointed by the Owner.

An Admin can:

- Add and remove regular members.
- Create, view, update, archive, and delete projects.
- Create, view, update, assign, and delete issues.
- Comment on issues.
- Access all projects and issues inside the workspace.

An Admin cannot:

- Delete the workspace.
- Remove the Owner.
- change the Owner's role.
- Promote themselves or another user to Owner.

### Member

A Member can:

- View projects inside the workspace.
- View issues inside accessible projects.
- Create issues.
- Update issues they created.
- Comment on issues.
- Be assigned to issues.

A Member cannot:

- Manage workspace settings.
- Add or remove members.
- Change roles.
- Delete projects.
- Delete issues.

## Entities

### User

Represents a registered user account.

Possible fields:

```text
id
name
email
passwordHash
createdAt
updatedAt
```

### Workspace

Represents a team or organization.

Possible fields:

```text
id
name
description
createdById
createdAt
updatedAt
```

### WorkspaceMember

Represents a user's membership and role inside a workspace.

Possible fields:

```text
id
userId
workspaceId
role
joinedAt
```

The combination of `userId` and `workspaceId` must be unique so that the same user cannot have duplicate memberships in one workspace.

### Project

Represents a project belonging to a workspace.

Possible fields:

```text
id
name
description
workspaceId
createdById
createdAt
updatedAt
archivedAt
```

The `archivedAt` field is optional. When it is `null`, the project is active.

### Issue

Represents a task, bug, feature request, or improvement belonging to a project.

Possible fields:

```text
id
title
description
status
priority
projectId
createdById
assigneeId
createdAt
updatedAt
```

The `assigneeId` field is optional because an issue may not be assigned immediately.

### Comment

Represents a comment written by a user on an issue.

Possible fields:

```text
id
content
issueId
authorId
createdAt
updatedAt
```

## Features We Will Build Later

The following features will not be included in the first version:

- Viewer role
- Email invitations
- Password reset
- Email verification
- Caching with Redis
- Real-time notifications
- WebSockets
- GraphQL API
- File attachments
- Audit logs
- Kubernetes deployment
- Terraform infrastructure