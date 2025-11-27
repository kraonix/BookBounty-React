import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";

export async function POST(req: NextRequest) {
    try {
        const { bookId } = await req.json();

        if (!bookId) {
            return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
        }

        await dbConnect();

        // Increment views atomically
        await Book.findByIdAndUpdate(bookId, { $inc: { views: 1 } });

        return NextResponse.json({ message: "View counted" });
    } catch (error) {
        console.error("Failed to increment view", error);
        return NextResponse.json({ error: "Failed to count view" }, { status: 500 });
    }
}
