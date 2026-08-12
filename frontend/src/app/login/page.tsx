import Link from "next/link";
import LoginForm from "../../components/auth/login-form";

export default function Login() {
    return (
        <main>
        <h1>Sign in to TaskForge</h1>
        <LoginForm />

        <p>
            Don&apos;t have an account?{' '}
            <Link href="/register">Create an account</Link>
        </p>

        </main>
    )
}