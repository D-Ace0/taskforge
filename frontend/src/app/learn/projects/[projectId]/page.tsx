import { learningProjects } from "@/lib/learning-projects";
import { notFound } from "next/navigation";
import Link from "next/link";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { projectId } = await params;
    const project = learningProjects.find(
        (project) => project.id === projectId,
    );

    if (!project) {
        notFound();
    }
  return (
<main className="min-h-screen bg-slate-50 p-6">
  <div className="mx-auto max-w-2xl">
    <Link
      href="/learn/projects"
      className="text-sm font-medium text-slate-600 hover:text-slate-900"
    >
      ← Back to projects
    </Link>

    <article className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">
        {project?.name}
      </h1>

      <p className="mt-2 text-slate-600">
        {project?.description}
      </p>

      <p className="mt-6 text-sm font-medium text-slate-700">
        Status: {project?.status}
      </p>
    </article>
  </div>
</main>
  );
}