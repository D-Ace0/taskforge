import { learningProjects } from "@/lib/learning-projects"
import Link from "next/link";


export default function ProjectsCard() {
    const projects = learningProjects;
    return (
        <main className="min-h-screen bg-slate-50">
            <h1 className="text-lg font-bold text-slate-900 m-3 p-3 max-w-2xl">Created Projects</h1>
            <div className="grid gap-4 md:grid-cols-3 p-3 m-3">
                {
                    projects.map((project) => (
                        <Link href={`/learn/projects/${project.id}`} key={project.id} className="p-4 text-slate-900 border border-slate-900 rounded-lg transition hover:bg-slate-400">
                            <h2 className="font-semibold text-lg">{project.name}</h2>
                        </Link>
                    ))
                }
            </div>
        </main>
    )
}