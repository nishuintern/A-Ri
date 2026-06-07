import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Expecting: { updates: [{ id: "...", stockQuantity: 10 }, ...] }
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const bulkOps = updates.map((update: any) => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: { stockQuantity: update.stockQuantity } }
      }
    }));

    await Product.bulkWrite(bulkOps);

    return NextResponse.json({ success: true, message: "Inventory updated successfully" });
  } catch (error) {
    console.error("Bulk Update Inventory API Error:", error);
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 }
    );
  }
}
