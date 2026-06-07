"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage();

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-[0.55rem] right-6 z-[60] flex items-center gap-0 rounded-full border border-[#111111]/10 bg-white shadow-sm overflow-hidden cursor-pointer"
      style={{ fontFamily: "var(--font-montserrat)" }}
      aria-label="Toggle language"
    >
      <span
        className={`px-3.5 py-2 text-xs font-bold tracking-wider transition-all duration-300 ${
          lang === "fr"
            ? "bg-[#111111] text-[#FFFFFF]"
            : "bg-transparent text-[#111111]/50"
        }`}
      >
        FR
      </span>
      <span
        className={`px-3.5 py-2 text-xs font-bold tracking-wider transition-all duration-300 ${
          lang === "en"
            ? "bg-[#111111] text-[#FFFFFF]"
            : "bg-transparent text-[#111111]/50"
        }`}
      >
        EN
      </span>
      <span
        className={`px-3.5 py-2 text-xs font-bold tracking-wider transition-all duration-300 ${
          lang === "hi"
            ? "bg-[#111111] text-[#FFFFFF]"
            : "bg-transparent text-[#111111]/50"
        }`}
      >
        HI
      </span>
    </motion.button>
  );
}
