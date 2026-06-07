"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

// सभी भाषाओं के लिए अनुवाद (All language translations for Find Us page)
const pageTranslations = {
  fr: {
    badge: "Distribution · France · Europe",
    title: "Où nous trouver",
    subtitle: "Notre carte de distribution arrive bientôt. Inscrivez-vous pour être alerté dès notre lancement.",
    placeholder: "votre@email.com",
    subscribe: "S'inscrire",
    thanks: "Merci ! Vous serez alerté dès que notre carte sera disponible.",
    mapLabel: "Carte interactive — bientôt disponible"
  },
  en: {
    badge: "Distribution · France · Europe",
    title: "Where to find us",
    subtitle: "Our distribution map is coming soon. Sign up to be notified when we launch.",
    placeholder: "your@email.com",
    subscribe: "Sign up",
    thanks: "Thank you! You will be notified as soon as our map is available.",
    mapLabel: "Interactive map — coming soon"
  },
  hi: {
    badge: "वितरण · फ्रांस · यूरोप",
    title: "हमें कहाँ खोजें",
    subtitle: "हमारा वितरण मानचित्र जल्द आ रहा है। हमारे लॉन्च पर सूचित होने के लिए साइन अप करें।",
    placeholder: "your@email.com",
    subscribe: "साइन अप करें",
    thanks: "धन्यवाद! जैसे ही हमारा मानचित्र उपलब्ध होगा आपको सूचित किया जाएगा।",
    mapLabel: "इंटरैक्टिव मानचित्र — जल्द आ रहा है"
  }
};

export default function OuNousTrouverPage() {
  const { lang } = useLanguage();
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.en;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: बैकएंड को भेजना (Send to backend)
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#F5E6D3" }}>
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-32 text-center">
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.35em] uppercase text-[#6E6E73] mb-6"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          <span className="w-6 h-[1px] bg-[#6E6E73]/40" />
          {t.badge}
          <span className="w-6 h-[1px] bg-[#6E6E73]/40" />
        </motion.span>

        {/* मुख्य शीर्षक (Main title) */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl text-[#1C1C1C] mb-6 leading-tight tracking-tight"
          style={{ fontFamily: "var(--font-didot)" }}
        >
          {t.title}
        </motion.h1>

        {/* उपशीर्षक (Subtitle) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-base md:text-lg text-[#6E6E73] max-w-md leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {t.subtitle}
        </motion.p>

        {/* ईमेल फ़ॉर्म (Email form) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-sm"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-2 shadow-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                required
                className="flex-1 rounded-xl border border-[#E0D5C5] bg-white px-4 py-3 text-sm text-[#1C1C1C] placeholder-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#1C1C1C]/20 transition-all"
                style={{ fontFamily: "var(--font-montserrat)" }}
              />
              <button
                type="submit"
                className="rounded-xl px-5 py-3 text-sm font-semibold tracking-wide text-white shrink-0 transition-all hover:opacity-85 active:scale-95"
                style={{
                  background: "#1C1C1C",
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                {t.subscribe}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white border border-[#E0D5C5]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1C1C1C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p
                className="text-sm text-[#1C1C1C] font-medium"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {t.thanks}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* मानचित्र प्लेसहोल्डर (Map placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-16 w-full max-w-2xl h-72 md:h-96 rounded-3xl overflow-hidden border border-[#E0D5C5] shadow-lg relative flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #EDE0D0 0%, #F5E6D3 60%, #EAD9C5 100%)" }}
        >
          {/* ग्रिड बैकग्राउंड पैटर्न */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(#1C1C1C 1px, transparent 1px), linear-gradient(90deg, #1C1C1C 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* डेकोरेटिव डॉट्स */}
          {[
            { top: "30%", left: "25%", size: 10 },
            { top: "55%", left: "50%", size: 14 },
            { top: "40%", left: "70%", size: 10 },
            { top: "65%", left: "30%", size: 8 },
            { top: "25%", left: "60%", size: 8 },
          ].map((dot, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#1C1C1C]"
              style={{ top: dot.top, left: dot.left, width: dot.size, height: dot.size }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
            />
          ))}
          {/* केंद्रित टेक्स्ट */}
          <div className="relative z-10 text-center px-6">
            <svg
              className="mx-auto mb-4 opacity-30"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1C1C1C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p
              className="text-sm text-[#1C1C1C]/40 font-medium tracking-wide"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.mapLabel}
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
