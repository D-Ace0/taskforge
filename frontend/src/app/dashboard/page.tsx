'use client';
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
    const {user} = useAuth();

    return (
        <main className="bg-slate-50 text-slate-900">
            <h1>
                welcome back: {user?.name}
            </h1>
        </main>
    )
}