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

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Play, Star, ThumbsUp, ThumbsDown, Bookmark, EyeOff, Download } from "lucide-react";
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
}

export const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await fetch(`/api/books/${id}`, { next: { revalidate: 60 } });
                const data = await res.json();
                if (data._id) {
                    setBook(data);
                }
            } catch (error) {
                console.error("Failed to fetch book", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchBook();
    }, [id]);

    if (loading) return <div className="min-h-screen text-white flex items-center justify-center">Loading...</div>;
    if (!book) return <div className="min-h-screen text-white flex items-center justify-center">Book not found</div>;

    // Mock rating for now as it's not in the DB schema yet
    const rating = 4.5;

    return (
        <div className="book-details-container">
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
                    {/* Added Download Button to Left Column to match previous functionality if desired, or keep it hidden if strictly following user's CSS/Layout which didn't have it explicitly in the snippet but had action buttons */}
                    <div className="action-buttons w-full" style={{ marginTop: '1rem' }}>
                        <a
                            href={book.pdf}
                            download={`${book.title}.pdf`}
                            className="action-btn"
                            style={{ justifyContent: 'center', width: '100%' }}
                        >
                            <Download size={20} />
                            Download PDF
                        </a>
                    </div>
                </div>

                {/* Middle Column - 60% */}
                <div className="details-middle">
                    <h1 className="book-title-large">{book.title}</h1>

                    <a href={book.pdf} target="_blank" rel="noopener noreferrer" className="read-now-btn no-underline">
                        <Play fill="black" size={20} />
                        Read Now
                    </a>

                    <div className="description-box">
                        <p className="description-text">
                            {book.description}
                        </p>
                    </div>

                    <div className="rating-container">
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={24}
                                    fill={star <= Math.floor(rating) ? "#cae962" : "none"}
                                    stroke={star <= Math.floor(rating) ? "#cae962" : "#6b7280"}
                                />
                            ))}
                        </div>
                        <span className="rating-value">{rating}/5</span>
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

                    <div className="metadata-item">
                        <span className="metadata-label">Views:</span>
                        <span className="metadata-value">{book.views}</span>
                    </div>

                    <div className="action-buttons">
                        <button className="action-btn">
                            <ThumbsUp size={18} /> Like ({book.likes})
                        </button>
                        <button className="action-btn">
                            <ThumbsDown size={18} /> Dislike
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
