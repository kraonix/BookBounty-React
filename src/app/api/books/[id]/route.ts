import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await dbConnect();
        const book = await Book.findById(id);

        if (!book) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        const session = await getServerSession(authOptions);
        let isLiked = false;
        let isDisliked = false;
        let userRating = null;

        if (session && session.user) {
            const userId = (session.user as any).id || session.user.email;
            isLiked = book.likes.includes(userId);
            isDisliked = book.dislikes.includes(userId);
            const ratingObj = book.ratings.find((r: any) => r.user === userId);
            if (ratingObj) {
                userRating = ratingObj.score;
            }
        }

        const totalRatings = book.ratings.length;
        const averageRating = totalRatings > 0
            ? (book.ratings.reduce((acc: number, curr: any) => acc + curr.score, 0) / totalRatings).toFixed(1)
            : 0;

        const bookData = {
            ...book.toObject(),
            likes: book.likes.length,
            dislikes: book.dislikes.length,
            isLiked,
            isDisliked,
            userRating,
            averageRating: Number(averageRating),
            totalRatings
        };

        return NextResponse.json(bookData, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error("Error fetching book:", error);
        return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        await dbConnect();
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Book deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await req.json();
        await dbConnect();
        const updatedBook = await Book.findByIdAndUpdate(id, body, { new: true });

        if (!updatedBook) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
    }
}
