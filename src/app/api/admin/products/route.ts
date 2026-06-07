import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";

/* GET - Saare products fetch karo */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/* POST - Naya product create karo */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    /* Check karo ki slug ya SKU duplicate toh nahi */
    const existing = await Product.findOne({
      $or: [{ slug: body.slug }, { sku: body.sku }],
    });

    if (existing) {
      return NextResponse.json(
        { error: "Product with this slug or SKU already exists" },
        { status: 400 }
      );
    }

    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
