'use client';
import { useState } from "react";

export type IssueStatus = "TODO" | "IN_PROGRESS" | "DONE";

type Issue = {
  id: number;
  title: string;
  status: IssueStatus;
};

export var issues: Issue[] = [
  { id: 1, title: "Design login page", status: "TODO" },
  { id: 2, title: "Connect authentication API", status: "IN_PROGRESS" },
  { id: 3, title: "Create database schema", status: "DONE" },
  { id: 4, title: "Build workspace dashboard", status: "TODO" },
];

type StatusFilter = "ALL" | IssueStatus;


function IssueCard({title, status}: Issue) {
    return(
        <section className="bg-white border rounded-xl p-4">
            <h1 className="font-bold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-900">{status}</p>
        </section>
    )
}

export default function IssueLearnPage() {
    const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL");
    
    const visibleIssues = selectedStatus === "ALL" 
        ? issues 
        : issues.filter((issue) => issue.status === selectedStatus)
    function getFilterButtonClasses(filter: StatusFilter) {
        const baseClasses =
            "rounded-lg border px-4 py-2 text-sm font-medium transition";

        if (selectedStatus === filter) {
            return `${baseClasses} border-slate-900 bg-slate-900 text-white`;
        }

        return `${baseClasses} border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;
    }
    return (
        <main className="min-h-screen bg-white">
            <div className="mx-auto max-w-3xl ">
                <div className="flex flex-wrap p-6 gap-2 max-w-3xl mx-auto">
                    <button 
                        className={getFilterButtonClasses("TODO")}
                        onClick={() => setSelectedStatus("TODO")}
                    >ToDo</button>
                    <button 
                        className={getFilterButtonClasses("IN_PROGRESS")}
                        onClick={() => setSelectedStatus("IN_PROGRESS")}
                    >IN_PROGRESS</button>
                    <button 
                        className={getFilterButtonClasses("DONE")}
                        onClick={() => setSelectedStatus("DONE")}
                    >DONE</button>
                    <button
                    type="button"
                    className={getFilterButtonClasses("ALL")}
                    onClick={() => setSelectedStatus("ALL")}
                    >
                    All
                    </button>
                </div>
                <div className="mt-6 space-y-3">
                    {visibleIssues.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                        <p className="text-sm text-slate-500">
                        No issues match this filter.
                        </p>
                    </div>
                    ) : (
                    visibleIssues.map((issue) => (
                        <IssueCard key={issue.id} {...issue} />
                    ))
                    )}
                </div>
            </div>
        </main>
    )
}