import Link from "next/link";
import RegisterForm from "../../components/auth/register-form";

export default function Register() {
    return (
        <main>
        <h1>Create your TaskForge account</h1>
        <RegisterForm/>
        <p>
            Already have an account?{' '}
            <Link href="/login">Sign in to your account</Link>
        </p>
        </main>
    )
}