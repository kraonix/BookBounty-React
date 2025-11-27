import { BookDetails } from "@/features/book-details/components/BookDetails";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getBook(id: string) {
    try {
        await dbConnect();
        const book = await Book.findById(id).lean();
        if (!book) return null;

        // Serialize ObjectId and Date to string
        return JSON.parse(JSON.stringify(book));
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
