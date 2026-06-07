"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Briefcase,
  Warehouse,
  Ticket,
  Star,
  BarChart3,
  FileText,
  Settings,
  UserCog,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";

/* Sidebar Navigation Items */
const navItems = [
  { labelEn: "Dashboard", labelFr: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { labelEn: "Products", labelFr: "Produits", href: "/admin/products", icon: Package },
  { labelEn: "Categories", labelFr: "Catégories", href: "/admin/categories", icon: FolderTree },
  { labelEn: "Orders", labelFr: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { labelEn: "Customers", labelFr: "Clients", href: "/admin/customers", icon: Users },
  { labelEn: "B2B Leads", labelFr: "Prospects B2B", href: "/admin/leads", icon: Briefcase },
  { labelEn: "Inventory", labelFr: "Inventaire", href: "/admin/inventory", icon: Warehouse },
  { labelEn: "Coupons", labelFr: "Bons de réduction", href: "/admin/coupons", icon: Ticket },
  { labelEn: "Reviews", labelFr: "Avis", href: "/admin/reviews", icon: Star },
  { labelEn: "Analytics", labelFr: "Analyses", href: "/admin/analytics", icon: BarChart3 },
  { labelEn: "Content", labelFr: "Contenu", href: "/admin/content", icon: FileText },
  { labelEn: "Settings", labelFr: "Paramètres", href: "/admin/settings", icon: Settings },
  { labelEn: "Users", labelFr: "Utilisateurs", href: "/admin/users", icon: UserCog },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* Check karo ki current route active hai ya nahi */
  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#1d1b1a] text-[#fef8f6] lg:hidden shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          bg-[#1d1b1a] text-[#fef8f6] shadow-2xl
          transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${collapsed ? "w-[72px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative
        `}
      >
        {/* Logo / Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <span
                className="text-xl font-bold tracking-wider"
                style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
              >
                AÉRI
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#fef8f6]/50 font-medium">
                Admin
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="mx-auto">
              <span className="text-lg font-bold">A</span>
            </Link>
          )}
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setMobileOpen(false);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors hidden lg:block"
          >
            <ChevronLeft
              size={16}
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const label = isFrench ? item.labelFr : item.labelEn;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-[#675d4e] text-white shadow-md"
                      : "text-[#fef8f6]/70 hover:text-[#fef8f6] hover:bg-white/8"
                  }
                  ${collapsed ? "justify-center px-2" : ""}
                `}
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer: Logout */}
        <div className="p-2 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
              text-sm font-medium text-[#fef8f6]/50 hover:text-red-400 hover:bg-red-500/10
              transition-all duration-200
              ${collapsed ? "justify-center px-2" : ""}
            `}
            title={collapsed ? (isFrench ? "Se déconnecter" : "Logout") : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>{isFrench ? "Se déconnecter" : "Logout"}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
