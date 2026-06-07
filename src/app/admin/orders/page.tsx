"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Filter, Download } from "lucide-react";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";


type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export default function OrdersPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
      case "Packed":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-indigo-100 text-indigo-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
      case "Refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-600 bg-green-50";
      case "Pending":
        return "text-yellow-600 bg-yellow-50";
      case "Failed":
      case "Refunded":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[#1d1b1a] mb-1"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {isFrench ? "Commandes" : "Orders"}
          </h1>
          <p className="text-sm text-[#4c463e]">{isFrench ? "Gérez les commandes des clients et l'exécution." : "Manage customer orders and fulfillment."}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8e0d8] text-[#1d1b1a] rounded-full text-sm font-medium hover:bg-[#faf5ef] transition-colors">
            <Filter size={16} />
            {isFrench ? "Filtrer" : "Filter"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1d1b1a] text-[#fef8f6] rounded-full text-sm font-medium hover:bg-[#383330] transition-colors">
            <Download size={16} />
            {isFrench ? "Exporter" : "Export"}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8e0d8] flex items-center gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c463e]/50"
          />
          <input
            type="text"
            placeholder={isFrench ? "Rechercher par numéro de commande ou nom du client..." : "Search by order number or customer name..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#faf5ef] border-b border-[#e8e0d8] text-[#4c463e]">
              <tr>
                <th className="px-6 py-4 font-medium">{isFrench ? "ID de commande" : "Order ID"}</th>
                <th className="px-6 py-4 font-medium">{isFrench ? "Client" : "Customer"}</th>
                <th className="px-6 py-4 font-medium">{isFrench ? "Date" : "Date"}</th>
                <th className="px-6 py-4 font-medium">{isFrench ? "Paiement" : "Payment"}</th>
                <th className="px-6 py-4 font-medium">{isFrench ? "Statut" : "Status"}</th>
                <th className="px-6 py-4 font-medium">{isFrench ? "Total" : "Total"}</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d8]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-0 border-0">
                    <SkeletonLoader type="table" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#4c463e]">
                    {isFrench ? "Aucune commande trouvée." : "No orders found."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#faf5ef]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#1d1b1a]">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#1d1b1a] font-medium">{order.customer.name}</div>
                      <div className="text-xs text-[#4c463e]">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 text-[#4c463e]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {isFrench ? (order.paymentStatus === "Paid" ? "Payé" : order.paymentStatus === "Pending" ? "En attente" : order.paymentStatus === "Failed" ? "Échoué" : order.paymentStatus === "Refunded" ? "Remboursé" : order.paymentStatus) : order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {isFrench ? (order.status === "Pending" ? "En attente" : order.status === "Processing" ? "En traitement" : order.status === "Packed" ? "Emballé" : order.status === "Shipped" ? "Expédié" : order.status === "Delivered" ? "Livré" : order.status === "Cancelled" ? "Annulé" : order.status === "Refunded" ? "Remboursé" : order.status) : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1d1b1a]">
                      €{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#4c463e] hover:bg-[#e8e0d8] hover:text-[#1d1b1a] transition-colors"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
