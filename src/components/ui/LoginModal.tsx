"use client";

import { LogIn } from "lucide-react";
import "./LoginModal.css";
import { useRouter } from "next/navigation";

interface LoginModalProps {
    onClose: () => void;
}

export const LoginModal = ({ onClose }: LoginModalProps) => {
    const router = useRouter();

    const handleLogin = () => {
        router.push("/login");
        onClose();
    };

    return (
        <div className="login-popup-overlay" onClick={onClose}>
            <div className="login-popup" onClick={e => e.stopPropagation()}>
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-[#cae962]/10 rounded-full">
                        <LogIn size={32} color="#cae962" />
                    </div>
                </div>

                <h3 className="login-popup-title">Login Required</h3>
                <p className="login-popup-text">
                    You need to be logged in to interact with books, rate them, or add them to your list.
                </p>

                <div className="login-popup-actions">
                    <button className="login-cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="login-confirm-btn" onClick={handleLogin}>
                        Login Now
                    </button>
                </div>
            </div>
        </div>
    );
};
