import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Only return products that are marked as "Active"
    const products = await Product.find({ status: "Active" }).sort({ createdAt: 1 });
    
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching public products:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}
