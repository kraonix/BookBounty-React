import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import { Types } from "mongoose";

// Force dynamic to prevent caching issues with auth
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    // 1. Enforce Authentication
    if (!session || !session.user?.email) {
        console.warn("[Rating] Unauthorized attempt");
        return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { bookId, rating } = body;

        // 2. Validate Inputs
        if (!bookId || !rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            console.warn("[Rating] Invalid input:", body);
            return NextResponse.json({ error: "Invalid input parameters. Rating must be 1-5." }, { status: 400 });
        }

        await dbConnect();

        // 3. Schema Auto-Migration (Native Driver)
        // Ensure ratings is an array, not undefined or some other type
        try {
            const objectId = new Types.ObjectId(bookId);
            await Book.collection.updateOne(
                {
                    _id: objectId,
                    ratings: { $not: { $type: "array" } }
                },
                { $set: { ratings: [] } }
            );
        } catch (migrationError) {
            console.error("[Rating] Migration warning:", migrationError);
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        const userId = (session.user as any).id || session.user.email;
        const currentUserId = userId.toString();

        console.log(`[Rating] User ${currentUserId} rating book ${bookId} with ${rating}`);

        // 4. Defensive Defaults (Local Variables)
        let currentRatings = Array.isArray(book.ratings) ? book.ratings : [];

        // 5. Rating Logic (Upsert)
        const existingIndex = currentRatings.findIndex((r: any) => r.user === currentUserId);

        if (existingIndex > -1) {
            // Update existing
            currentRatings[existingIndex].score = rating;
        } else {
            // Add new
            currentRatings.push({ user: currentUserId, score: rating });
        }

        // Update Document
        book.ratings = currentRatings;
        book.markModified('ratings');

        await book.save();

        // 6. Recalculate Average
        const totalScore = currentRatings.reduce((acc: number, curr: any) => acc + curr.score, 0);
        const averageRating = currentRatings.length > 0 ? totalScore / currentRatings.length : 0;

        console.log(`[Rating] Success. New Average: ${averageRating.toFixed(1)} (${currentRatings.length} votes)`);

        // 7. Clear Response Shape
        return NextResponse.json({
            success: true,
            userRating: rating,
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalRatings: currentRatings.length
        });

    } catch (error: any) {
        console.error("[Rating] Critical Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
