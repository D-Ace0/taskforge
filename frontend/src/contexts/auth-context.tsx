'use client'

import { LoginResponse, User } from "@/types/auth";
import { createContext, type ReactNode, useContext, useState } from "react";

type AuthContextValues = {
    user: User | null;
    accessToken: string | null;
    signIn: (response: LoginResponse) => void;
}

const AuthContext = createContext<AuthContextValues|undefined>(undefined);

export default function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User|null>(null);
    const [accessToken, setAccessToken] = useState<string|null>(null);
    function signIn(response: LoginResponse) {
        setUser(response.user);
        setAccessToken(response.accessToken);
    }
    return (
        <AuthContext.Provider value={{user, accessToken, signIn}}>
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