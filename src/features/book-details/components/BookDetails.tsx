/**
 * Book Details Component
 * 
 * Displays detailed information about a specific book.
 * 
 * Features:
 * - Shows book cover, title, author, description, and metadata.
 * - "Read Now" button to open the PDF.
 * - "Add to Favorites" functionality (if implemented).
 * - Fetches data based on the book ID from the URL.
 */
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Play, Star, ThumbsUp, ThumbsDown, Bookmark, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import { Toast } from "@/components/ui/Toast";
import { LoginModal } from "@/components/ui/LoginModal";
import "@/features/book-details/book-details.css";

interface Book {
    _id: string;
    title: string;
    thumbnail: string;
    author: string;
    description: string;
    genre: string;
    likes: number;
    views: number;
    dislikes: number;
    saved: number;
    tags: string[];
    pdf: string;
    isLiked?: boolean;
    isDisliked?: boolean;
    averageRating?: number;
    userRating?: number;
    totalRatings?: number;
}

// Client-side cache
const bookCache = new Map<string, { data: Book, timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const BookDetails = ({ initialBook }: { initialBook?: Book | null }) => {
    const { id } = useParams();
    const { data: session } = useSession();
    const [book, setBook] = useState<Book | null>(initialBook || null);
    const [loading, setLoading] = useState(!initialBook);
    const [interacting, setInteracting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Track if view has been counted to prevent double counting in StrictMode
    const viewCounted = useRef(false);

    useEffect(() => {
        const fetchBook = async () => {
            // Check cache first
            if (typeof id === 'string') {
                const cached = bookCache.get(id);
                if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                    setBook(cached.data);
                    setLoading(false);
                    return;
                }
            }

            try {
                const res = await fetch(`/api/books/${id}`, { next: { revalidate: 3600 } });
                const data = await res.json();
                if (data._id) {
                    setBook(data);
                    // Update cache
                    if (typeof id === 'string') {
                        bookCache.set(id, { data, timestamp: Date.now() });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch book", error);
            } finally {
                setLoading(false);
            }
        };

        const incrementView = async () => {
            if (viewCounted.current) return;
            try {
                await fetch("/api/books/view", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookId: id }),
                });
                viewCounted.current = true;
            } catch (error) {
                console.error("Failed to increment view", error);
            }
        };

        if (id) {
            if (!book) fetchBook();
            incrementView();
        }
    }, [id, book]);

    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        setToast({ message, type });
    };

    const handleInteraction = async (action: "like" | "dislike") => {
        if (!session) {
            setShowLoginModal(true);
            return;
        }
        if (!book || interacting) return;
        setInteracting(true);

        // Optimistic Update
        const prevBook = { ...book };
        const newBook = { ...book };

        if (action === "like") {
            if (book.isLiked) {
                newBook.isLiked = false;
                newBook.likes--;
            } else {
                newBook.isLiked = true;
                newBook.likes++;
                if (book.isDisliked) {
                    newBook.isDisliked = false;
                    newBook.dislikes--;
                }
            }
        } else {
            if (book.isDisliked) {
                newBook.isDisliked = false;
                newBook.dislikes--;
            } else {
                newBook.isDisliked = true;
                newBook.dislikes++;
                if (book.isLiked) {
                    newBook.isLiked = false;
                    newBook.likes--;
                }
            }
        }
        setBook(newBook);

        try {
            const res = await fetch("/api/books/interact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: book._id, action }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Failed to update");
            }

            // Update with server response to be sure
            setBook(prev => prev ? {
                ...prev,
                likes: data.likes,
                dislikes: data.dislikes,
                isLiked: data.isLiked,
                isDisliked: data.isDisliked
            } : null);

        } catch (error: any) {
            console.error("Interaction failed", error);
            setBook(prevBook); // Revert
            showToast(error.message || "Something went wrong", "error");
        } finally {
            setInteracting(false);
        }
    };

    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [ratingSuccess, setRatingSuccess] = useState(false);

    const handleRateSelect = (score: number) => {
        if (!session) {
            setShowLoginModal(true);
            return;
        }
        if (book?.userRating) return; // Prevent changing if already rated
        setSelectedRating(score);
    };

    const submitRating = async () => {
        if (!session || !selectedRating || !book) return;

        // Optimistic update
        const prevBook = { ...book };
        setBook({ ...book, userRating: selectedRating });
        // Don't clear selectedRating yet, keep it for the success message

        try {
            const res = await fetch("/api/books/rate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: book._id, rating: selectedRating }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Failed to rate");
            }

            setBook(prev => prev ? {
                ...prev,
                userRating: data.userRating,
                averageRating: data.averageRating,
                totalRatings: data.totalRatings
            } : null);

            // Show success state
            setRatingSuccess(true);

            // Clear success message after 2 seconds
            setTimeout(() => {
                setRatingSuccess(false);
                setSelectedRating(null);
            }, 2000);

        } catch (error: any) {
            console.error("Rating failed", error);
            setBook(prevBook);
            setSelectedRating(selectedRating); // Restore selection on error
            showToast(error.message || "Failed to submit rating", "error");
        }
    };

    if (loading) return (
        <div className="book-loading-container">
            <div className="loader-circle"></div>
            <div className="loading-text">Loading your book...</div>
        </div>
    );
    if (!book) return <div className="min-h-screen text-white flex items-center justify-center">Book not found</div>;

    return (
        <div className="book-details-container">
            {showLoginModal && (
                <LoginModal onClose={() => setShowLoginModal(false)} />
            )}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="book-details-content">
                {/* Left Column - 20% */}
                <div className="details-left">
                    <div className="book-cover-wrapper">
                        <Image
                            src={book.thumbnail}
                            alt={book.title}
                            fill
                            className="book-cover"
                            unoptimized
                        />
                    </div>
                </div>

                {/* Middle Column - 60% */}
                <div className="details-middle">
                    <h1 className="book-title-large">{book.title}</h1>

                    <Link href={`/reader/${book._id}`} className="read-now-btn no-underline">
                        <Play fill="black" size={20} />
                        Read Now
                    </Link>

                    <div className="description-box">
                        <p className="description-text">
                            {book.description}
                        </p>
                    </div>

                    <div className="rating-container">
                        <div className="rating-wrapper">
                            <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={24}
                                        className={`transition-colors ${
                                            // If user has rated, disable cursor
                                            book.userRating ? "cursor-default" : "cursor-pointer"
                                            }`}
                                        onClick={() => {
                                            // Only allow selection if not already rated
                                            if (!book.userRating) {
                                                handleRateSelect(star);
                                            }
                                        }}
                                        fill={
                                            // Show filled if:
                                            // 1. Star is <= user's existing rating
                                            // 2. Star is <= currently selected rating (pending submit)
                                            star <= (book.userRating || selectedRating || 0)
                                                ? "#cae962"
                                                : "none"
                                        }
                                        stroke={
                                            star <= (book.userRating || selectedRating || 0)
                                                ? "#cae962"
                                                : "#6b7280"
                                        }
                                    />
                                ))}
                            </div>

                            {/* Submit Popup or Saved Message */}
                            {selectedRating && !book.userRating && !ratingSuccess && (
                                <div className="rating-submit-popup">
                                    <span className="rating-submit-text">Rate {selectedRating} stars?</span>
                                    <button
                                        className="rating-submit-btn"
                                        onClick={submitRating}
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}

                            {/* Saved Success Popup */}
                            {ratingSuccess && (
                                <div className="rating-submit-popup success">
                                    <span className="rating-submit-text text-green-400 font-bold">Saved!</span>
                                </div>
                            )}
                        </div>

                        <span className="rating-value">
                            {book.userRating ? (
                                <span className="text-[#cae962]">You rated: {book.userRating}/5</span>
                            ) : (
                                <>
                                    {book.averageRating || 0}/5
                                    <span className="text-xs text-gray-400 ml-2">({book.totalRatings || 0} votes)</span>
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* Right Column - 20% */}
                <div className="details-right">
                    <div className="metadata-item">
                        <span className="metadata-label">Name:</span>
                        <span className="metadata-value">{book.title}</span>
                    </div>

                    <div className="metadata-item">
                        <span className="metadata-label">Author:</span>
                        <span className="metadata-value">{book.author}</span>
                    </div>

                    <div className="metadata-item">
                        <span className="metadata-label">Genre:</span>
                        <span className="metadata-value">{book.genre}</span>
                    </div>

                    {/* Tags Display */}
                    {book.tags && book.tags.length > 0 && (
                        <div className="metadata-item flex-col items-start gap-3">
                            <span className="metadata-label">Tags:</span>
                            <div className="tags-container">
                                {book.tags.slice(0, 6).map((tag, i) => (
                                    <span
                                        key={i}
                                        className="tag-chip"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="metadata-item">
                        <span className="metadata-label">Views:</span>
                        <span className="metadata-value">{book.views}</span>
                    </div>

                    <div className="action-buttons">
                        <button
                            className={`action-btn ${book.isLiked ? 'active' : ''}`}
                            onClick={() => handleInteraction("like")}
                        >
                            <ThumbsUp size={18} fill={book.isLiked ? "black" : "none"} />
                            Like ({book.likes})
                        </button>
                        <button
                            className={`action-btn ${book.isDisliked ? 'bg-red-500/20 text-red-400 border-red-500/50' : ''}`}
                            onClick={() => handleInteraction("dislike")}
                        >
                            <ThumbsDown size={18} fill={book.isDisliked ? "currentColor" : "none"} />
                            Dislike
                        </button>
                        <button className="action-btn">
                            <Bookmark size={18} /> Add to List
                        </button>
                        <button className="action-btn danger">
                            <EyeOff size={18} /> Hide
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
