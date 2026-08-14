import Link from "next/link";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <section className="w-full">
      <header>
        <p className="text-sm font-semibold text-indigo-600">
          Start building with your team
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          Create your TaskForge account
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Organize workspaces, manage projects, and keep your team’s issues in
          one focused place.
        </p>
      </header>

      <div className="mt-8">
        <RegisterForm />
      </div>

      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}