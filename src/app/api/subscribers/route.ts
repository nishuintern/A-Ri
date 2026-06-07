import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    
    // Upsert the subscriber
    const newSubscriber = await Subscriber.findOneAndUpdate(
      { email: body.email },
      { 
        $set: { 
          source: body.source || "Newsletter",
          status: "Subscribed" 
        } 
      },
      { upsert: true, new: true }
    );

    // Send email notification to admin (optional, maybe only on first subscribe)
    await sendEmail({
      to: process.env.SMTP_USER || "contact@aeri-snacks.com",
      subject: `New Newsletter Subscriber`,
      html: `
        <h2>New Subscriber</h2>
        <p><strong>Email:</strong> ${newSubscriber.email}</p>
        <p><strong>Source:</strong> ${newSubscriber.source}</p>
      `,
    });

    // Send welcome auto-reply to user
    await sendEmail({
      to: newSubscriber.email,
      subject: `Bienvenue chez AÉRI / Welcome to AÉRI`,
      html: `
        <h2>Bonjour,</h2>
        <p>Merci de vous être inscrit(e) à notre newsletter ! Vous recevrez bientôt nos dernières actualités et offres exclusives.</p>
        <br/>
        <h2>Hello,</h2>
        <p>Thank you for subscribing to our newsletter! You will soon receive our latest news and exclusive offers.</p>
        <br/>
        <p>L'équipe AÉRI / The AÉRI Team</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully",
      subscriberId: newSubscriber._id,
    });
  } catch (error) {
    console.error("Error saving subscriber:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
