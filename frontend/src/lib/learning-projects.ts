export type LearningProject = {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "ARCHIVED";
};

export const learningProjects: LearningProject[] = [
  {
    id: "taskforge-api",
    name: "TaskForge API",
    description: "NestJS and PostgreSQL backend",
    status: "ACTIVE",
  },
  {
    id: "taskforge-web",
    name: "TaskForge Web",
    description: "Next.js application",
    status: "ACTIVE",
  },
  {
    id: "old-prototype",
    name: "Old Prototype",
    description: "Original TaskForge experiment",
    status: "ARCHIVED",
  },
];