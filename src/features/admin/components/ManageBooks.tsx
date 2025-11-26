/**
 * Manage Books Component
 * 
 * A table view for listing and managing existing books.
 * 
 * Features:
 * - Fetches and displays a list of books.
 * - Allows deletion of books.
 * - Shows book details like Title, Author, Genre, and Views.
 */
"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string;
    views: number;
}

export const ManageBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            const res = await fetch("/api/books?limit=100");
            const data = await res.json();
            if (data.books) {
                setBooks(data.books);
            }
        } catch (error) {
            console.error("Failed to fetch books", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this book?")) return;

        try {
            const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
            if (res.ok) {
                setBooks(prev => prev.filter(b => b._id !== id));
            } else {
                alert("Failed to delete book");
            }
        } catch (error) {
            alert("Error deleting book");
        }
    };

    if (loading) return <div>Loading books...</div>;

    return (
        <div className="content-panel" style={{ maxWidth: "100%" }}>
            <div className="panel-header">
                <h2 className="panel-title">Manage Books</h2>
                <p className="panel-subtitle">View and manage all books in the library.</p>
            </div>

            <div className="books-table-container">
                <table className="books-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Genre</th>
                            <th>Views</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-500 py-8">No books found.</td>
                            </tr>
                        ) : (
                            books.map(book => (
                                <tr key={book._id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.genre}</td>
                                    <td>{book.views}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(book._id)}
                                            className="action-btn delete"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
