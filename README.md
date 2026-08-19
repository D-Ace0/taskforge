# TaskForge

TaskForge is a production-minded collaborative project management application for organizing teams, projects, issues, and technical discussions in one focused workspace.

It is built as a full-stack TypeScript monorepo with a NestJS REST API, a Next.js frontend, PostgreSQL, Prisma ORM, rotating refresh-token sessions, and workspace-level role-based authorization.

## Features

- Register, sign in, sign out, restore sessions, and update profile information
- Short-lived JWT access tokens and rotating refresh-token sessions
- Create, update, list, and delete workspaces
- Manage workspace members with Owner, Admin, and Member roles
- Create, update, archive, restore, list, and delete projects
- Create, update, assign, filter, paginate, and delete issues
- Prioritize issues and move them through To do, In progress, and Done states
- Add, edit, list, and delete issue comments
- Responsive authenticated dashboard and application shell
- Health endpoint with live PostgreSQL connectivity reporting
- OpenAPI/Swagger documentation for the REST API

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | NestJS 11, TypeScript, class-validator, Swagger |
| Database | PostgreSQL 17 |
| Data access | Prisma 7 with the PostgreSQL driver adapter |
| Authentication | Argon2id, JWT access tokens, rotating opaque refresh tokens |
| Infrastructure | Docker Compose |

## Architecture

```text
Browser / Next.js frontend (localhost:3000)
                    |
                    | REST + Bearer access token
                    | HttpOnly refresh-token cookie
                    v
NestJS API (localhost:5000)
        |           |             |
   Auth module  Domain modules  Access services
        |           |             |
        +-----------+-------------+
                    |
                 Prisma
                    |
             PostgreSQL (5432)
```

The frontend keeps the short-lived access token in memory. The longer-lived refresh token is stored in a `HttpOnly` cookie, so browser JavaScript cannot read it. Refresh tokens are hashed before being stored in the `Session` table and rotated whenever a session is refreshed.

Authorization is enforced by the backend. Hiding a frontend button improves the user experience, but it is never treated as a security boundary.

## Workspace roles

| Capability | Owner | Admin | Member |
| --- | :---: | :---: | :---: |
| View workspace content | Yes | Yes | Yes |
| Manage workspace settings | Yes | No | No |
| Add or remove members | Yes | Regular members | No |
| Change member roles | Yes | Limited | No |
| Manage projects | Yes | Yes | No |
| Create issues | Yes | Yes | Yes |
| Update any issue | Yes | Yes | No |
| Update an issue they created | Yes | Yes | Yes |
| Assign or delete issues | Yes | Yes | No |
| Comment on issues | Yes | Yes | Yes |
| Delete workspace | Yes | No | No |

## Repository structure

```text
taskforge/
├── backend/         NestJS API, Prisma schema, and migrations
├── frontend/        Next.js App Router application
├── infrastructure/  Local PostgreSQL Docker Compose configuration
└── docs/            Requirements and database design notes
```

## Prerequisites

- Node.js 24 or another version supported by the installed dependencies
- npm
- Docker Desktop with the Docker engine running
- Git

## Local setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd taskforge
```

### 2. Start PostgreSQL

Create `infrastructure/.env` from the example:

```env
POSTGRES_USER=taskforge
POSTGRES_PASSWORD=choose_a_local_password
POSTGRES_DB=taskforge
```

Start the database:

```bash
cd infrastructure
docker compose up -d
docker compose ps
```

The PostgreSQL service should report `healthy`.

### 3. Configure and start the backend

Create `backend/.env` from `backend/.env.example`:

```env
DATABASE_URL="postgresql://taskforge:choose_a_local_password@localhost:5432/taskforge?schema=public"
JWT_ACCESS_SECRET=replace_with_a_random_secret_at_least_32_characters_long
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

Install dependencies, apply migrations, and start NestJS:

```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

Useful backend URLs:

- API: `http://localhost:5000`
- Health: `http://localhost:5000/health`
- Swagger: `http://localhost:5000/docs`

### 4. Configure and start the frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then start Next.js in a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Development commands

### Backend

```bash
npm run start:dev     # Start NestJS in watch mode
npm run build         # Generate Prisma Client and compile the API
npm run start:prod    # Run the compiled API
npm run lint          # Lint backend source
npx prisma validate   # Validate the Prisma schema
npx prisma migrate dev
```

### Frontend

```bash
npm run dev            # Start Next.js development server
npm run lint           # Run ESLint
npx tsc --noEmit       # Type-check without emitting files
npm run build          # Create an optimized production build
npm run start          # Run the production build
```

## Main API resources

```text
/auth
/users/me
/workspaces
/workspaces/:workspaceId/members
/workspaces/:workspaceId/projects
/workspaces/:workspaceId/projects/:projectId/issues
/workspaces/:workspaceId/projects/:projectId/issues/:issueId/comments
/health
```

See Swagger for the complete request and response contracts.

## Security decisions

- Passwords are hashed with Argon2id and never returned by the API.
- Refresh tokens are generated with cryptographically secure randomness.
- Only SHA-256 hashes of refresh tokens are stored in PostgreSQL.
- Refresh-token rotation uses conditional database updates to reject token reuse.
- Access tokens expire after a short period and are held only in frontend memory.
- Refresh-token cookies use `HttpOnly` and an appropriate `SameSite` policy.
- CORS permits the configured frontend origin and credentials.
- Helmet adds defensive HTTP response headers.
- Validation pipes reject unknown or invalid request data.
- Workspace and resource access is verified on every protected backend operation.
- Database foreign keys and uniqueness constraints preserve relational integrity.

## First-version scope

TaskForge currently focuses on authentication, profiles, workspaces, roles, projects, issues, and comments. Password reset, email verification, invitations, attachments, real-time notifications, WebSockets, audit logs, and production cloud deployment are intentionally reserved for later versions.

## Verification

Before opening a pull request or publishing a release, run:

```bash
cd backend
npm run build

cd ../frontend
npm run lint
npx tsc --noEmit
npm run build
```

Then smoke-test Owner, Admin, Member, and outsider authorization paths in the browser.

## License

This repository is currently private and does not declare an open-source license.
