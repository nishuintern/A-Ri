import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectDB();
    const customers = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ customers }, { status: 200 });
  } catch (error) {
    console.error("Fetch Customers Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
