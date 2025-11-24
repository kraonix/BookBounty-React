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
import { HeroCarousel } from "@/features/carousel/components/HeroCarousel";
import { BookSection } from "@/features/book-showcase/components/BookSection";

export default function Home() {
  return (
    <div className="min-h-screen pb-20">
      <HeroCarousel />

      <div className="container mx-auto px-4 mt-12 space-y-8">
        <BookSection title="Mangas" genre="Manga" />
        <BookSection title="Fictions" genre="Fiction" />
        <BookSection title="Non-Fictions" genre="Non-Fiction" />
        <BookSection title="Fantasy" genre="Fantasy" />
        <BookSection title="Sci-Fi" genre="Sci-Fi" />
        <BookSection title="Horror" genre="Horror" />
      </div>
    </div>
  );
}
