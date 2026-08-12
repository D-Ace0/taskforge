'use client';
import { useEffect, useState } from "react";

type HealthResponse = {
  status: "ok" | "error";
  service: string;
  database: "up" | "down";
  timestamp: string;
};

export default function Health() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);
    const [health, setHealth] = useState<HealthResponse|null>(null);
    const [requestAttempt, setRequestAttempt] = useState(0);
    
    useEffect(() => {
        async function loadHealth() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
                if(!response.ok) {
                    throw new Error(`Error with request code: ${response.status}`)
                }
                const data = (await response.json()) as HealthResponse;
                setHealth(data);
            } catch (caughtError) {
                console.error(caughtError);
                setHealth(null);
                setError("Unable to reach the TaskForge API.");
            } finally {
                setIsLoading(false)
            }
        }
        void loadHealth();
    }, [requestAttempt])

    function retry() {
        setRequestAttempt((currentAttempt) => currentAttempt + 1);
        console.log(requestAttempt);
    }
    
    if (isLoading) {
        return (
            <main className="p-6 min-h-screen bg-slate-50">
            <p className="text-slate-700">Checking TaskForge services...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-2xl">
                <section className="rounded-xl border border-red-200 bg-red-50 p-6">
                <h1 className="font-semibold text-red-900">
                    TaskForge is unavailable
                </h1>

                <p role="alert" className="mt-2 text-sm text-red-700">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={retry}
                    className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                >
                    Retry
                </button>
                </section>
            </div>
            </main>
        );
    }

    if (!health) {
    return null;
    }
    return (
        <main className="p-6 min-h-screen bg-slate-50">
            <p className="text-slate-700">API: {health.status}</p>
            <p className="text-slate-700">Database: {health.database}</p>
        </main>
    );
}