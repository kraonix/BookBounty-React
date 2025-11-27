"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    onClose: () => void;
    duration?: number;
}

export const Toast = ({ message, type = "info", onClose, duration = 3000 }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        success: "bg-[#cae962] text-black",
        error: "bg-red-500 text-white",
        info: "bg-gray-800 text-white border border-gray-700",
    };

    const icons = {
        success: <CheckCircle size={18} />,
        error: <AlertCircle size={18} />,
        info: <AlertCircle size={18} />,
    };

    return (
        <div
            className={`fixed top-1/2 left-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                } ${bgColors[type]}`}
            style={{ minWidth: "300px" }}
        >
            {icons[type]}
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button onClick={() => setIsVisible(false)} className="opacity-70 hover:opacity-100">
                <X size={16} />
            </button>
        </div>
    );
};
