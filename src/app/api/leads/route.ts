import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/lib/models/Lead";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    // MongoDB se connect karte hain
    await dbConnect();

    const body = await req.json();
    
    // Naya B2B lead ya waitlist entry banate hain
    const newLead = new Lead({
      company: body.company || "Unknown", // Required fields ko default dete hain agar frontend se kuch miss ho gaya
      siret: body.siret,
      contactName: body.contactName || body.name, // "name" ya "contactName" support dono
      email: body.email,
      phone: body.phone,
      country: body.country || "France",
      quantity: body.quantity || "TBD",
      volume: body.volume,
      channel: body.channel,
      notes: body.notes || "",
    });

    await newLead.save();

    // Send email notification to admin
    await sendEmail({
      to: process.env.SMTP_USER || "contact@aeri-snacks.com",
      subject: `New B2B Lead: ${newLead.company}`,
      html: `
        <h2>New Espace Pro Inquiry</h2>
        <p><strong>Company:</strong> ${newLead.company}</p>
        <p><strong>Contact Name:</strong> ${newLead.contactName}</p>
        <p><strong>Email:</strong> ${newLead.email}</p>
        <p><strong>Phone:</strong> ${newLead.phone || "N/A"}</p>
        <p><strong>SIRET:</strong> ${newLead.siret || "N/A"}</p>
        <p><strong>Country:</strong> ${newLead.country}</p>
        <p><strong>Quantity:</strong> ${newLead.quantity}</p>
        <p><strong>Volume:</strong> ${newLead.volume || "N/A"}</p>
        <p><strong>Channel:</strong> ${newLead.channel || "N/A"}</p>
        <p><strong>Notes:</strong> ${newLead.notes || "N/A"}</p>
      `,
    });

    // Send auto-reply to user
    await sendEmail({
      to: newLead.email,
      subject: `Merci pour votre demande Espace Pro / Thank you for your Pro inquiry`,
      html: `
        <h2>Bonjour ${newLead.contactName},</h2>
        <p>Nous avons bien reçu votre demande concernant l'Espace Pro AÉRI. Notre équipe commerciale étudie votre dossier et vous contactera rapidement.</p>
        <br/>
        <h2>Hello ${newLead.contactName},</h2>
        <p>We have successfully received your AÉRI Pro inquiry. Our sales team is reviewing your details and will get back to you shortly.</p>
        <br/>
        <p>L'équipe AÉRI / The AÉRI Team</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully",
      leadId: newLead._id,
    });
  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

