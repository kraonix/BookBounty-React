"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import "../carousel.css";

interface Book {
    _id: string;
    title: string;
    coverImage: string;
    coverImageUrl?: string;
    description: string;
}

interface CarouselItem {
    _id: string;
    book: Book;
}

export const HeroCarousel = () => {
    const [slides, setSlides] = useState<CarouselItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await fetch("/api/carousel", { next: { revalidate: 60 } });
                if (res.ok) {
                    const data = await res.json();
                    // Filter out any slides where book might be null (deleted book)
                    const validSlides = data.filter((item: any) => item.book);
                    setSlides(validSlides);
                }
            } catch (error) {
                console.error("Failed to fetch carousel slides", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    const nextSlide = useCallback(() => {
        if (slides.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }
    }, [slides.length]);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide, slides.length]);

    if (loading) {
        return (
            <div className="carousel carousel-skeleton">
                <div className="carousel-slides">
                    {[...Array(1)].map((_, i) => (
                        <div className="carousel-slide loading" key={i}>
                            <div className="skeleton-image shimmer" />
                            <div className="slide-overlay" />
                            <div className="slide-content">
                                <div className="skeleton-title shimmer" />
                                <div className="skeleton-description shimmer" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="carousel-tracker">
                    {[...Array(3)].map((_, i) => (
                        <div className="tracker-dot shimmer" key={i} />
                    ))}
                </div>
            </div>
        );
    }
    if (slides.length === 0) return null;

    return (
        <div className="carousel">
            {/* Slides */}
            <div
                className="carousel-slides"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((item) => (
                    <div key={item._id} className="carousel-slide">
                        <Image
                            src={item.book.coverImageUrl || item.book.coverImage}
                            alt={item.book.title}
                            fill
                            className="slide-image"
                            unoptimized
                        />

                        {/* Gradient Overlay */}
                        <div className="slide-overlay" />

                        {/* Content Overlay */}
                        <div className="slide-content">
                            <h2 className="slide-title">{item.book.title}</h2>
                            <div className="slide-text-box">
                                <h3 className="slide-subtitle">FEATURED</h3>
                                <p className="slide-description">
                                    {item.book.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tracker */}
            <div className="carousel-tracker">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`tracker-dot ${index === currentIndex ? "active" : ""}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
