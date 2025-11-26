/**
 * Add Book Form Component
 * 
 * A form for admins to upload new books to the database.
 * 
 * Features:
 * - Inputs for book details (Title, Author, Genre, etc.).
 * - File upload for Thumbnail, Cover Image, and PDF.
 * - Client-side validation for file sizes.
 * - Converts files to Base64 before sending to the API.
 */
"use client";

import { useState } from "react";
import { convertFileToBase64 } from "@/utils/fileUtils";
import { Upload, FileText, Image as ImageIcon } from "lucide-react";
import "../admin.css";

export const AddBookForm = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        genre: "Fiction",
        tags: "",
    });
    const [files, setFiles] = useState<{
        thumbnail: File | null;
        coverImage: File | null;
        pdf: File | null;
    }>({
        thumbnail: null,
        coverImage: null,
        pdf: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "thumbnail" | "coverImage" | "pdf") => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Size validation
            if (type === "pdf") {
                if (file.size > 5 * 1024 * 1024) {
                    alert("PDF must be less than 5MB");
                    return;
                }
            } else {
                if (file.size > 2 * 1024 * 1024) {
                    alert("Image must be less than 2MB");
                    return;
                }
            }
            setFiles(prev => ({ ...prev, [type]: file }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (!files.thumbnail || !files.coverImage || !files.pdf) {
                throw new Error("Please upload all required files");
            }

            const thumbnailBase64 = await convertFileToBase64(files.thumbnail);
            const coverImageBase64 = await convertFileToBase64(files.coverImage);
            const pdfBase64 = await convertFileToBase64(files.pdf);

            const payload = {
                ...formData,
                tags: formData.tags.split(",").map(t => t.trim()),
                thumbnail: thumbnailBase64,
                coverImage: coverImageBase64,
                pdf: pdfBase64,
            };

            const res = await fetch("/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to add book");

            setMessage("Book added successfully!");
            setFormData({ title: "", author: "", description: "", genre: "Fiction", tags: "" });
            setFiles({ thumbnail: null, coverImage: null, pdf: null });
        } catch (error: any) {
            setMessage(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-panel">
            <div className="panel-header">
                <h2 className="panel-title">Add New Book</h2>
                <p className="panel-subtitle">Upload a new book to the library.</p>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Inputs */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    placeholder="Book Title"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Author</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    placeholder="Author Name"
                                    value={formData.author}
                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Genre</label>
                                <select
                                    className="form-select"
                                    value={formData.genre}
                                    onChange={e => setFormData({ ...formData, genre: e.target.value })}
                                >
                                    <option value="Fiction">Fiction</option>
                                    <option value="Non-Fiction">Non-Fiction</option>
                                    <option value="Manga">Manga</option>
                                    <option value="Horror">Horror</option>
                                    <option value="Sci-Fi">Sci-Fi</option>
                                    <option value="Fantasy">Fantasy</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tags</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Adventure"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                required
                                rows={5}
                                className="form-textarea"
                                placeholder="Book Description..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Right Column: Files */}
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                            <div className="form-group h-full">
                                <label className="form-label">Thumbnail</label>
                                <div className="file-upload-wrapper h-[calc(100%-1.5rem)]">
                                    <label className="file-upload-label">
                                        <ImageIcon size={20} />
                                        <span className="text-xs text-center">{files.thumbnail ? files.thumbnail.name : "Choose File"}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required={!files.thumbnail}
                                            onChange={e => handleFileChange(e, "thumbnail")}
                                            className="file-upload-input"
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="form-group h-full">
                                <label className="form-label">Cover</label>
                                <div className="file-upload-wrapper h-[calc(100%-1.5rem)]">
                                    <label className="file-upload-label">
                                        <ImageIcon size={20} />
                                        <span className="text-xs text-center">{files.coverImage ? files.coverImage.name : "Choose File"}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required={!files.coverImage}
                                            onChange={e => handleFileChange(e, "coverImage")}
                                            className="file-upload-input"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Book PDF</label>
                            <div className="file-upload-wrapper">
                                <label className="file-upload-label py-3 min-h-[auto]">
                                    <FileText size={20} />
                                    <span className="text-xs">{files.pdf ? files.pdf.name : "Choose PDF File"}</span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        required={!files.pdf}
                                        onChange={e => handleFileChange(e, "pdf")}
                                        className="file-upload-input"
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="save-btn mt-auto w-full flex justify-center"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Upload className="animate-spin" size={16} /> Uploading...
                                </span>
                            ) : (
                                "Add Book"
                            )}
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`mt-4 p-3 rounded text-center text-sm ${message.includes("success") ? "bg-green-900/50 text-green-200 border border-green-800" : "bg-red-900/50 text-red-200 border border-red-800"}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

