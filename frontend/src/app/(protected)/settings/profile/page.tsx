"use client";

import Button from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { updateProfile } from "@/lib/api/users";
import { type SubmitEvent, useEffect, useState } from "react";

export default function ProfileSettingsPage() {
  const { user, accessToken, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !user) return;

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const input = {
      ...(normalizedName !== user.name ? { name: normalizedName } : {}),
      ...(normalizedEmail !== user.email ? { email: normalizedEmail } : {}),
    };

    if (Object.keys(input).length === 0) {
      setSuccess("Your profile is already up to date.");
      return;
    }

    setBusy(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedUser = await updateProfile(accessToken, input);
      updateUser(updatedUser);
      setSuccess("Profile updated successfully.");
    } catch (value) {
      setError(value instanceof Error ? value.message : "Unable to update your profile.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-indigo-600">Account</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Profile settings</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Keep your identity current across every workspace, project, issue, and comment.
      </p>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-bold text-indigo-700">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">Personal information</h2>
            <p className="mt-1 text-sm text-slate-500">This information is visible to your teammates.</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-5">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Name
            <input
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Email address
            <input
              required
              type="email"
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
          {success && <p role="status" className="text-sm font-medium text-emerald-700">{success}</p>}

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <Button type="submit" disabled={busy || name.trim().length < 2 || !email.trim()}>
              {busy ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
