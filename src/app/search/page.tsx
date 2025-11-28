"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookCard } from "@/features/book-showcase/components/BookCard";
import { Search, BookOpen } from "lucide-react";
import "./search.css";

interface Book {
    _id: string;
    title: string;
    thumbnail: string;
    author: string;
    likes: number;
    views: number;
}

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/books?search=${query}&limit=50`);
                const data = await res.json();
                if (data.books) {
                    setBooks(data.books);
                }
            } catch (error) {
                console.error("Failed to fetch search results", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchBooks();
        } else {
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="search-page-container container mx-auto px-4">
            <div className="search-header">
                <h1 className="search-title">
                    Search Results for <span className="search-query-highlight">"{query}"</span>
                </h1>
                {!loading && (
                    <p className="search-stats">
                        Found {books.length} {books.length === 1 ? 'book' : 'books'} matching your search
                    </p>
                )}
            </div>

            {loading ? (
                <div className="loading-container">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="skeleton-card shimmer" />
                    ))}
                </div>
            ) : books.length > 0 ? (
                <div className="search-results-grid">
                    {books.map((book) => (
                        <div key={book._id} className="search-result-wrapper">
                            <BookCard
                                id={book._id}
                                title={book.title}
                                image={book.thumbnail}
                                author={book.author}
                                rating={4.5}
                                likes={book.likes}
                                views={book.views}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-results-container">
                    <div className="no-results-icon">
                        <Search size={64} strokeWidth={1.5} />
                    </div>
                    <h2 className="no-results-text">No books found</h2>
                    <p className="no-results-subtext">
                        We couldn't find any matches for "{query}". Try checking for typos or searching for a different title, author, or genre.
                    </p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-24 flex justify-center items-center">
                <div className="text-[#cae962] text-xl font-bold animate-pulse">Loading...</div>
            </div>
        }>
            <SearchResults />
        </Suspense>
    );
}
