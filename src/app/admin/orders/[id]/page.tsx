"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, User, MapPin, CreditCard, Clock } from "lucide-react";
import Image from "next/image";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import toast from "react-hot-toast";


type OrderItem = {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type TimelineEvent = {
  _id: string;
  status: string;
  date: string;
  note?: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  timeline: TimelineEvent[];
  createdAt: string;
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Editable fields
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setStatus(data.status);
        setPaymentStatus(data.paymentStatus);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus, trackingNumber }),
      });
      if (res.ok) {
        toast.success("Order updated successfully!");
        fetchOrder();
        setTrackingNumber(""); // Reset tracking input
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#4c463e]">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-red-500">Order not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 rounded-xl bg-white border border-[#e8e0d8] text-[#4c463e] hover:bg-[#faf5ef] hover:text-[#1d1b1a] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1d1b1a]" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
            Order {order.orderNumber}
          </h1>
          <p className="text-sm text-[#4c463e]">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items List */}
          <div className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#1d1b1a] mb-4 flex items-center gap-2">
              <Package size={20} className="text-[#675d4e]" />
              Order Items
            </h2>
            <div className="space-y-4 divide-y divide-[#e8e0d8]">
              {order.items.map((item) => (
                <div key={item._id} className="pt-4 first:pt-0 flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#faf5ef] border border-[#e8e0d8] shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <Package className="absolute inset-0 m-auto text-[#4c463e]/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1d1b1a] truncate">{item.name}</p>
                    <p className="text-sm text-[#4c463e]">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right font-medium text-[#1d1b1a]">
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-[#e8e0d8] space-y-2 text-sm">
              <div className="flex justify-between text-[#4c463e]">
                <span>Subtotal</span>
                <span>€{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#4c463e]">
                <span>Shipping</span>
                <span>€{order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#1d1b1a] text-base pt-2">
                <span>Total</span>
                <span>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#1d1b1a] mb-4 flex items-center gap-2">
              <Clock size={20} className="text-[#675d4e]" />
              Order Timeline
            </h2>
            <div className="space-y-4">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#675d4e] mt-1.5" />
                    {idx !== order.timeline.length - 1 && (
                      <div className="w-px h-full bg-[#e8e0d8] my-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-[#1d1b1a]">{event.status}</p>
                    <p className="text-xs text-[#4c463e]">{new Date(event.date).toLocaleString()}</p>
                    {event.note && <p className="text-sm text-[#4c463e] mt-1 bg-[#faf5ef] p-2 rounded-lg border border-[#e8e0d8]">{event.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Actions */}
        <div className="space-y-6">
          {/* Action / Status Update */}
          <div className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#1d1b1a] mb-4">Update Order</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1d1b1a] mb-1">Order Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1d1b1a] mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              {status === "Shipped" && (
                <div>
                  <label className="block text-sm font-medium text-[#1d1b1a] mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. UPS123456789"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
                  />
                </div>
              )}

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full py-2.5 bg-[#1d1b1a] text-white rounded-xl font-medium hover:bg-[#383330] transition-colors disabled:opacity-50"
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#1d1b1a] mb-2 flex items-center gap-2">
              <User size={20} className="text-[#675d4e]" />
              Customer Details
            </h2>
            <div>
              <p className="font-medium text-[#1d1b1a]">{order.customer.name}</p>
              <p className="text-sm text-[#4c463e]">{order.customer.email}</p>
              {order.customer.phone && <p className="text-sm text-[#4c463e]">{order.customer.phone}</p>}
            </div>

            <div className="pt-4 border-t border-[#e8e0d8]">
              <h3 className="font-medium text-[#1d1b1a] mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-[#675d4e]" />
                Shipping Address
              </h3>
              <p className="text-sm text-[#4c463e]">
                {order.customer.address}<br />
                {order.customer.city}, {order.customer.zipCode}<br />
                {order.customer.country}
              </p>
            </div>

            <div className="pt-4 border-t border-[#e8e0d8]">
              <h3 className="font-medium text-[#1d1b1a] mb-2 flex items-center gap-2">
                <CreditCard size={16} className="text-[#675d4e]" />
                Payment Method
              </h3>
              <p className="text-sm text-[#4c463e]">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
