import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Carousel from "@/models/Carousel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Find the most recently updated slide
        const latestSlide = await Carousel.findOne().sort({ updatedAt: -1 }).select("updatedAt");

        // If no slides, return null or a default timestamp
        const lastModified = latestSlide ? latestSlide.updatedAt : new Date(0);

        return NextResponse.json({ lastModified });
    } catch (error) {
        console.error("Carousel check error:", error);
        return NextResponse.json({ error: "Failed to check carousel version" }, { status: 500 });
    }
}
