'use client';
import LogoutButton from "@/components/logout-button";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { user, accessToken, isInitializing } = useAuth();

  if (isInitializing) {
    return <main>Restoring your session...</main>;
  }

  if (!user || !accessToken) {
    return <main>You are not signed in.</main>;
  }

  return (
    <main>
      <p>
        Dashboard of user: {user.name}, whose email is {user.email}
      </p>

      <p>Access token loaded: Yes</p>
      <LogoutButton />
    </main>
  );
}