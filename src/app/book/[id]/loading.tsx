"use client";

import "@/features/book-details/book-details.css";

export default function Loading() {
    return (
        <div className="book-loading-container">
            <div className="loader-circle"></div>
            <div className="loading-text">Loading your book...</div>
        </div>
    );
}
