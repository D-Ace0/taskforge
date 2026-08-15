'use client';
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
    const {user} = useAuth();


    return <main>Welcome back, {user?.name}</main>;

}