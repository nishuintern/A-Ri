import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await connectDB();
    const order = await Order.findById(resolvedParams.id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Fetch Order API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await connectDB();
    const body = await request.json();
    
    const { status, paymentStatus, trackingNumber } = body;

    const order = await Order.findById(resolvedParams.id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update fields if provided
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    // Add timeline entry for status update
    if (status) {
       order.timeline.push({
         status,
         date: new Date(),
         note: trackingNumber ? `Tracking: ${trackingNumber}` : "Status updated by admin"
       });
    }

    await order.save();

    return NextResponse.json(order);
  } catch (error) {
    console.error("Update Order API Error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
