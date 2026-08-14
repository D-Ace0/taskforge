import Link from "next/link";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <section className="w-full">
    <header>
    <p className="text-sm font-semibold text-indigo-600">
        Welcome back
    </p>

    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
        Sign in to TaskForge
    </h1>

    <p className="mt-3 text-sm leading-6 text-slate-600">
        Continue managing your workspaces, projects, and team’s progress.
    </p>
    </header>

      <div className="mt-8">
        <LoginForm />
      </div>

      <p className="mt-8 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
        >
          Sign up
        </Link>
      </p>
    </section>
  );
}