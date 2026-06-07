import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = body;

    // Verify signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(text.toString())
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Generate a unique order number
    const orderNumber = `AERI-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = new Order({
      orderNumber,
      customer: {
        name: orderDetails.customer.name,
        email: orderDetails.customer.email,
        phone: orderDetails.customer.phone || "",
        address: orderDetails.customer.address,
        city: orderDetails.customer.city,
        zipCode: orderDetails.customer.zipCode,
        country: orderDetails.customer.country,
      },
      items: orderDetails.items.map((item: any) => ({
        productId: item.id || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: orderDetails.subtotal,
      shipping: orderDetails.shipping || 0,
      total: orderDetails.total,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      timeline: [{ status: "Pending", note: "Order placed by customer." }, { status: "Paid", note: "Payment verified via Razorpay." }],
    });

    await newOrder.save();

    // Send order confirmation to customer
    await sendEmail({
      to: newOrder.customer.email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order <strong>${orderNumber}</strong> has been received and payment is successful.</p>
        <h3>Order Details:</h3>
        <ul>
          ${newOrder.items.map((item: any) => `<li>${item.quantity}x ${item.name} - €${item.price.toFixed(2)}</li>`).join("")}
        </ul>
        <p><strong>Total:</strong> €${newOrder.total.toFixed(2)}</p>
        <p>We will notify you once your order has been shipped.</p>
      `,
    });

    // Send notification to admin
    await sendEmail({
      to: process.env.SMTP_USER || "contact@aeri-snacks.com",
      subject: `New Order Received - ${orderNumber} (Paid)`,
      html: `
        <h2>New Order Received (Paid via Razorpay)</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Customer:</strong> ${newOrder.customer.name} (${newOrder.customer.email})</p>
        <p><strong>Total:</strong> €${newOrder.total.toFixed(2)}</p>
        <p>Payment ID: ${razorpay_payment_id}</p>
        <p>Please check the admin dashboard for more details.</p>
      `,
    });

    return NextResponse.json({ success: true, orderNumber });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
