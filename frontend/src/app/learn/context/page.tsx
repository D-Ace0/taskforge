'use client';

import Button from "@/components/ui/button";
import DensityProvider, { useDensity } from "@/contexts/density-context";

const issues = [
  {
    id: 1,
    title: "Design authentication pages",
    status: "TODO",
  },
  {
    id: 2,
    title: "Connect workspace API",
    status: "IN_PROGRESS",
  },
  {
    id: 3,
    title: "Build project dashboard",
    status: "DONE",
  },
];

function DensityToolbar() {
    const { density, toggleDensity } = useDensity();

    return (
        <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h2 className="font-semibold text-slate-900">
            Display density
            </h2>

            <p className="mt-1 text-sm text-slate-600">
            Current mode: {density}
            </p>
        </div>

        <Button onClick={toggleDensity}>
            Switch 
        </Button>
        </section>
    );
}

function DensityIssueList() {
  const { density } = useDensity();

  const listSpacing =
    density === "comfortable"
      ? "space-y-4"
      : "space-y-2";

  const cardPadding =
    density === "comfortable"
      ? "p-6"
      : "p-3";

  return (
    <section className="grid min-h-screen bg-white p-3">
      <h2 className="text-lg font-semibold text-slate-900">
        Issues
      </h2>

      <div className={`mt-4 ${listSpacing}`}>
        {issues.map((issue) => (
          <article
            key={issue.id}
            className={`rounded-xl border border-slate-200 bg-white transition-all duration-800 ${cardPadding}`}
          >
            <h3 className="font-semibold text-slate-900">
              {issue.title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {issue.status}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ContextLessonPage() {
  return (
    <DensityProvider>
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-slate-900">
            Context demonstration
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Change one shared preference used by multiple components.
          </p>

          <div className="mt-8 space-y-8">
            <DensityToolbar />
            <DensityIssueList />
          </div>
        </div>
      </main>
    </DensityProvider>
  );
}