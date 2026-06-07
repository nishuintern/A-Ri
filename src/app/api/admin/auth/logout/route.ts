import { NextResponse } from "next/server";

export async function POST() {
  // Response object banate hain
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

  // Cookie delete karte hain token hatane ke liye
  response.cookies.delete("admin_token");

  return response;
}
