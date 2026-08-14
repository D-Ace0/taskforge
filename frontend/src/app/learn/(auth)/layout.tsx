import TaskForgeLogo from "@/components/brand/taskforge-logo";
import Link from "next/link";
import { ReactNode } from "react"

type AuthLayoutProps = {
    children: ReactNode;
}

export default function AuthLayout({children}: AuthLayoutProps) {
    return (
        <div className="grid lg:grid-cols-2 min-h-screen bg-slate-50">
            <aside className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
                <div
                    aria-hidden="false"
                    className="absolute bg-indigo-500/20 -top-24 -left-24 w-80 h-80 rounded-full blur-3xl"
                />
                <div 
                    aria-hidden="false"
                    className="absolute bg-indigo-500/20 -bottom-24 -right-24 w-100 h-100 rounded-full blur-3xl"
                />

                <Link href="/" className="flex items-center gap-3">
                    <TaskForgeLogo />
                    <span className="font-bold text-xl">TaskForge</span>
                </Link>

                <div className="relative max-w-lg">
                    <p className="text-sm font-semibold text-indigo-300">
                        Collaborative work, clearly organized
                    </p>
                    <h1 className="font-bold text-4xl tracking-tight mt-4">
                        Bring your team's work into one focused workspace.
                    </h1>
                    <p className="mt-6 text-slate-300 leading-7">
                        Plan projects, assign issues, discuss progress, and keep everyone aligned.
                    </p>
                </div>

                <p className="text-slate-400 text-sm">
                    Workspaces. Projects. Issues. One workflow.
                </p>
            </aside>
            <main className="flex items-center justify-center p-6 sm:p-10">
                <Link href="/" className="flex items-center gap-3 lg:hidden">
                    <TaskForgeLogo />
                    <span className="font-bold text-lg text-slate-900">TaskForge</span>
                </Link>
                {children}
            </main>
        </div>
    )
}