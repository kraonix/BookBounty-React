"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookCard } from "./BookCard";
import "../book-showcase.css";

interface Book {
    id: number;
    title: string;
    image: string;
}

interface BookSliderProps {
    books: Book[];
}

export const BookSlider = ({ books }: BookSliderProps) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const CARD_WIDTH = 140;
    const GAP = 20;
    const ITEM_WIDTH = CARD_WIDTH + GAP;
    const SLIDE_COUNT = 3;

    const [visibleIndices, setVisibleIndices] = useState<number[]>(
        books.map((_, i) => i)
    );

    const isPrevAction = useRef(false);

    const handleNext = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);

        if (containerRef.current) {
            containerRef.current.style.transition = "transform 0.5s ease-in-out";
            containerRef.current.style.transform = `translateX(-${ITEM_WIDTH * SLIDE_COUNT}px)`;
        }

        setTimeout(() => {
            setVisibleIndices(prev => {
                const newIndices = [...prev];
                const moved = newIndices.splice(0, SLIDE_COUNT);
                return [...newIndices, ...moved];
            });

            if (containerRef.current) {
                containerRef.current.style.transition = "none";
                containerRef.current.style.transform = "translateX(0)";
            }
            setIsAnimating(false);
        }, 500);
    }, [ITEM_WIDTH, isAnimating]);

    const triggerPrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        isPrevAction.current = true;

        setVisibleIndices(prev => {
            const newIndices = [...prev];
            const moved = newIndices.splice(-SLIDE_COUNT, SLIDE_COUNT);
            return [...moved, ...newIndices];
        });
    };

    useEffect(() => {
        if (isPrevAction.current && containerRef.current) {
            containerRef.current.style.transition = "none";
            containerRef.current.style.transform = `translateX(-${ITEM_WIDTH * SLIDE_COUNT}px)`;

            containerRef.current.offsetHeight; // Force reflow

            containerRef.current.style.transition = "transform 0.5s ease-in-out";
            containerRef.current.style.transform = "translateX(0)";

            setTimeout(() => {
                setIsAnimating(false);
                isPrevAction.current = false;
            }, 500);
        }
    }, [visibleIndices, ITEM_WIDTH, SLIDE_COUNT]);

    return (
        <div className="book-slider-container">
            {/* Controls */}
            <button
                onClick={triggerPrev}
                className="slider-btn prev"
                disabled={isAnimating}
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={handleNext}
                className="slider-btn next"
                disabled={isAnimating}
            >
                <ChevronRight size={24} />
            </button>

            {/* Slider Window */}
            <div className="slider-window">
                <div
                    ref={containerRef}
                    className="slider-track"
                    style={{ width: "max-content" }}
                >
                    {visibleIndices.map((index) => {
                        const book = books[index];
                        return (
                            <BookCard
                                key={`${book.id}-${index}`}
                                id={book.id}
                                title={book.title}
                                image={book.image}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
