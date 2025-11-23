import { BookSlider } from "./BookSlider";
import "../book-showcase.css";

interface BookSectionProps {
    title: string;
    genre: string;
}

// Mock data generator
const generateBooks = (genre: string) => {
    return Array.from({ length: 25 }).map((_, i) => ({
        id: i + 1,
        title: `${genre} Book ${i + 1}`,
        image: `/placeholder-book-${i}.jpg`,
    }));
};

export const BookSection = ({ title, genre }: BookSectionProps) => {
    const books = generateBooks(genre);

    return (
        <section className="book-section">
            <h2 className="section-title">
                {title}
            </h2>

            <BookSlider books={books} />
        </section>
    );
};
