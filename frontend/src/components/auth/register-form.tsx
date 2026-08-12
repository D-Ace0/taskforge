'use client';
import type { ApiResponseError, User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";

export default function RegisterForm() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<null | string>(null)
    const [successMessage, setSuccessMessage] = useState<null | string>(null)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsSubmitting(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                },
            )
            if(!response.ok){
                const apiError = (await response.json()) as ApiResponseError;
                const errorMessage = Array.isArray(apiError.message) ? apiError.message.join(', ') : apiError.message;
                setError(errorMessage);
                return;
            }
            const data = (await response.json()) as User;
            setSuccessMessage(`${data.name} regiseterd successfully`)
            router.push('/login')
        } catch {
            setError('Unable to connect to TaskForge. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name</label>
                <input 
                type="text"
                required
                value={name}
                id="name"
                name="name"
                autoComplete="name"
                onChange={(event) => setName(event.target.value)}
                 />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input 
                type="email"
                required
                value={email}
                id="email"
                name="email"
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                 />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input 
                type="password"
                required
                value={password}
                id="password"
                name="password"
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
                 />
            </div>
            {error && (<p role="alert">{error}</p>)}
            {successMessage && (<p role="alert">{successMessage}</p>)}
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating your account...' : 'Sign up'}</button>
        </form>
    )
}