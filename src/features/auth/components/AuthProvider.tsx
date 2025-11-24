/**
 * Auth Provider Component
 * 
 * Wraps the application with the NextAuth SessionProvider.
 * 
 * Features:
 * - Enables access to the authentication session across the app.
 * - Handles session persistence and updates.
 * - Required for `useSession` hook to work.
 */
"use client";

import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return <SessionProvider>{children}</SessionProvider>;
};
