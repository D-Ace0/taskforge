'use client'
import { useState, SubmitEvent } from "react";
import { IssueStatus } from "../page";

type Issue = {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
};

type IssueCardProps = {
    issue: Issue;
    onDelete: (issueId: number) => void;
    onMarkDone: (issueId: number) => void;
}

function IssueCard({
  issue,
  onDelete,
  onMarkDone,
}: IssueCardProps) {
  const isDone = issue.status === "DONE";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="font-semibold text-slate-900">
        {issue.title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {issue.description || "No description"}
      </p>

      <p className="mt-3 text-xs font-medium text-slate-600">
        {issue.status}
      </p>

      <div className="mt-4 flex gap-2 flex-col sm:flex-row">
        <button
          type="button"
          disabled={isDone}
          onClick={() => onMarkDone(issue.id)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDone ? "Completed" : "Mark done"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(issue.id)}
          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </article>
  );
}


export default function CreateIssue() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<IssueStatus>('TODO');
    const [issues, setIssues] = useState<Issue[]>([]);
    const isTitleValid = title.trim().length >= 3;
        function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
            event.preventDefault();

            const trimmedTitle = title.trim();

            if (trimmedTitle.length < 3) {
                return;
            }

            const newIssue: Issue = {
                id: Date.now(),
                title: trimmedTitle,
                description: description.trim(),
                status,
            };

            setIssues((currentIssues) => [
                ...currentIssues,
                newIssue,
            ]);

            setTitle("");
            setDescription("");
            setStatus("TODO");
        }
        
        function deleteIssue(issueId: number) {
            setIssues((currentIssues) => currentIssues.filter(
                (issue) => issue.id !== issueId
            ));
        }

        function markIssueAsDone(issueId: number) {
            setIssues((currentIssues) => currentIssues.map(
                (issue) => issue.id === issueId ? {...issue, status: 'DONE'} : issue 
            ))
        }

    return (
        <main className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-slate-900 font-semibold text-2xl">
                    Create Issue
                </h2>
                <p className="text-slate-600 text-sm mt-2">
                    Add an issue to your local learning board
                </p>
                <div className="grid gap-8 lg:grid-cols-2">
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <label htmlFor="title" className="block text-slate-700 font-medium text-sm">Title</label>
                            <input 
                                type="text"
                                id="title"
                                name="title"
                                value={title}
                                onChange={(ev) => setTitle(ev.target.value)}
                                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-slate-700 font-medium text-sm">Description</label>
                            <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                            />   
                        </div>
                        
                        <div>
                            <label htmlFor="status" className="block text-slate-700 font-medium text-sm">Status</label>
                            <select 
                                id="status"
                                name="status"
                                value={status}
                                onChange={(ev: React.ChangeEvent<HTMLSelectElement>) => setStatus(ev.target.value as IssueStatus)}
                                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                            >   
                            <option value="TODO">TODO</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="DONE">DONE</option>
                            </select>             
                        </div> 
                        <button
                        type="submit"
                        disabled={!isTitleValid}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                        Create issue
                        </button>
                    </form>
                    <div className="mt-6 space-y-3">
                    <h2 
                    className="text-slate-900 font-bold">
                        Created Issues
                    </h2>
                    {
                        issues.length === 0 ? (
                            <p className="text-sm text-slate-500">No issues created yet.</p>
                        ) : (
                            issues.map((issue) => (
                            <IssueCard
                                key={issue.id}
                                issue={issue}
                                onDelete={deleteIssue}
                                onMarkDone={markIssueAsDone}
                            />
                            ))
                        )
                    }
                    </div>
                </div>
            </div>
        </main>
    )
}