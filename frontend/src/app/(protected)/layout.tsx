'use client';

import LogoutButton from "@/components/auth/logout-button";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

export default function ProtectedLayout({children}: {children: ReactNode}) {
    const {user, isInitializing} = useAuth();
    const router = useRouter();
    

    useEffect(() => {
        if (!isInitializing && !user) {
            router.replace('/login');
        }
    }, [isInitializing, user, router]);

    if (isInitializing) {
        return <p>Restoring your session...</p>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex justify-between">
            {children}
            <LogoutButton />
        </div>
    )
}