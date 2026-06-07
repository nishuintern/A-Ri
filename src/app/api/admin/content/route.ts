import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Content from "@/lib/models/Content";

export async function GET() {
  try {
    await connectDB();
    const contents = await Content.find({}).sort({ updatedAt: -1 });
    return NextResponse.json({ contents }, { status: 200 });
  } catch (error) {
    console.error("Fetch Content Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    const newContent = await Content.create(data);

    return NextResponse.json(
      { message: "Content created successfully", content: newContent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Content Error:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}
