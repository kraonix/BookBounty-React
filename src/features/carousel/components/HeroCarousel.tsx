"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import "../carousel.css";

interface CarouselItem {
    id: number;
    image: string;
    title: string;
    text: string;
}

// Mock data
const CAROUSEL_ITEMS: CarouselItem[] = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    image: `https://placehold.co/1920x600?text=Spotlight+${i + 1}&bg=1a1a1a&color=cae962`,
    title: `Spotlight #${i + 1}`,
    text: "Welcome to BookBounty, your digital sanctuary where the magic of storytelling awaits. With an extensive array of books spanning genres and authors, embark on a journey through worlds both familiar and fantastical.",
}));

export const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <div className="carousel">
            {/* Slides */}
            <div
                className="carousel-slides"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {CAROUSEL_ITEMS.map((item) => (
                    <div key={item.id} className="carousel-slide">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="slide-image"
                            unoptimized
                        />

                        {/* Gradient Overlay */}
                        <div className="slide-overlay" />

                        {/* Content Overlay */}
                        <div className="slide-content">
                            <h2 className="slide-title">{item.title}</h2>
                            <div className="slide-text-box">
                                <h3 className="slide-subtitle">WELCOME !</h3>
                                <p className="slide-description">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tracker */}
            <div className="carousel-tracker">
                {CAROUSEL_ITEMS.map((_, index) => (
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
