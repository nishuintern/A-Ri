import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Coupons API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Ensure dates are parsed correctly
    if (body.validFrom) body.validFrom = new Date(body.validFrom);
    if (body.validUntil) body.validUntil = new Date(body.validUntil);

    const newCoupon = new Coupon(body);
    await newCoupon.save();
    
    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error: any) {
    console.error("Create Coupon API Error:", error);
    if (error.code === 11000) {
       return NextResponse.json(
        { error: "A coupon with this code already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}
