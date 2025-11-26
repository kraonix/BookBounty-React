import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const user = await User.findOne({ email: session.user.email }).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, bio, phone, image } = body;

        await dbConnect();

        // Build update object with only allowed fields
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (phone !== undefined) updateData.phone = phone;
        if (image !== undefined) updateData.image = image;

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
