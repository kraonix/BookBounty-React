/**
 * Book Section Component
 * 
 * A container for a specific genre or category of books.
 * 
 * Features:
 * - Displays a section title (e.g., "Trending Now", "Sci-Fi").
 * - Fetches books based on the provided genre/category.
 * - Renders a BookSlider with the fetched books.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookCard } from "./BookCard";
import "../book-showcase.css";

interface Book {
    _id: string;
    title: string;
    thumbnail: string;
    author: string;
    likes: number;
    views: number;
}

interface BookSectionProps {
    title: string;
    genre: string;
}

export const BookSection = ({ title, genre }: BookSectionProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch(`/api/books?genre=${genre}&limit=15`);
                const data = await res.json();
                if (data.books) {
                    setBooks(data.books);
                }
            } catch (error) {
                console.error("Failed to fetch books", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [genre]);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft =
                direction === "left"
                    ? scrollContainerRef.current.scrollLeft - scrollAmount
                    : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    if (loading) return <div className="text-white p-4">Loading {title}...</div>;
    if (books.length === 0) return (
        <div className="book-section">
            <h2 className="section-title">{title}</h2>
            <div className="text-gray-500 italic ml-4">No books found in this genre.</div>
        </div>
    );

    return (
        <div className="book-section">
            <h2 className="section-title">{title}</h2>

            <div className="book-slider-container">
                <button
                    onClick={() => scroll("left")}
                    className="slider-btn prev"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="slider-window">
                    <div
                        ref={scrollContainerRef}
                        className="slider-track"
                        style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {books.map((book) => (
                            <BookCard
                                key={book._id}
                                id={book._id}
                                title={book.title}
                                image={book.thumbnail}
                                author={book.author}
                                rating={4.5}
                                likes={book.likes}
                                views={book.views}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="slider-btn next"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};
