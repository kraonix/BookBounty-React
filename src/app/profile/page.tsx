"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Personal } from "@/features/profile/components/Personal";
import { Preferences } from "@/features/profile/components/Preferences";
import { Saved } from "@/features/profile/components/Saved";
import { History } from "@/features/profile/components/History";
import "./Profile.css";

type Tab = "personal" | "preferences" | "saved" | "history";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("personal");

    const [mobileView, setMobileView] = useState<"menu" | "content">("menu");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div className="loading-state">Loading...</div>;
    }

    if (status === "unauthenticated") {
        return null;
    }

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setMobileView("content");
    };

    const handleBackToMenu = () => {
        setMobileView("menu");
    };

    const renderContent = () => {
        switch (activeTab) {
            case "personal":
                return <Personal />;
            case "preferences":
                return <Preferences />;
            case "saved":
                return <Saved />;
            case "history":
                return <History />;
            default:
                return <Personal />;
        }
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                {/* Left Panel - Navigation */}
                <aside className={`profile-sidebar ${mobileView === "content" ? "mobile-hidden" : ""}`}>
                    <h1 className="sidebar-title">Settings</h1>
                    <nav className="sidebar-nav">
                        <button
                            className={`nav-item ${activeTab === "personal" ? "active" : ""}`}
                            onClick={() => handleTabChange("personal")}
                        >
                            Personal Information
                        </button>
                        <button
                            className={`nav-item ${activeTab === "preferences" ? "active" : ""}`}
                            onClick={() => handleTabChange("preferences")}
                        >
                            Preferences
                        </button>
                        <button
                            className={`nav-item ${activeTab === "saved" ? "active" : ""}`}
                            onClick={() => handleTabChange("saved")}
                        >
                            Saved Books
                        </button>
                        <button
                            className={`nav-item ${activeTab === "history" ? "active" : ""}`}
                            onClick={() => handleTabChange("history")}
                        >
                            History
                        </button>
                    </nav>
                </aside>

                {/* Right Panel - Content */}
                <main className={`profile-content ${mobileView === "menu" ? "mobile-hidden" : ""}`}>
                    <button className="mobile-back-btn" onClick={handleBackToMenu}>
                        ← Back to Menu
                    </button>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
