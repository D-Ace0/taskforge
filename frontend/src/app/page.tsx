import Link from "next/link";
import TypingHeading from "@/components/landing/typing-heading";
import TaskForgeLogo from "@/components/brand/taskforge-logo";

const features = [
  {
    title: "Shared workspaces",
    description:
      "Organize teams and manage membership with clear roles.",
  },
  {
    title: "Focused projects",
    description:
      "Keep related work grouped and visible from planning to completion.",
  },
  {
    title: "Trackable issues",
    description:
      "Assign, prioritize, discuss, and move work through its lifecycle.",
  },
];

export default function Home() {
  return (
    <>
    <main className="min-h-screen bg-slate-50">
      {/* navbar */}
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link
              href="/"
              className="flex items-center gap-2"
            >
              <TaskForgeLogo />

              <span className="text-lg font-bold text-slate-900">
                TaskForge
              </span>
            </Link>
              <div className="flex gap-2">
                  <Link href="/login"
                    className="text-slate-700 font-medium rounded-lg px-4 py-2 transition hover:bg-slate-200 hover:rounded-lg"
                  >
                    Sign in
                  </Link>
                  <Link href="/register"
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                  >
                    Get started
                  </Link>
              </div>
          </nav>
        </header>
        {/* hero section */}
        <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="max-w-3xl text-slate-900 font-medium">
                <p className="text-sm font-semibold text-blue-700">
                  Workspace and issue management
                </p>
                <TypingHeading />
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                  TaskForge brings your teams, projects, issues, and conversations into one focused workspace.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/login"
                    className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    Sign in 
                  </Link>
                  <Link href="/register"
                    className="bg-slate-900 rounded-lg px-5 py-3 text-center text-white transition-color hover:bg-slate-700"
                  >
                      Start building
                  </Link>
                </div>
              </div>
                <div className="flex justify-center">
                  <div className="rounded-full bg-indigo-100/70 p-10 blur-none">
                    <TaskForgeLogo size="large" animated />
                  </div>
                </div>
              </div>
            </div>
        </section>
        {/* landing page */}
        <section className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-blue-700">
                Everything in one place
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  A clear structure for collaborative work
                </h2>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {features.map((feature) => (
                  <article
                    key={feature.title}
                    className="rounded-xl
                            border border-slate-200
                            bg-slate-50
                            p-6
                            transition-all
                            duration-300
                            ease-in-out
                            hover:-translate-y-1
                            hover:scale-[1.03]
                            hover:border-indigo-200
                            hover:shadow-xl
                            hover:shadow-indigo-500/20
                            motion-safe:transition-all
                            motion-safe:duration-300
                            motion-safe:hover:-translate-y-1
                            motion-safe:hover:scale-[1.03]"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </article>
                ))}
              </div>
          </div>
        </section>
    </main>
    {/* footer */}
    <footer className="border-t border-slate-200 bg-white px-4 py-6">
      <p className="mx-auto max-w-6xl text-sm text-slate-500">
        TaskForge — collaborative work, clearly organized.
      </p>
    </footer>
    </>
  );
}
