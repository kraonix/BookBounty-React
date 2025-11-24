/**
 * User Model
 * 
 * Mongoose schema for the User entity.
 * 
 * Fields:
 * - name: User's display name.
 * - email: User's email address (unique).
 * - password: Hashed password (optional for OAuth users).
 * - image: Profile picture URL.
 * - role: 'user' or 'admin' (default: 'user').
 * - provider: Auth provider (e.g., 'credentials', 'google').
 */
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name for this user."],
        maxlength: [60, "Name cannot be more than 60 characters"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email address for this user."],
        unique: true,
    },
    password: {
        type: String,
        // Not required if using OAuth (Google)
        required: false,
    },
    image: {
        type: String,
    },
    provider: {
        type: String,
        default: "credentials",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
}, { timestamps: true });

// Prevent Mongoose model recompilation error in development
// Delete the model if it exists to ensure new schema is picked up
if (process.env.NODE_ENV === "development") {
    delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model("User", UserSchema);
