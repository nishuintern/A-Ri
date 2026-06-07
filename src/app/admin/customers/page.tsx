"use client";

import { Users, Search, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/admin/SkeletonLoader";
import { useLanguage } from "@/context/LanguageContext";


export default function CustomersPage() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers")
      .then(res => res.json())
      .then(data => {
        setCustomers(data.customers || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 w-full max-w-7xl mx-auto">
        <SkeletonLoader type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1d1b1a]" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
          {isFrench ? "Clients" : "Customers"}
        </h1>
        <p className="text-sm text-[#4c463e]/60 mt-1">{customers.length} {isFrench ? "clients inscrits" : "registered customers"}</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#e8e0d8] shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c463e]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isFrench ? "Rechercher par nom, email ou ville..." : "Search by name, email, or city..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf5ef] border border-[#e8e0d8] text-sm outline-none focus:ring-2 focus:ring-[#675d4e]/30"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#4c463e]/60 bg-white rounded-2xl border border-[#e8e0d8]">
                {isFrench ? "Aucun client ne correspond à votre recherche." : "No customers found matching your search."}
            </div>
        ) : filtered.map((customer) => (
          <div key={customer._id} className="bg-white rounded-2xl p-6 border border-[#e8e0d8] shadow-sm hover:shadow-md transition-shadow">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#675d4e] flex items-center justify-center text-white font-bold text-lg">
                {customer.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1d1b1a]">{customer.name}</h3>
                <p className="text-xs text-[#4c463e]/60">{isFrench ? "Depuis" : "Since"} {new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[#4c463e]">
                <Mail size={14} className="text-[#4c463e]/40 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#4c463e]">
                <Phone size={14} className="text-[#4c463e]/40 shrink-0" />
                <span>{customer.phone || (isFrench ? "Non renseigné" : "Not provided")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#4c463e]">
                <MapPin size={14} className="text-[#4c463e]/40 shrink-0" />
                <span>{customer.city || (isFrench ? "Non renseigné" : "Not provided")}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between pt-4 border-t border-[#e8e0d8]">
              <div className="text-center">
                <p className="text-lg font-bold text-[#1d1b1a]">{customer.ordersCount || 0}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#4c463e]/50">{isFrench ? "Commandes" : "Orders"}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#1d1b1a]">€{customer.totalSpent?.toFixed(0) || 0}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#4c463e]/50">{isFrench ? "Dépenses Totales" : "Total Spent"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
