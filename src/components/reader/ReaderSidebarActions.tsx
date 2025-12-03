"use client";

import { ThumbsUp, ThumbsDown, Bookmark, EyeOff, Star, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReaderSidebarActionsProps {
    book: any;
    onInteract: (action: "like" | "dislike") => void;
    onRate: (rating: number) => Promise<void> | void;
}

export const ReaderSidebarActions = ({ book, onInteract, onRate }: ReaderSidebarActionsProps) => {
    const router = useRouter();
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [ratingSuccess, setRatingSuccess] = useState(false);

    const handleRateSelect = (score: number) => {
        if (book?.userRating) return;
        setSelectedRating(score);
    };

    const submitRating = async () => {
        if (!selectedRating) return;
        await onRate(selectedRating);
        setRatingSuccess(true);
        setTimeout(() => {
            setRatingSuccess(false);
            setSelectedRating(null);
        }, 2000);
    };

    return (
        <div className="reader-sidebar right">
            <button
                onClick={() => router.back()}
                className="action-btn mb-4"
            >
                <ArrowLeft size={18} /> Back to Details
            </button>

            <div className="action-buttons">
                <button
                    className={`action-btn ${book.isLiked ? 'active' : ''}`}
                    onClick={() => onInteract("like")}
                >
                    <ThumbsUp size={18} fill={book.isLiked ? "black" : "none"} />
                    Like ({book.likes})
                </button>

                <button
                    className={`action-btn ${book.isDisliked ? 'bg-red-500/20 text-red-400 border-red-500/50' : ''}`}
                    onClick={() => onInteract("dislike")}
                >
                    <ThumbsDown size={18} fill={book.isDisliked ? "currentColor" : "none"} />
                    Dislike
                </button>

                <button className="action-btn">
                    <Bookmark size={18} /> Save
                </button>

                <button className="action-btn danger">
                    <EyeOff size={18} /> Hide
                </button>
            </div>

            <div className="rating-container-reader">
                <div className="rating-wrapper-reader">
                    <div className="rating-stars-reader">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={24}
                                className={`transition-colors ${book.userRating ? "cursor-default" : "cursor-pointer"
                                    }`}
                                onClick={() => {
                                    if (!book.userRating) {
                                        handleRateSelect(star);
                                    }
                                }}
                                fill={
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

                    {/* Submit Popup */}
                    {selectedRating && !book.userRating && !ratingSuccess && (
                        <div className="rating-submit-popup-reader">
                            <span className="rating-submit-text-reader">Rate {selectedRating} stars?</span>
                            <button
                                className="rating-submit-btn-reader"
                                onClick={submitRating}
                            >
                                Submit
                            </button>
                        </div>
                    )}

                    {/* Success Popup */}
                    {ratingSuccess && (
                        <div className="rating-submit-popup success">
                            <span className="rating-submit-text text-green-400 font-bold">Saved!</span>
                        </div>
                    )}
                </div>

                <span className="rating-value-reader">
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
    );
};
