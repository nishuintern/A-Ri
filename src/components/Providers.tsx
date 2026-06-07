"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: "var(--font-montserrat), sans-serif", borderRadius: '10px', background: '#333', color: '#fff' } }} />
      </CartProvider>
    </LanguageProvider>
  );
}
