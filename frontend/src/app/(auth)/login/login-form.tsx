'use client';

import Button from "@/components/ui/button";
import type { ApiResponseError, LoginResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useRef, useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function LoginForm() {
    const router = useRouter();
    const {signIn} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string|null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    

    const isPasswordValid = password.length >= 15 && password.length <= 128;
    const hasEmail = email.trim().length > 0;
    const canSubmit = hasEmail && isPasswordValid;

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {

            const response = await fetch('http://localhost:5000/auth/login', 
                {
                    'method': 'POST',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase(),
                        password
                    })
                }
            );
            if(!response.ok) {
                const apiError: ApiResponseError = await response.json();
                const errorMessage = Array.isArray(apiError.message) ? apiError.message.join(", ") : apiError.message
                setError(errorMessage ?? "Sign in failed. Please try again.")
                return;
            }
            const data: LoginResponse = await response.json();
            signIn(data);
            router.replace('/dashboard')
        } catch {
            setError('Unable to connect to TaskForge. Please try again.')
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <section className="text-slate-900">
        <form onSubmit={handleSubmit}>
            <div className="grid gap-8 mt-8">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email">
                        Email address
                    </label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={email}
                        required
                        onChange={(event) => setEmail(event.target.value)}
                        className="border rounded-md border-slate-300"
                        maxLength={254}
                        autoComplete="email"
                    />

                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password">
                        Password
                    </label>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        value={password}
                        required
                        onChange={(event) => setPassword(event.target.value)}
                        className="border rounded-md border-slate-300"
                        minLength={15}
                        maxLength={128}
                        autoComplete="current-password"
                    />
                </div>
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
                {error && (
                <p role="alert" className="text-sm text-red-600">
                    {error}
                </p>
                )}
            </div>
        </form>
        </section>  
    )
}