'use client'

import { useAuth } from "@/contexts/auth-context";
import { ApiResponseError, LoginResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react"

export default function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();
    const {setAuthentication} = useAuth();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        try {
            setIsSubmitting(true);
            setError(null);
            setSuccessMessage(null);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            console.log(apiUrl)

            const response = await fetch(
                `${apiUrl}/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password
                    }),
                    credentials: 'include'
                }
            )
            if(!response.ok){
                const apiError = (await response.json()) as ApiResponseError;
                const errorMessage = Array.isArray(apiError.message) ? apiError.message.join(', ') : apiError.message;
                setError(errorMessage);
                return;
            }
            const data = (await response.json()) as LoginResponse;
            // setSuccessMessage(`Welcome back, ${data.user.name}`);
            setAuthentication(data)
            router.replace('/dashboard')

        } catch {
            setError('Unable to connect to TaskForge. Please try again.')
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form  onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email</label>
                <input
                 type="email"
                  name="email" 
                  id="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                   />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input 
                type="password" 
                name="password" 
                id="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)} />
            </div>
            {error && (<p role="alert">{error}</p>)}
            {successMessage && (<p role="status">{successMessage}</p>)}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    )
}