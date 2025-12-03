import { NextRequest, NextResponse } from "next/server";
import Book from "@/models/Book";
import connectToDatabase from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Book ID required" }, { status: 400 });
        }

        await connectToDatabase();
        const book = await Book.findById(id);

        if (!book || !book.pdf) {
            return NextResponse.json({ error: "Book or PDF not found" }, { status: 404 });
        }

        // Fetch the PDF from the source URL
        const response = await fetch(book.pdf);

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch PDF from source" }, { status: 502 });
        }

        // Stream the PDF back to the client
        const headers = new Headers();
        headers.set("Content-Type", "application/pdf");
        headers.set("Content-Disposition", `inline; filename="${book.title}.pdf"`);
        headers.set("Cache-Control", "private, max-age=3600"); // Cache for 1 hour

        return new NextResponse(response.body, {
            status: 200,
            statusText: "OK",
            headers,
        });

    } catch (error) {
        console.error("PDF Proxy Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
