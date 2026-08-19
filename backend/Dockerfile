# -----------------------------
# Stage 1: Compile the backend
# -----------------------------
FROM node:24-bookworm-slim AS builder

WORKDIR /app

# Install the exact dependency versions from package-lock.json.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the files required by Prisma and the NestJS compiler.
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY nest-cli.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY src ./src

# Prisma generation loads DATABASE_URL during the build.
# This is only a harmless placeholder, not the production database.
ENV DATABASE_URL=postgresql://taskforge:taskforge@localhost:5432/taskforge

# Generates Prisma Client and compiles TypeScript into dist/.
RUN npm run build


# --------------------------------
# Stage 2: Run the compiled backend
# --------------------------------
FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install runtime dependencies only.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the compiled application from the builder stage.
COPY --from=builder /app/dist ./dist

# Document the port used by TaskForge locally.
EXPOSE 5000

# Avoid running the application as Linux root.
USER node

# Executed whenever the container starts.
CMD ["node", "dist/main.js"]