import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Carousel from "@/models/Carousel";
import Book from "@/models/Book"; // Ensure Book model is registered
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const revalidate = 60; // Cache for 60 seconds

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        // Ensure Book model is loaded before populating
        if (!Book) {
            // This block is just to ensure the import is used and model registered
        }

        // Optimize populate: Select only necessary fields
        const slides = await Carousel.find({})
            .populate({
                path: "book",
                select: "title coverImage coverImageUrl description thumbnail thumbnailUrl"
            });

        return NextResponse.json(slides, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
            },
        });
    } catch (error) {
        console.error("Carousel fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch carousel slides" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { bookId } = await req.json();
        if (!bookId) {
            return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
        }

        await dbConnect();

        const count = await Carousel.countDocuments();
        if (count >= 9) {
            return NextResponse.json({ error: "Carousel is full (max 9 slides)" }, { status: 400 });
        }

        const existing = await Carousel.findOne({ book: bookId });
        if (existing) {
            return NextResponse.json({ error: "Book is already in carousel" }, { status: 400 });
        }

        const newSlide = new Carousel({ book: bookId });
        await newSlide.save();

        // Populate for immediate return
        await newSlide.populate("book");

        return NextResponse.json({ message: "Slide added successfully", slide: newSlide }, { status: 201 });
    } catch (error: any) {
        console.error("Carousel add error:", error);
        return NextResponse.json({ error: error.message || "Failed to add slide" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!session || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        await dbConnect();
        await Carousel.findByIdAndDelete(id);
        return NextResponse.json({ message: "Slide deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
    }
}
