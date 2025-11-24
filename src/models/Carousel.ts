import mongoose from "mongoose";

const CarouselSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
        unique: true, // Prevent same book being added twice
    },
}, { timestamps: true });

// Force model recompilation in development to handle schema changes
if (process.env.NODE_ENV === "development") {
    delete mongoose.models.Carousel;
}

export default mongoose.models.Carousel || mongoose.model("Carousel", CarouselSchema);
