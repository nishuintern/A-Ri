"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { useLanguage } from "@/context/LanguageContext";
import translations from "@/translations";

function StepCard({ step, index }: { step: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        flex: "1 1 0%",
        minWidth: 0,
        padding: "2.5rem 2rem",
        borderRadius: "1.5rem",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 24px -6px rgba(29,27,26,0.08)",
        border: "1px solid rgba(29,27,26,0.06)",
        display: "flex",
        flexDirection: "column" as const,
        gap: "1rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-didot), serif",
          fontSize: "3rem",
          fontWeight: 700,
          lineHeight: 1,
          color: "#D4AF37",
        }}
      >
        0{index + 1}
      </span>
      <h3
        style={{
          fontFamily: "var(--font-didot), serif",
          fontSize: "1.35rem",
          fontWeight: 700,
          color: "#1d1b1a",
          lineHeight: 1.3,
        }}
      >
        {step.headline}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: "0.95rem",
          lineHeight: 1.75,
          color: "rgba(29,27,26,0.65)",
        }}
      >
        {step.body}
      </p>
    </motion.div>
  );
}

export default function MakhanaEducation() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const { lang } = useLanguage();
  const t = translations.education[lang] || translations.education.en;

  return (
    <section
      id="about"
      style={{
        width: "100%",
        padding: "6rem 1.5rem",
        backgroundColor: "#F5E6D3",
        overflow: "hidden",
      }}
    >
      {/* Section Title */}
      <div ref={headerRef} style={{ textAlign: "center", marginBottom: "4rem" }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: "var(--font-didot), serif",
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 700,
            color: "#1d1b1a",
            margin: 0,
          }}
        >
          {t.title}
        </motion.h2>
      </div>

      {/* 3-Column Layout */}
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row" as const,
          gap: "1.5rem",
          flexWrap: "wrap" as const,
        }}
      >
        {t.steps.map((step: any, i: number) => (
          <StepCard key={i} step={step} index={i} />
        ))}
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          #about > div:last-of-type {
            flex-direction: column !important;
          }
          #about > div:last-of-type > div {
            flex: 1 1 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
