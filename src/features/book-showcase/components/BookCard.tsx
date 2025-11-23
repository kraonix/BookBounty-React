import Image from "next/image";
import Link from "next/link";
import "../book-showcase.css";

interface BookCardProps {
    title: string;
    image: string;
    id: number;
}

export const BookCard = ({ title, image, id }: BookCardProps) => {
    return (
        <div className="book-card">
            <div className="book-image-wrapper">
                <Image
                    src="/book-placeholder.png"
                    alt={title}
                    width={140}
                    height={210}
                    className="book-image"
                    unoptimized
                />
                <div className="book-overlay" />
            </div>
            <Link href={`/book/${id}`} className="book-title">
                {title}
            </Link>
        </div>
    );
};
