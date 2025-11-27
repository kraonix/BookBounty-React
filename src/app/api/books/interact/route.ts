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
        console.warn("[Interaction] Unauthorized attempt");
        return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { bookId, action } = body;

        // 2. Validate Inputs
        if (!bookId || !action || !["like", "dislike"].includes(action)) {
            console.warn("[Interaction] Invalid input:", body);
            return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 });
        }

        await dbConnect();

        // 3. Schema Auto-Migration (Native Driver)
        // Fix legacy data (Number -> Array) before Mongoose hydration
        try {
            const objectId = new Types.ObjectId(bookId);
            await Book.collection.updateOne(
                {
                    _id: objectId,
                    $or: [
                        { likes: { $not: { $type: "array" } } },
                        { dislikes: { $not: { $type: "array" } } }
                    ]
                },
                { $set: { likes: [], dislikes: [] } }
            );
        } catch (migrationError) {
            console.error("[Interaction] Migration warning:", migrationError);
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        const userId = (session.user as any).id || session.user.email;
        const currentUserId = userId.toString();

        console.log(`[Interaction] User ${currentUserId} performing ${action} on book ${bookId}`);

        // 4. Defensive Defaults (Local Variables)
        // Never trust Mongoose getters for mixed types
        let likesStrings: string[] = (Array.isArray(book.likes) ? book.likes : []).map((id: any) => id.toString());
        let dislikesStrings: string[] = (Array.isArray(book.dislikes) ? book.dislikes : []).map((id: any) => id.toString());

        const isLiked = likesStrings.includes(currentUserId);
        const isDisliked = dislikesStrings.includes(currentUserId);

        // 5. Mutually Exclusive Vote Logic
        if (action === "like") {
            if (isLiked) {
                // Toggle off
                likesStrings = likesStrings.filter(id => id !== currentUserId);
            } else {
                // Toggle on
                likesStrings.push(currentUserId);
                // Remove from dislikes if present
                if (isDisliked) {
                    dislikesStrings = dislikesStrings.filter(id => id !== currentUserId);
                }
            }
        } else if (action === "dislike") {
            if (isDisliked) {
                // Toggle off
                dislikesStrings = dislikesStrings.filter(id => id !== currentUserId);
            } else {
                // Toggle on
                dislikesStrings.push(currentUserId);
                // Remove from likes if present
                if (isLiked) {
                    likesStrings = likesStrings.filter(id => id !== currentUserId);
                }
            }
        }

        // Update Document
        book.likes = likesStrings;
        book.dislikes = dislikesStrings;

        book.markModified('likes');
        book.markModified('dislikes');

        await book.save();

        console.log(`[Interaction] Success. New Likes: ${likesStrings.length}, Dislikes: ${dislikesStrings.length}`);

        // 6. Clear Response Shape
        return NextResponse.json({
            success: true,
            likes: likesStrings.length,
            dislikes: dislikesStrings.length,
            isLiked: likesStrings.includes(currentUserId),
            isDisliked: dislikesStrings.includes(currentUserId)
        });

    } catch (error: any) {
        console.error("[Interaction] Critical Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
