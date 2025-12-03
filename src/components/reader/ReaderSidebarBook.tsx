import Image from "next/image";

interface ReaderSidebarBookProps {
    book: {
        title: string;
        author: string;
        thumbnail: string;
    };
}

export const ReaderSidebarBook = ({ book }: ReaderSidebarBookProps) => {
    return (
        <div className="reader-sidebar">
            <div className="book-cover-wrapper">
                <Image
                    src={book.thumbnail}
                    alt={book.title}
                    fill
                    className="reader-book-cover"
                    unoptimized
                />
            </div>
            <h2 className="reader-book-title">{book.title}</h2>
            <p className="reader-book-author">by {book.author}</p>
        </div>
    );
};
