"use client";

import Image from "next/image";
import { Play, Star, ThumbsUp, ThumbsDown, Bookmark, EyeOff } from "lucide-react";
import "../book-details.css";

interface BookDetailsProps {
    id: string;
}

export const BookDetails = ({ id }: BookDetailsProps) => {
    // Mock data - in a real app, fetch based on ID
    const book = {
        title: "Attack on Titan: Lost Girls",
        author: "Hajime Isayama",
        description: "The stories are about two female characters in the series: Mikasa Ackerman and Annie Leonhart. \"Lost in the cruel world\" is about Mikasa and her relationship with Eren, featuring a vision in an alternative universe where her parents weren't murdered.",
        rating: 4.5,
        genre: "Manga",
        views: "1.2M",
        uploadDate: "2023-11-15",
        image: "https://placehold.co/300x450?text=Attack+on+Titan&bg=1a1a1a&color=cae962"
    };

    return (
        <div className="book-details-container">
            <div className="book-details-content">
                {/* Left Column - 20% */}
                <div className="details-left">
                    <div className="book-cover-wrapper">
                        <Image
                            src={book.image}
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

                    <button className="read-now-btn">
                        <Play fill="black" size={20} />
                        Read Now
                    </button>

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
                                    fill={star <= Math.floor(book.rating) ? "#cae962" : "none"}
                                    stroke={star <= Math.floor(book.rating) ? "#cae962" : "#6b7280"}
                                />
                            ))}
                        </div>
                        <span className="rating-value">{book.rating}/5</span>
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
                            <ThumbsUp size={18} /> Like
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
