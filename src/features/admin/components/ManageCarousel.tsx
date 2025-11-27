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
    thumbnailUrl?: string;
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
        const CACHE_KEY = "carousel_cache";
        const VERSION_KEY = "carousel_version";

        // 1. Fetch Carousel Slides with Smart Caching
        try {
            // Check for updates from server
            const checkRes = await fetch("/api/carousel/check");
            const { lastModified } = await checkRes.json();

            // Check local cache
            const cachedData = localStorage.getItem(CACHE_KEY);
            const cachedVersion = localStorage.getItem(VERSION_KEY);

            // If cache exists and matches server version, use it
            if (cachedData && cachedVersion === lastModified) {
                setSlides(JSON.parse(cachedData));
            } else {
                // Otherwise fetch fresh data
                const resSlides = await fetch("/api/carousel", { next: { revalidate: 60 } });
                const dataSlides = await resSlides.json();
                if (Array.isArray(dataSlides)) {
                    setSlides(dataSlides);
                    // Update cache
                    localStorage.setItem(CACHE_KEY, JSON.stringify(dataSlides));
                    localStorage.setItem(VERSION_KEY, lastModified);
                }
            }
        } catch (error) {
            console.error("Failed to fetch slides", error);
        }

        // 2. Fetch Books (Standard Fetch)
        try {
            const resBooks = await fetch("/api/books?limit=100", { next: { revalidate: 60 } });
            const dataBooks = await resBooks.json();
            if (dataBooks.books) setBooks(dataBooks.books);
        } catch (error) {
            console.error("Failed to fetch books", error);
        }
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
                // Invalidate cache and refresh
                localStorage.removeItem("carousel_cache");
                localStorage.removeItem("carousel_version");
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
            // Invalidate cache and refresh
            localStorage.removeItem("carousel_cache");
            localStorage.removeItem("carousel_version");
            fetchData();
        }
    };

    const availableBooks = books.filter(b => !slides.some(s => s.book?._id === b._id));

    return (
        <div className="content-panel">
            <div className="panel-header">
                <h2 className="panel-title">Manage Carousel</h2>
                <p className="panel-subtitle">Select books to feature on the home page.</p>
            </div>

            <div className="add-section mb-8">
                <form onSubmit={handleAddSlide} className="admin-form">
                    <div className="form-group">
                        <label className="form-label">Select Book</label>
                        <div className="flex gap-4">
                            <select
                                value={selectedBookId}
                                onChange={e => setSelectedBookId(e.target.value)}
                                className="form-select flex-1"
                            >
                                <option value="">-- Select a Book --</option>
                                {availableBooks.map(book => (
                                    <option key={book._id} value={book._id}>
                                        {book.title}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={loading || !selectedBookId || slides.length >= 9}
                                className="save-btn mt-0"
                            >
                                {loading ? "Adding..." : "Add to Carousel"}
                            </button>
                        </div>
                    </div>
                </form>

                {slides.length >= 9 && (
                    <p className="text-red-500 mt-2 text-sm">Carousel is full (9/9).</p>
                )}
            </div>

            <div className="carousel-manager-container">
                <h3 className="text-xl font-bold text-white mb-4">Current Slides ({slides.length}/9)</h3>

                <div className="carousel-grid">
                    {Array.from({ length: 9 }).map((_, index) => {
                        const slide = slides[index];
                        return slide ? (
                            <div key={slide._id} className="admin-slide-card">
                                {slide.book ? (
                                    <>
                                        <img
                                            src={slide.book.thumbnailUrl || slide.book.thumbnail}
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
                                    <div className="missing-book p-4 text-red-500 text-center flex flex-col items-center justify-center h-full">
                                        <span className="text-xs mb-2">Book data missing</span>
                                        <button
                                            onClick={() => handleDelete(slide._id)}
                                            className="remove-slide-btn mt-0"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div key={`placeholder-${index}`} className="admin-slide-placeholder">
                                <div className="placeholder-icon">
                                    <div className="w-12 h-16 border-2 border-dashed border-gray-600 rounded flex items-center justify-center">
                                        <span className="text-2xl text-gray-600">+</span>
                                    </div>
                                </div>
                                <span className="placeholder-text">Empty Slot {index + 1}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
