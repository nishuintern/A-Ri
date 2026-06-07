import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Contact from "@/lib/models/Contact";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    
    const newContact = new Contact({
      name: body.name,
      email: body.email,
      subject: body.subject || "No Subject",
      message: body.message,
    });

    await newContact.save();

    // Send email notification to admin
    await sendEmail({
      to: process.env.SMTP_USER || "contact@aeri-snacks.com",
      subject: `New Contact Message: ${newContact.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${newContact.name}</p>
        <p><strong>Email:</strong> ${newContact.email}</p>
        <p><strong>Subject:</strong> ${newContact.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${newContact.message}</p>
      `,
    });

    // Send auto-reply to user
    await sendEmail({
      to: newContact.email,
      subject: `Merci pour votre message / Thank you for your message`,
      html: `
        <h2>Bonjour ${newContact.name},</h2>
        <p>Nous avons bien reçu votre message et nous vous en remercions. Notre équipe vous répondra dans les plus brefs délais.</p>
        <br/>
        <h2>Hello ${newContact.name},</h2>
        <p>We have successfully received your message and thank you for reaching out. Our team will get back to you as soon as possible.</p>
        <br/>
        <p>L'équipe AÉRI / The AÉRI Team</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      contactId: newContact._id,
    });
  } catch (error) {
    console.error("Error saving contact:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
