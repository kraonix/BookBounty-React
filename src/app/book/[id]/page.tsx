import { BookDetails } from "@/features/book-details/components/BookDetails";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getBook(id: string) {
    try {
        await dbConnect();
        const book = await Book.findById(id).lean();
        if (!book) return null;

        const session = await getServerSession(authOptions);
        const userId = session?.user ? ((session.user as any).id || session.user.email) : null;

        // Process Likes/Dislikes
        const likes = Array.isArray(book.likes) ? book.likes : [];
        const dislikes = Array.isArray(book.dislikes) ? book.dislikes : [];

        const likesCount = likes.length;
        const dislikesCount = dislikes.length;
        const isLiked = userId ? likes.includes(userId) : false;
        const isDisliked = userId ? dislikes.includes(userId) : false;

        // Process Ratings
        const ratings = Array.isArray(book.ratings) ? book.ratings : [];
        const totalScore = ratings.reduce((acc: number, curr: any) => acc + curr.score, 0);
        const averageRating = ratings.length > 0 ? (totalScore / ratings.length).toFixed(1) : "0";
        const userRating = userId ? ratings.find((r: any) => r.user === userId)?.score || 0 : 0;

        // Serialize
        const serializedBook = JSON.parse(JSON.stringify(book));

        return {
            ...serializedBook,
            likes: likesCount, // Override array with count for client
            dislikes: dislikesCount, // Override array with count for client
            isLiked,
            isDisliked,
            averageRating: parseFloat(averageRating),
            userRating,
            totalRatings: ratings.length
        };
    } catch (error) {
        console.error("Failed to fetch book:", error);
        return null;
    }
}

export default async function BookPage({ params }: PageProps) {
    const { id } = await params;
    const book = await getBook(id);

    return <BookDetails initialBook={book} />;
}
