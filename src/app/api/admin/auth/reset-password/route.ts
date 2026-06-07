import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Admin from "@/lib/models/Admin";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ error: "Email, OTP, and new password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    // Hash the received OTP to match what's stored in the DB
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json({ error: "Invalid email or OTP" }, { status: 400 });
    }

    // Check if OTP matches and is not expired
    if (admin.resetPasswordToken !== hashedOtp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (!admin.resetPasswordExpires || admin.resetPasswordExpires < new Date()) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    if (admin.status !== "Active") {
      return NextResponse.json({ error: "Account is inactive" }, { status: 403 });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update password and clear reset token fields
    admin.passwordHash = passwordHash;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    return NextResponse.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
