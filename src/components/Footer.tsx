"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/translations";
import { useState } from "react";

export default function Footer() {
  const { lang } = useLanguage();
  const s = t.pro[lang];
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "Footer Newsletter" }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setEmail("");
        setTimeout(() => setSuccess(false), 4000);
      } else {
        console.error("Failed to subscribe");
      }
    } catch (error) {
      console.error("Error subscribing", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative w-full bg-[#1C1C1C] text-[#FFFFFF] overflow-hidden">
      {/* Waitlist banner */}
      <div className="border-b border-[#FFFFFF]/8">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span
              className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase text-[#8E8E93] mb-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E93] animate-pulse" />
              {s.waitlistLabel}
            </span>
            <h4
              className="text-lg md:text-xl font-bold text-[#FFFFFF]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {s.waitlistTitle}
            </h4>
            <p
              className="text-sm text-[#FFFFFF]/45 mt-1"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              {s.waitlistSub}
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={s.waitlistPh}
              className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-[#FFFFFF]/8 border border-[#FFFFFF]/12 text-sm text-[#FFFFFF] placeholder:text-[#FFFFFF]/30 focus:outline-none focus:border-[#FFFFFF]/25 transition-all"
              style={{ fontFamily: "var(--font-lora)" }}
            />
            <motion.button
              onClick={handleSubscribe}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-3 rounded-xl bg-[#8E8E93] text-[#111111] text-sm font-semibold tracking-wide transition-colors hover:bg-[#8E8E93]/90 cursor-pointer shrink-0 disabled:opacity-70"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {loading ? "..." : success ? "✓" : s.waitlistBtn}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3
              className="text-2xl font-bold italic text-[#FFFFFF] mb-3"
              style={{ fontFamily: "var(--font-didot)" }}
            >
              AÉRI
            </h3>
            <p
              className="text-sm text-[#FFFFFF]/40 leading-relaxed mb-5"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              {s.brandTagline1}
              <br />
              {s.brandTagline2}
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {["Instagram", "LinkedIn", "Twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-full bg-[#FFFFFF]/6 border border-[#FFFFFF]/10 flex items-center justify-center text-[#FFFFFF]/40 transition-colors hover:bg-[#FFFFFF]/12 hover:text-[#FFFFFF]/70"
                >
                  <span
                    className="text-[10px] font-bold"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {social[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Links — एक्सप्लिसिट रूट मैपिंग (Explicit route mapping to prevent broken links) */}
          {(() => {
            // हर लिंक के लिए सही href मैपिंग
            const getRoutes = (currentLang: string): Record<string, string[]> => {
              if (currentLang === 'en') {
                return {
                  products: [
                    "/products/himalayan-salt",
                    "/products/mediterranean-herb-fusion",
                    "/products/black-truffle",
                    "/products"
                  ],
                  company: [
                    "/company/our-story",
                    "/mission",
                    "/company/transparency",
                    "/company/certifications",
                    "/espace-pro"
                  ],
                  legal: [
                    "/legal/return-policy",
                    "/legal/t-c",
                    "/legal/legal-notice",
                    "/legal/privacy"
                  ]
                };
              }
              return {
                products: [
                  "/products/sel-de-l-himalaya",
                  "/products/herbes-de-provence",
                  "/products/truffe-noire",
                  "/products"
                ],
                company: [
                  "/company/notre-histoire",
                  "/mission",
                  "/company/transparence",
                  "/company/certifications-fr",
                  "/espace-pro"
                ],
                legal: [
                  "/legal/politique-de-retour",
                  "/legal/cgv",
                  "/legal/mentions-legales",
                  "/legal/confidentialite"
                ]
              };
            };

            const linkRoutes = getRoutes(lang);

            const categories = Object.keys(s.footerLinks) as string[];
            return categories.map((category, i) => (
              <div key={category}>
                <h5
                  className="text-xs font-semibold tracking-[0.25em] uppercase text-[#FFFFFF]/50 mb-4"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {s.footerCats[i]}
                </h5>
                <ul className="space-y-2.5">
                  {(s.footerLinks[category as keyof typeof s.footerLinks] as string[]).map((link: string, j: number) => {
                    const routeKey = category === "products" ? "products" : category === "company" || category === "entreprise" ? "company" : "legal";
                    const href = linkRoutes[routeKey]?.[j] || "#";
                    return (
                      <li key={link}>
                        <Link
                          href={href}
                          className="text-sm text-[#FFFFFF]/35 transition-colors hover:text-[#FFFFFF]/70"
                          style={{ fontFamily: "var(--font-lora)" }}
                        >
                          {link}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#FFFFFF]/6">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            className="text-xs text-[#FFFFFF]/25"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            {s.copyright}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={lang === 'en' ? "/legal/return-policy" : "/legal/politique-de-retour"}
              className="text-xs text-[#FFFFFF]/25 transition-colors hover:text-[#FFFFFF]/50"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              {s.returnPolicy}
            </Link>
            <span className="text-[#FFFFFF]/10">·</span>
            <Link
              href={lang === 'en' ? "/legal/privacy" : "/legal/confidentialite"}
              className="text-xs text-[#FFFFFF]/25 transition-colors hover:text-[#FFFFFF]/50"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              {s.privacy}
            </Link>
            <span className="text-[#FFFFFF]/10">·</span>
            <span
              className="text-xs text-[#FFFFFF]/15"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {s.partner}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
