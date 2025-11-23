import { BookDetails } from "@/features/book-details/components/BookDetails";

interface PageProps {
    params: {
        id: string;
    };
}

export default function BookPage({ params }: PageProps) {
    return <BookDetails id={params.id} />;
}
