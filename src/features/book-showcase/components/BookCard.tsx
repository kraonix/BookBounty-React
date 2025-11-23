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
        <Link href={`/book/${id}`} className="book-card-link">
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
                <div className="book-title">
                    {title}
                </div>
            </div>
        </Link>
    );
};
