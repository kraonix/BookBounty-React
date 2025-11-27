import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const revalidate = 3600; // Cache for 3600 seconds

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");
    const limit = parseInt(searchParams.get("limit") || "15");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    try {
        await dbConnect();
        const query: any = {};
        if (genre) {
            query.genre = genre;
        }

        // Optimize query: Select only necessary fields, exclude heavy Base64 (pdf, coverImage)
        const books = await Book.find(query)
            .select("title thumbnail author genre _id views likes")
            .sort({ views: -1 }) // Sort by views descending
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments(query);

        return NextResponse.json(
            { books, total, page, totalPages: Math.ceil(total / limit) },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
                },
            }
        );
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await req.json();
        await dbConnect();

        const newBook = new Book(body);
        await newBook.save();

        return NextResponse.json({ message: "Book created successfully", book: newBook }, { status: 201 });
    } catch (error) {
        console.error("Error creating book:", error);
        return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
    }
}
