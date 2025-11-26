import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await dbConnect();
        const book = await Book.findById(id);

        if (!book) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        // Increment views (happens even if cached response is served by CDN, but here we force dynamic so it runs)
        // With revalidate=60, this might run less frequently, which is acceptable for view counts.
        book.views += 1;
        await book.save();

        return NextResponse.json(book, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
            },
        });
    } catch (error) {
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
