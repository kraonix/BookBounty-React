/**
 * Book Card Component
 * 
 * Displays a single book's thumbnail and title.
 * 
 * Features:
 * - Shows book thumbnail image.
 * - Displays book title on hover (or always visible depending on design).
 * - Links to the Book Details page (`/book/[id]`).
 * - Used within BookSlider and other lists.
 */
"use client";

import Link from "next/link";
import "../book-showcase.css";

interface BookCardProps {
    id: string;
    title: string;
    image: string;
    author: string;
    rating?: number;
    likes?: number;
    views?: number;
}

export const BookCard = ({ id, title, image, author }: BookCardProps) => {
    return (
        <Link href={`/book/${id}`} className="book-card-link">
            <div className="book-card">
                <div className="book-image-wrapper">
                    <img
                        src={image}
                        alt={title}
                        className="book-image"
                    />
                    <div className="book-overlay" />
                </div>
                <h3 className="book-title">{title}</h3>
            </div>
        </Link>
    );
};
