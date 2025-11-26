/**
 * Admin Dashboard Page
 * 
 * The main entry point for the admin interface.
 * 
 * Features:
 * - Role-based access control (Admin only).
 * - Sidebar navigation for different admin tasks.
 * - Dynamic content rendering (Add Books, Manage Books, Manage Carousel).
 * - Uses `AdminPage.css` for layout styling.
 */
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AddBookForm } from "@/features/admin/components/AddBookForm";
import { ManageCarousel } from "@/features/admin/components/ManageCarousel";
import { ManageBooks } from "@/features/admin/components/ManageBooks";
import { BookPlus, Library, Images } from "lucide-react";
import "./AdminPage.css";

type AdminView = "add-books" | "manage-books" | "manage-carousel";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeView, setActiveView] = useState<AdminView>("add-books");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && (session?.user as any).role !== "admin") {
            router.push("/");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center text-white bg-[#0a0a0a]">Loading...</div>;
    }

    if ((session?.user as any)?.role !== "admin") {
        return null;
    }

    const renderContent = () => {
        switch (activeView) {
            case "add-books":
                return <AddBookForm />;
            case "manage-books":
                return <ManageBooks />;
            case "manage-carousel":
                return <ManageCarousel />;
            default:
                return <AddBookForm />;
        }
    };

    return (
        <div className="admin-wrapper">
            <div className="admin-container">
                {/* Left Panel - Sidebar */}
                <aside className="admin-sidebar">
                    <h1 className="sidebar-title">Admin Dashboard</h1>

                    <nav className="flex flex-col gap-2">
                        <button
                            className={`nav-btn ${activeView === "add-books" ? "active" : ""}`}
                            onClick={() => setActiveView("add-books")}
                        >
                            <BookPlus size={20} />
                            Add Books
                        </button>

                        <button
                            className={`nav-btn ${activeView === "manage-books" ? "active" : ""}`}
                            onClick={() => setActiveView("manage-books")}
                        >
                            <Library size={20} />
                            Manage Books
                        </button>

                        <button
                            className={`nav-btn ${activeView === "manage-carousel" ? "active" : ""}`}
                            onClick={() => setActiveView("manage-carousel")}
                        >
                            <Images size={20} />
                            Manage Carousel
                        </button>
                    </nav>
                </aside>

                {/* Right Panel - Content Area */}
                <main className="admin-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
