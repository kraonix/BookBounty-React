import "@/components/reader/reader.css";

export const ReaderLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="reader-container">
            {children}
        </div>
    );
};
