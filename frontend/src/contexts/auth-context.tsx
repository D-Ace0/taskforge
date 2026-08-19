'use client'

import type { LoginResponse, RefreshResponse, User } from "@/types/auth";
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type AuthContextValues = {
    user: User | null;
    accessToken: string | null;
    signIn: (response: LoginResponse) => void;
    signOut: () => Promise<void>;
    updateUser: (user: User) => void;
    authenticationError: string | null;
    retryAuthentication: () => void;
    isInitializing: boolean;
}

const AuthContext = createContext<AuthContextValues|undefined>(undefined);

export default function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User|null>(null);
    const [accessToken, setAccessToken] = useState<string|null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [authenticationError, setAuthenticationError] = useState<string | null>(null);
    const [restoreAttempt, setRestoreAttempt] = useState(0);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if(hasInitialized.current) {
            return;
        }
        hasInitialized.current = true;
        async function restoreAuthentication() {
            setAuthenticationError(null);
            try {
                const response = await fetch(`${apiUrl}/auth/refresh`,{
                    method: 'POST',
                    credentials: 'include'
                });
                if(!response.ok) {
                    setUser(null);
                    setAccessToken(null);
                    return;
                }
                const refreshResponse: RefreshResponse = await response.json();

                const userResponse = await fetch(`${apiUrl}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${refreshResponse.accessToken}`
                    },
                    credentials: 'include'
                });
                if(!userResponse.ok) {
                    setUser(null);
                    setAccessToken(null);
                    return;
                }
                const userData: User = await userResponse.json();
                setUser(userData);
                setAccessToken(refreshResponse.accessToken);
            } catch {
                setUser(null);
                setAccessToken(null);
                setAuthenticationError("TaskForge cannot reach the API. Make sure the backend is running, then try again.");
            } finally {
                setIsInitializing(false)
            }
        }
        void restoreAuthentication();
    }, [restoreAttempt])

    function signIn(response: LoginResponse) {
        setUser(response.user);
        setAccessToken(response.accessToken);
    }

    function updateUser(user: User) {
        setUser(user);
    }

    function retryAuthentication() {
        hasInitialized.current = false;
        setIsInitializing(true);
        setRestoreAttempt((attempt) => attempt + 1);
    }

    async function signOut() {
        const response = await fetch(`${apiUrl}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        if(!response.ok) {
            throw new Error("Failed to sign out")
        }
        setUser(null);
        setAccessToken(null);
        
    }

    return (
        <AuthContext.Provider value={{user, accessToken, signIn, signOut, updateUser, authenticationError, retryAuthentication, isInitializing}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used inside AuthProvider") 
    }
    return context;
}
