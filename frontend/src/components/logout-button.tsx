'use client';
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const {clearAuthentication} = useAuth();
    const router = useRouter();
    async function handleLogout() {
        setIsLoggingOut(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
                {
                method: "POST",
                credentials: "include",
                },
            );
            if(!response.ok){
                throw new Error("Logout request failed");
            }
            clearAuthentication();
            router.replace('/login');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoggingOut(false);
        }
    }
    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
        >
            {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </button>
    )
}