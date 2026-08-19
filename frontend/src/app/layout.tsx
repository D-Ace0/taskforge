import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: 'TaskForge',
  description:
    'Collaborative workspace and issue management',
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
