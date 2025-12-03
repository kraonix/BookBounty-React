"use client";

import { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ReaderPDFProps {
    url: string;
}

export const ReaderPDF = ({ url }: ReaderPDFProps) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState(true);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
    };

    const changePage = (offset: number) => {
        setPageNumber((prevPageNumber) => {
            const newPage = prevPageNumber + offset;
            return Math.max(1, Math.min(newPage, numPages));
        });
    };

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
            changePage(-1);
        } else if (event.key === "ArrowRight") {
            changePage(1);
        }
    }, [numPages]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    // Anti-piracy: Disable context menu
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div
            className="reader-main"
            onContextMenu={handleContextMenu}
        >
            <div className="pdf-container">
                {/* Navigation Zones */}
                <div
                    className="nav-zone left"
                    onClick={() => changePage(-1)}
                    title="Previous Page"
                />
                <div
                    className="nav-zone right"
                    onClick={() => changePage(1)}
                    title="Next Page"
                />

                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex flex-col items-center gap-2 text-[#cae962]">
                            <Loader2 className="animate-spin" size={40} />
                            <span>Loading Secure PDF...</span>
                        </div>
                    }
                    error={
                        <div className="text-red-500">
                            Failed to load PDF. Please try again.
                        </div>
                    }
                    className="flex justify-center items-center"
                >
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false} // Disable text selection
                        renderAnnotationLayer={false} // Disable links/annotations
                        height={window.innerHeight * 0.9}
                        className="shadow-2xl"
                        loading=""
                    />
                </Document>

                {/* Security Overlay (Extra layer) */}
                <div className="security-overlay" />
            </div>

            {/* Page Indicator */}
            {numPages > 0 && (
                <div className="page-indicator">
                    Page {pageNumber} of {numPages}
                </div>
            )}
        </div>
    );
};
