'use client';

import { LoginResponse, RefreshResponse, User } from "@/types/auth";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"

type AuthContextValue = {
    user: User | null;
    accessToken: string | null;
    isInitializing: boolean;
    setAuthentication: (authentication: LoginResponse) => void;
    clearAuthentication: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode
}

export default function AuthProvider({children}: AuthProviderProps) {

    const [user, setUser] = useState<User|null>(null);
    const [accessToken, setAccessToken] = useState<string|null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const restorationStarted = useRef(false);

    useEffect(() => {

        if (restorationStarted.current) {
            return;
        }

        restorationStarted.current = true;

        async function restoreAuthentication() {
            try {
            const refreshResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                {
                method: "POST",
                credentials: "include",
                },
            );

            if (!refreshResponse.ok) {
                clearAuthentication();
                return;
            }

            const refreshData =
                (await refreshResponse.json()) as RefreshResponse;

            const userResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
                {
                headers: {
                    Authorization: `Bearer ${refreshData.accessToken}`,
                },
                },
            );

            if (!userResponse.ok) {
                clearAuthentication();
                return;
            }

            const currentUser = (await userResponse.json()) as User;

            setAuthentication({
                accessToken: refreshData.accessToken,
                user: currentUser,
            });
            } catch (error) {
            console.error("Failed to restore authentication", error);
            clearAuthentication();
            } finally {
            setIsInitializing(false);
            }
        }

        void restoreAuthentication();
    }, []);

    function setAuthentication(authentication: LoginResponse){
        setUser(authentication.user);
        setAccessToken(authentication.accessToken)
    }
    
    function clearAuthentication(){
        setUser(null);
        setAccessToken(null);
    }

    return (
        <AuthContext.Provider
        value={{
            user,
            accessToken,
            isInitializing,
            setAuthentication,
            clearAuthentication
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}