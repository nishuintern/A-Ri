"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

const t = {
  fr: {
    title: "Votre Panier",
    empty: "Votre panier est vide",
    total: "Sous-total",
    checkout: "Commander",
    continue: "Continuer vos achats",
    remove: "Supprimer",
    waitlist: {
      title: "Liste Premium",
      body: "Merci pour votre confiance ! Vous faites désormais partie de notre liste 'Premium'. Nous préparons actuellement notre lancement national dans votre supermarché local. Nous vous rembourserons votre commande aujourd'hui, mais vous serez le PREMIER à recevoir un coffret cadeau AÉRI offert dès notre arrivée en France. À très bientôt !",
      placeholder: "votre@email.com",
      cta: "Rejoindre la liste d'attente",
      close: "Fermer",
      success: "Merci ! Vous serez informé en premier.",
    },
  },
  en: {
    title: "Your Cart",
    empty: "Your cart is empty",
    total: "Subtotal",
    checkout: "Checkout",
    continue: "Continue Shopping",
    remove: "Remove",
    waitlist: {
      title: "Premium List",
      body: "Thank you for your trust! You are now part of our 'Premium' client list. We are currently preparing our national launch at your local supermarket. We will reimburse your order today, but you will be the FIRST to receive a complimentary AÉRI gift box as soon as we arrive in France. See you soon!",
      placeholder: "your@email.com",
      cta: "Join Waitlist",
      close: "Close",
      success: "Thank you! You'll be the first to know.",
    },
  },
};

import { useState, useCallback } from "react";

export default function CartDrawer({ onCheckout }: { onCheckout?: () => void }) {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { lang } = useLanguage();
  const s = t[lang as keyof typeof t] || t.fr;
  const router = useRouter();

  return (
    <>
      <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#F5E6D3] z-[100] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C1C1C]/10">
              <h2
                className="text-2xl font-bold text-[#1C1C1C]"
                style={{ fontFamily: "var(--font-didot)" }}
              >
                {s.title}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#1C1C1C]/60 space-y-4">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <p style={{ fontFamily: "var(--font-montserrat)" }}>{s.empty}</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-xs font-semibold tracking-widest uppercase border-b border-[#1C1C1C] text-[#1C1C1C] pb-1 hover:opacity-70 transition-opacity"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {s.continue}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-24 h-24 bg-white/50 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-1 flex-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-[#1C1C1C] text-sm pr-4" style={{ fontFamily: "var(--font-didot)" }}>
                              {item.name}
                            </h3>
                            <span className="font-bold text-[#1C1C1C]" style={{ fontFamily: "var(--font-montserrat)" }}>
                              €{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-[#1C1C1C]/20 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-[#1C1C1C]/5 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-3 text-sm font-medium" style={{ fontFamily: "var(--font-montserrat)" }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-[#1C1C1C]/5 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] uppercase tracking-wider text-[#1C1C1C]/60 hover:text-red-600 transition-colors"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                          >
                            {s.remove}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#1C1C1C]/10 px-6 py-6 bg-[#F5E6D3]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm uppercase tracking-widest text-[#1C1C1C]/80 font-medium" style={{ fontFamily: "var(--font-montserrat)" }}>
                    {s.total}
                  </span>
                  <span className="text-2xl font-bold text-[#1C1C1C]" style={{ fontFamily: "var(--font-didot)" }}>
                    €{cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (onCheckout) {
                      setIsCartOpen(false);
                      onCheckout();
                    } else {
                      setIsCartOpen(false);
                      router.push("/checkout");
                    }
                  }}
                  className="w-full py-4 bg-[#1C1C1C] text-[#F5E6D3] rounded-xl font-semibold tracking-widest uppercase text-sm hover:bg-[#333] transition-colors"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {s.checkout}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
