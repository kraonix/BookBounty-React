"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { ReaderLayout } from "@/components/reader/ReaderLayout";
import { ReaderSidebarBook } from "@/components/reader/ReaderSidebarBook";
import { ReaderSidebarActions } from "@/components/reader/ReaderSidebarActions";
import { LoginModal } from "@/components/ui/LoginModal";
import { Toast } from "@/components/ui/Toast";

const ReaderPDF = dynamic(() => import("@/components/reader/ReaderPDF").then(mod => mod.ReaderPDF), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center text-[#cae962]">
            Loading Secure Reader...
        </div>
    )
});

export default function ReaderPage() {
    const { bookId } = useParams();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    // Fetch Book Details
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        const fetchBook = async () => {
            try {
                const res = await fetch(`/api/books/${bookId}`);
                const data = await res.json();
                if (data._id) {
                    setBook(data);
                } else {
                    setToast({ message: "Book not found", type: "error" });
                }
            } catch (error) {
                console.error("Failed to fetch book", error);
            } finally {
                setLoading(false);
            }
        };

        if (bookId && status === "authenticated") {
            fetchBook();
        }
    }, [bookId, status, router]);

    // Interaction Handlers (Reused logic)
    const handleInteraction = async (action: "like" | "dislike") => {
        if (!book) return;

        // Optimistic Update
        const prevBook = { ...book };
        const newBook = { ...book };

        if (action === "like") {
            if (book.isLiked) {
                newBook.isLiked = false;
                newBook.likes--;
            } else {
                newBook.isLiked = true;
                newBook.likes++;
                if (book.isDisliked) {
                    newBook.isDisliked = false;
                    newBook.dislikes--;
                }
            }
        } else {
            if (book.isDisliked) {
                newBook.isDisliked = false;
                newBook.dislikes--;
            } else {
                newBook.isDisliked = true;
                newBook.dislikes++;
                if (book.isLiked) {
                    newBook.isLiked = false;
                    newBook.likes--;
                }
            }
        }
        setBook(newBook);

        try {
            await fetch("/api/books/interact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: book._id, action }),
            });
        } catch (error) {
            setBook(prevBook); // Revert
            setToast({ message: "Interaction failed", type: "error" });
        }
    };

    const handleRate = async (rating: number) => {
        if (!book) return;
        const prevBook = { ...book };
        setBook({ ...book, userRating: rating });

        try {
            const res = await fetch("/api/books/rate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: book._id, rating }),
            });
            if (!res.ok) throw new Error();
            setToast({ message: "Rating saved!", type: "success" });
        } catch (error) {
            setBook(prevBook);
            setToast({ message: "Rating failed", type: "error" });
        }
    };

    if (loading) return (
        <div className="h-screen w-screen bg-black flex items-center justify-center text-[#cae962]">
            Loading Reader...
        </div>
    );

    if (!book) return null;

    return (
        <ReaderLayout>
            <ReaderSidebarBook book={book} />

            {/* Secure PDF Viewer */}
            <ReaderPDF url={`/api/books/pdf?id=${book._id}`} />

            <ReaderSidebarActions
                book={book}
                onInteract={handleInteraction}
                onRate={handleRate}
            />

            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </ReaderLayout>
    );
}
