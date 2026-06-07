import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/lib/models/Review";

export async function GET() {
  try {
    await connectDB();
    // Assuming Product and User models are registered, we populate them to get names
    const reviews = await Review.find({})
      .populate("product", "name images")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
      
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
