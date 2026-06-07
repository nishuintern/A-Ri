import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Admin from "@/lib/models/Admin";

// SECURITY WARNING: In production, this route should be removed or strictly protected
// with a very strong environment variable token to prevent unauthorized admin creation.
export async function POST(req: Request) {
  try {
    const { email, password, name, setupToken } = await req.json();

    // Check environment variable for secure setup (optional but recommended)
    const expectedToken = process.env.SETUP_TOKEN || "aerisnacks2025";
    if (setupToken !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name required" }, { status: 400 });
    }

    await dbConnect();

    // Check if an admin already exists to prevent duplicate creation
    const existingAdminCount = await Admin.countDocuments();
    if (existingAdminCount > 0 && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Admins already exist. Setup closed." }, { status: 403 });
    }

    // Check specific email
    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the super admin
    const newAdmin = new Admin({
      email: email.toLowerCase(),
      name,
      passwordHash,
      role: "Super Admin",
      status: "Active",
    });

    await newAdmin.save();

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      user: {
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
