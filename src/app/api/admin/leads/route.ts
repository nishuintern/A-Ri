import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/lib/models/Lead";

// GET sabhi leads laane ke liye
export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Naye leads pehle dikhenge
    const leads = await Lead.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

// PUT lead status ya notes update karne ke liye
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Lead updated successfully",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
