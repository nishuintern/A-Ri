import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Setting from "@/lib/models/Setting";

export async function GET() {
  try {
    await connectDB();
    const settings = await Setting.find({});
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error("Fetch Settings Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { settings } = await req.json();

    // settings is an array of { key, value, category }
    for (const s of settings) {
      await Setting.findOneAndUpdate(
        { key: s.key },
        { value: s.value, category: s.category },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json(
      { message: "Settings saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Settings Error:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
