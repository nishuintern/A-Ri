import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      // Do not reveal if email exists or not to prevent user enumeration attacks
      return NextResponse.json({ success: true, message: "OTP sent if account exists" });
    }

    if (admin.status !== "Active") {
      // Don't allow password resets for inactive accounts
      return NextResponse.json({ success: true, message: "OTP sent if account exists" });
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash it before saving to DB
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    
    // Set expiry to 10 minutes from now
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000);

    admin.resetPasswordToken = hashedOtp;
    admin.resetPasswordExpires = resetExpires;
    await admin.save();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-w-md; margin: 0 auto; color: #1d1b1a;">
        <h1 style="text-align: center; letter-spacing: 2px; color: #1d1b1a;">AÉRI</h1>
        <h2 style="color: #1d1b1a;">Admin Password Reset OTP</h2>
        <p>Hello ${admin.name},</p>
        <p>You requested a password reset for your Aéri admin account.</p>
        <p>Please use the following 6-digit OTP to reset your password. This code will expire in 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #f4f4f4; border: 1px solid #e8e0d8; color: #1d1b1a; padding: 15px 30px; border-radius: 6px; font-weight: bold; font-size: 24px; letter-spacing: 5px; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    `;

    await sendEmail({
      to: admin.email,
      subject: "Aéri Admin - Your Password Reset OTP",
      html: emailHtml,
    });

    return NextResponse.json({ success: true, message: "OTP sent if account exists" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
