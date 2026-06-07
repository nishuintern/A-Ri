"use client";

import { Bell, Search, ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

/* Admin Header - Top bar with search and notifications */
export default function AdminHeader() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#e8e0d8] flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c463e]/50"
          />
          <input
            type="text"
            placeholder={isFrench ? "Rechercher des produits, commandes..." : "Search products, orders, customers..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f5ede3] border border-[#e8e0d8] text-sm text-[#1d1b1a] placeholder:text-[#4c463e]/40 outline-none focus:ring-2 focus:ring-[#675d4e]/30 focus:border-[#675d4e] transition-all"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Back to Site */}
        <Link 
          href="/" 
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#4c463e] hover:bg-[#f5ede3] rounded-xl transition-colors border border-[#e8e0d8]"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          <ExternalLink size={16} />
          <span className="hidden sm:inline">{isFrench ? "Retour au site" : "Back to Website"}</span>
        </Link>
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl hover:bg-[#f5ede3] transition-colors">
          <Bell size={18} className="text-[#4c463e]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#675d4e] flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <div className="hidden md:block">
            <p
              className="text-sm font-semibold text-[#1d1b1a]"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              {isFrench ? "Administrateur" : "Admin"}
            </p>
            <p className="text-[11px] text-[#4c463e]/60" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
              {isFrench ? "Super Administrateur" : "Super Admin"}
            </p>
          </div>
          
        </div>
      </div>
    </header>
  );
}
