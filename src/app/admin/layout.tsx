"use client";

import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

/* Admin Layout - Sidebar + Header + Content Area */
/* Yeh layout sirf /admin routes pe apply hoga */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/forgot-password";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#faf5ef] flex flex-col relative">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center pt-20">
          {children}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf5ef]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
