import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    // Generate a unique order number
    const orderNumber = `AERI-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = new Order({
      orderNumber,
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone || "",
        address: body.customer.address,
        city: body.customer.city,
        zipCode: body.customer.zipCode,
        country: body.customer.country,
      },
      items: body.items.map((item: any) => ({
        productId: item.id || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: body.subtotal,
      shipping: body.shipping || 0,
      total: body.total,
      paymentMethod: body.paymentMethod || "PayPal",
      paymentStatus: "Pending", // Set to paid after actual payment integration
      timeline: [{ status: "Pending", note: "Order placed by customer." }],
    });

    await newOrder.save();

    // Send order confirmation to customer
    await sendEmail({
      to: newOrder.customer.email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order <strong>${orderNumber}</strong> has been received and is currently being processed.</p>
        <h3>Order Details:</h3>
        <ul>
          ${newOrder.items.map(item => `<li>${item.quantity}x ${item.name} - €${item.price.toFixed(2)}</li>`).join("")}
        </ul>
        <p><strong>Total:</strong> €${newOrder.total.toFixed(2)}</p>
        <p>We will notify you once your order has been shipped.</p>
      `,
    });

    // Send notification to admin
    await sendEmail({
      to: process.env.SMTP_USER || "contact@aeri-snacks.com",
      subject: `New Order Received - ${orderNumber}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Customer:</strong> ${newOrder.customer.name} (${newOrder.customer.email})</p>
        <p><strong>Total:</strong> €${newOrder.total.toFixed(2)}</p>
        <p>Please check the admin dashboard for more details.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
      orderNumber,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
