'use client';

import Button from "@/components/ui/button";
import type { ApiResponseError, User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";


export default function RegisterForm() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string|null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isNameValid = name.trim().length >= 2 && name.trim().length <= 100;
    const isPasswordValid = password.length >= 15 && password.length <= 128;
    const hasEmail = email.trim().length > 0;
    const canSubmit = isNameValid && hasEmail && isPasswordValid;

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            const newUser = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            };
            const response = await fetch('http://localhost:5000/auth/register', 
                {
                    'method': 'POST',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                }
            );
            if(!response.ok) {
                const apiError:ApiResponseError = await response.json();
                const errorMessage = Array.isArray(apiError.message) ? apiError.message.join(", ") : apiError.message
                setError(errorMessage ?? "Registration failed. Please try again.")
                return;
            }
            const data:User = await response.json();
            console.log(data);
            router.replace('/login')
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
                    <label htmlFor="name">
                        Name 
                    </label>
                    <input 
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        required
                        onChange={(event) => setName(event.target.value)}
                        className="border rounded-md border-slate-300"
                        minLength={2}
                        maxLength={100}
                        autoComplete="name"
                    />
                </div>
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
                        autoComplete="new-password"
                    />
                </div>
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Create an account"}
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