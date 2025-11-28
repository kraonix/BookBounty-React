/**
 * Book Model
 * 
 * Mongoose schema for the Book entity.
 * 
 * Fields:
 * - title: Book title.
 * - author: Author's name.
 * - description: Brief summary.
 * - genre: Book category (e.g., Fiction, Sci-Fi).
 * - tags: Array of related tags.
 * - thumbnail: Base64 string or URL for the thumbnail.
 * - coverImage: Base64 string or URL for the full cover.
 * - pdf: Base64 string or URL for the book content.
 * - views: View count tracker.
 */
import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title for this book."],
        maxlength: [100, "Title cannot be more than 100 characters"],
    },
    thumbnail: {
        type: String, // Base64
        required: [true, "Please provide a thumbnail image."],
    },
    coverImage: {
        type: String, // Base64
        required: [true, "Please provide a cover image."],
    },
    author: {
        type: String,
        required: [true, "Please provide an author name."],
    },
    description: {
        type: String,
        required: [true, "Please provide a description."],
    },
    genre: {
        type: String,
        required: [true, "Please provide a genre."],
        index: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    pdf: {
        type: String, // Base64
        required: [true, "Please provide the book PDF."],
    },
    likes: {
        type: [String], // Array of User IDs
        default: [],
    },
    dislikes: {
        type: [String], // Array of User IDs
        default: [],
    },
    ratings: {
        type: [{
            user: String, // User ID
            score: Number, // 1-5
        }],
        default: [],
    },
    saved: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
