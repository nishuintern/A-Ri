import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/lib/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const newCategory = new Category(body);
    await newCategory.save();
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("Create Category API Error:", error);
    // Handle duplicate key error
    if (error.code === 11000) {
       return NextResponse.json(
        { error: "A category with this name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
