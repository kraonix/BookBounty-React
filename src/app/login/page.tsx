import { AuthPage } from "@/features/auth/components/AuthPage";

export const revalidate = 3600;

export default function LoginPage() {
    return <AuthPage />;
}

