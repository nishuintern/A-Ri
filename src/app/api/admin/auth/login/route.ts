import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import dbConnect from "@/lib/db";
import Admin from "@/lib/models/Admin";

const JWT_SECRET = process.env.JWT_SECRET || "aerisnacks-super-secret-key-change-in-production";

export async function POST(req: Request) {
  try {
    // Database connection establish karte hain
    await dbConnect();

    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Admin find karte hain email se
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (admin.status !== "Active") {
      return NextResponse.json({ error: "Account is inactive. Contact Super Admin." }, { status: 403 });
    }

    // Password verify karte hain
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Last login update karte hain
    admin.lastLogin = new Date();
    await admin.save();

    // Determine expiration duration based on rememberMe
    const maxAgeInSeconds = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day
    const expirationTimeStr = rememberMe ? "30d" : "24h";

    // JWT token banate hain `jose` library se
    const secret = new TextEncoder().encode(JWT_SECRET);
    const alg = "HS256";

    const token = await new SignJWT({
      sub: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      name: admin.name,
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime(expirationTimeStr)
      .sign(secret);

    // Response ke sath HttpOnly cookie set karte hain
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAgeInSeconds,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
