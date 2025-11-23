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
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
