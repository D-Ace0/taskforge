'use client';

import { useAuth } from "@/contexts/auth-context";
import Button from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const {signOut} = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleClick() {
        setError(null);
        setIsLoggingOut(true);

        try {
            await signOut();
            router.replace("/login");
        } catch {
            setError("Unable to sign out. Please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <div className="grid gap-2">
        <Button onClick={handleClick} disabled={isLoggingOut}>
            {isLoggingOut ? "Signing out..." : "Sign out"}
        </Button>

        {error && (
            <p role="alert" className="text-sm text-red-600">
            {error}
            </p>
        )}
    </div>
    )
}
