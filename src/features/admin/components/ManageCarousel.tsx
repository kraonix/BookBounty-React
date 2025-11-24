/**
 * Manage Carousel Component
 * 
 * Interface for managing the Home Page Hero Carousel.
 * 
 * Features:
 * - Select books to add to the carousel.
 * - View current carousel slides.
 * - Remove slides from the carousel.
 * - Enforces a maximum limit of 10 slides.
 */
"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import "../manageCarousel.css";

interface Book {
    _id: string;
    title: string;
    thumbnail: string;
}

interface Slide {
    _id: string;
    book: Book;
}

export const ManageCarousel = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBookId, setSelectedBookId] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        const resSlides = await fetch("/api/carousel");
        const dataSlides = await resSlides.json();
        if (Array.isArray(dataSlides)) setSlides(dataSlides);

        const resBooks = await fetch("/api/books?limit=100");
        const dataBooks = await resBooks.json();
        if (dataBooks.books) setBooks(dataBooks.books);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddSlide = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBookId) return;

        setLoading(true);

        try {
            const res = await fetch("/api/carousel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: selectedBookId }),
            });

            if (res.ok) {
                setSelectedBookId("");
                fetchData();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to add slide");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this slide?")) return;

        const res = await fetch(`/api/carousel?id=${id}`, { method: "DELETE" });

        if (res.ok) {
            setSlides(prev => prev.filter(s => s._id !== id));
        }
    };

    const availableBooks = books.filter(b => !slides.some(s => s.book?._id === b._id));

    return (
        <div className="admin-form-container">
            <div className="add-section">
                <h2 className="section-header">Add Book to Carousel</h2>
                <p className="subtext">Select a book to feature in the home page carousel. Max 10 slides.</p>

                <form onSubmit={handleAddSlide} className="form-box">
                    <div className="form-field">
                        <label className="admin-label">Select Book</label>
                        <select
                            value={selectedBookId}
                            onChange={e => setSelectedBookId(e.target.value)}
                            className="admin-select"
                        >
                            <option value="">-- Select a Book --</option>
                            {availableBooks.map(book => (
                                <option key={book._id} value={book._id}>
                                    {book.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedBookId || slides.length >= 10}
                        className="submit-btn"
                    >
                        {loading ? "Adding..." : "Add to Carousel"}
                    </button>
                </form>

                {slides.length >= 10 && (
                    <p className="error-text">Carousel is full (10/10).</p>
                )}
            </div>

            <div className="carousel-manager-container">
                <h2 className="section-header">Current Slides ({slides.length}/10)</h2>

                {slides.length === 0 ? (
                    <div className="empty-text">No slides added yet.</div>
                ) : (
                    <div className="carousel-slider-wrapper">
                        <div className="carousel-slider-track">
                            {slides.map(slide => (
                                <div key={slide._id} className="admin-slide-card">
                                    {slide.book ? (
                                        <>
                                            <img
                                                src={slide.book.thumbnail}
                                                alt={slide.book.title}
                                                className="admin-slide-image"
                                            />

                                            <div className="admin-slide-overlay">
                                                <button
                                                    onClick={() => handleDelete(slide._id)}
                                                    className="remove-slide-btn"
                                                >
                                                    <Trash2 size={16} /> Remove
                                                </button>
                                            </div>

                                            <div className="slide-title-box">
                                                <p className="slide-title" title={slide.book.title}>
                                                    {slide.book.title}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="missing-book">
                                            Book data missing
                                            <button
                                                onClick={() => handleDelete(slide._id)}
                                                className="missing-delete"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
