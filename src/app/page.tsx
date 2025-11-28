/**
 * Home Page
 * 
 * The main landing page of the application.
 * It integrates the Hero Carousel and dynamic Book Sections.
 * 
 * Features:
 * - Hero Carousel: Displays featured books.
 * - Book Sections: Displays books by genre (Fiction, Sci-Fi, etc.).
 */
"use client";
import { useEffect, useState } from "react";
import { HeroCarousel } from "@/features/carousel/components/HeroCarousel";
import { BookSection } from "@/features/book-showcase/components/BookSection";

const GENRES = [
  { title: "Mangas", genre: "Manga" },
  { title: "Fictions", genre: "Fiction" },
  { title: "Non-Fictions", genre: "Non-Fiction" },
  { title: "Fantasy", genre: "Fantasy" },
  { title: "Sci-Fi", genre: "Sci-Fi" },
  { title: "Mystery", genre: "Mystery" },
  { title: "Horror", genre: "Horror" },
];

export default function Home() {
  const [orderedGenres, setOrderedGenres] = useState(GENRES);

  useEffect(() => {
    // Shuffle genres on mount
    const shuffled = [...GENRES].sort(() => Math.random() - 0.5);
    setOrderedGenres(shuffled);
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <HeroCarousel />

      <div className="container mx-auto px-4 mt-12 space-y-8">
        {/* Most Popular Section - Always on top */}
        <BookSection title="Most Popular" />

        {/* Randomized Genre Sections */}
        {orderedGenres.map((g) => (
          <BookSection key={g.genre} title={g.title} genre={g.genre} />
        ))}
      </div>
    </div>
  );
}
