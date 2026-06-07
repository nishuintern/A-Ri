"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/translations";

/* ────────────────────────────────────────────────────────
   Certification data
   ──────────────────────────────────────────────────────── */
const certifications = [
  {
    id: "fssai",
    name: "FSSAI",
    fullName: "Food Safety and Standards Authority of India",
    pdfLink: "/FSSAI Central License.pdf",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <rect x="8" y="8" width="48" height="48" rx="8" stroke="#111111" strokeWidth="1.5" />
        <path d="M20 28h24M20 34h18M20 40h12" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="44" cy="44" r="8" fill="#111111" fillOpacity="0.08" stroke="#111111" strokeWidth="1.5" />
        <path d="M41 44l2 2 4-4" stroke="#6E6E73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 16v-4M32 16v-4M38 16v-4" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "fostac",
    name: "FoSTaC",
    fullName: "Food Safety Training & Certification",
    pdfLink: "/fostac.pdf",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path d="M32 8L12 18v16c0 14 16 22 20 22s20-8 20-22V18L32 8z" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 34l6 6 12-12" stroke="#6E6E73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "apeda",
    name: "APEDA",
    fullName: "Agricultural & Processed Food Products Export Development Authority",
    pdfLink: "/RCMC certificate .pdf",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path d="M32 56V24" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 44C20 44 14 36 14 26C14 16 24 12 32 24" stroke="#6E6E73" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 38C44 38 50 30 50 20C50 10 40 6 32 18" stroke="#6E6E73" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "iec",
    name: "IEC",
    fullName: "Import Export Code Compliance",
    pdfLink: "/certificateOfIEC.pdf",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <rect x="10" y="18" width="44" height="28" rx="4" stroke="#111111" strokeWidth="1.5" />
        <path d="M10 26h44" stroke="#111111" strokeWidth="1.5" />
        <path d="M18 34h8M18 38h12" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="44" cy="36" r="6" fill="#111111" fillOpacity="0.06" stroke="#111111" strokeWidth="1" />
        <path d="M42 36l1.5 1.5 3-3" stroke="#6E6E73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 8l4 10H28l4-10z" fill="#111111" fillOpacity="0.05" stroke="#111111" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: "startup",
    name: "Startup India",
    fullName: "Department for Promotion of Industry and Internal Trade",
    pdfLink: "/SIC- H&G VENTURES PRIVATE LIMITED.pdf",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path d="M32 12L42 28H22L32 12Z" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="26" y="28" width="12" height="16" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 44l-4 6h20l-4-6" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="22" r="2" fill="#6E6E73" />
      </svg>
    ),
  },
  {
    id: "eu",
    name: "EU Compliance",
    fullName: "European Union Food Safety Standards",
    pdfLink: undefined,
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="24" stroke="#111111" strokeWidth="1.5" />
        {/* EU stars */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const cx = 32 + 18 * Math.cos(angle);
          const cy = 32 + 18 * Math.sin(angle);
          return (
            <circle key={i} cx={cx} cy={cy} r="2" fill="#111111" fillOpacity="0.6" />
          );
        })}
        <path d="M26 32l4 4 8-8" stroke="#6E6E73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "nabl",
    name: "NABL",
    fullName: "National Accreditation Board for Testing & Calibration",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="24" stroke="#111111" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="16" stroke="#111111" strokeWidth="1" strokeDasharray="3 2" />
        <path d="M32 16v6M32 42v6M16 32h6M42 32h6" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="32" r="4" fill="#6E6E73" fillOpacity="0.3" stroke="#6E6E73" strokeWidth="1.5" />
        <path d="M29 32l2 2 4-4" stroke="#6E6E73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/* ────────────────────────────────────────────────────────
   Certification card
   ──────────────────────────────────────────────────────── */
function CertCard({
  cert,
  index,
  s,
  onViewPdf,
}: {
  cert: (typeof certifications)[0];
  index: number;
  s: Record<string, unknown>;
  onViewPdf: (pdfLink: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative h-full p-6 md:p-8 rounded-2xl bg-white/50 border border-[#111111]/6 backdrop-blur-sm transition-all duration-400 hover:bg-white/80 hover:shadow-lg hover:border-[#111111]/12 flex flex-col">
        {/* Icon */}
        <div className="w-14 h-14 md:w-16 md:h-16 mb-5 transition-transform duration-300 group-hover:scale-110 shrink-0">
          {cert.icon}
        </div>

        {/* Name */}
        <h4
          className="text-lg md:text-xl font-bold text-[#111111] mb-1"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {cert.name}
        </h4>

        {/* Full name */}
        <p
          className="text-xs font-medium tracking-wide uppercase text-[#6E6E73] mb-3"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {cert.fullName}
        </p>

        {/* Description */}
        <p
          className="text-sm text-[#111111]/55 leading-relaxed grow"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          {(s.certDescriptions as string[])[index]}
        </p>

        {/* Verified badge + PDF Action */}
        <div className="mt-5 flex items-center justify-between shrink-0">
          <div className="inline-flex items-center gap-1.5 text-[#6E6E73]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {s.verified as string}
            </span>
          </div>

          {cert.pdfLink && (
            <button
              onClick={() => onViewPdf(cert.pdfLink!)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111]/6 text-[#111111]/70 text-[11px] font-semibold tracking-wide transition-colors hover:bg-[#111111]/12 hover:text-[#111111]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {(s.pdfLabels as (string | null)[])[index] || 'View PDF'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────
   PDF Lightbox Component
   ──────────────────────────────────────────────────────── */
function PdfLightbox({ pdfUrl, onClose }: { pdfUrl: string | null; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    if (pdfUrl) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [pdfUrl, onClose]);

  if (!pdfUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/80 backdrop-blur-md p-4 md:p-10"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#111111]/10 bg-[#FFFFFF]/30">
            <h3 className="text-[#111111] font-semibold text-lg" style={{ fontFamily: "var(--font-montserrat)" }}>
              Document Viewer
            </h3>
            <div className="flex items-center gap-3">
              <a
                href={pdfUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111111] text-[#FFFFFF] text-sm font-semibold transition-colors hover:bg-[#111111]/90"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </a>
              <button
                onClick={onClose}
                className="p-2 text-[#111111]/60 hover:text-[#111111] transition-colors rounded-full hover:bg-[#111111]/5"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* PDF Container */}
          <div className="flex-1 w-full bg-gray-100">
            <iframe
              src={pdfUrl}
              className="w-full h-full border-none"
              title="PDF Viewer"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ────────────────────────────────────────────────────────
   Main Section
   ──────────────────────────────────────────────────────── */
export default function Certifications() {
  const { lang } = useLanguage();
  const s = t.certs[lang];
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const labRef = useRef<HTMLDivElement>(null);
  const labInView = useInView(labRef, { once: true, amount: 0.3 });
  
  const [activePdf, setActivePdf] = useState<string | null>(null);

  return (
    <>
      <section
        className="relative w-full py-24 md:py-36 overflow-hidden"
        style={{ background: "#FFFFFF" }}
      >
        {/* ── Header ── */}
        <div ref={headerRef} className="text-center px-6 mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-xs font-semibold tracking-[0.4em] uppercase text-[#6E6E73] mb-5"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {s.label}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mb-6"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {s.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-[#111111]/55 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            {s.subtitle}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 mx-auto w-20 h-[1px] bg-[#111111]/20 origin-center"
          />
        </div>

        {/* ── Certification Grid ── */}
        <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {certifications.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} s={s} onViewPdf={setActivePdf} />
            ))}
          </div>
        </div>

        {/* ── Lab Reports Block ── */}
        <div ref={labRef} className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={labInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl bg-white border border-[#111111]/8 shadow-xl"
          >
            <div className="p-8 md:p-12">
              {/* Lab report header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 pb-8 border-b border-[#111111]/8">
                <div>
                  <span
                    className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[#6E6E73] mb-2"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {s.labLabel}
                  </span>
                  <h3
                    className="text-xl md:text-2xl font-bold text-[#111111]"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {s.labTitle}
                  </h3>
                  <p
                    className="text-sm text-[#111111]/50 mt-1"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    {s.labDate}
                  </p>
                </div>

                {/* Download button */}
                <motion.a
                  href="/NABL_Lab_Report.pdf"
                  target="_blank"
                  download
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#111111] text-[#FFFFFF] text-sm font-semibold tracking-wide transition-colors hover:bg-[#111111]/90 cursor-pointer shrink-0"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {s.labBtn}
                </motion.a>
              </div>

              {/* Analysis rows */}
              <div className="space-y-4">
                {(s.analyses as { name: string; desc: string; status: string }[]).map((analysis, i) => (
                  <motion.div
                    key={analysis.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={labInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#FFFFFF]/30 border border-[#111111]/4 transition-colors hover:bg-[#FFFFFF]/60"
                  >
                    <div className="flex items-start gap-3">
                      {/* Status icon */}
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-[#6E6E73]/15 flex items-center justify-center shrink-0">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#6E6E73"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <span
                          className="block text-sm font-semibold text-[#111111]"
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          {analysis.name}
                        </span>
                        <span
                          className="block text-xs text-[#111111]/45 mt-0.5"
                          style={{ fontFamily: "var(--font-lora)" }}
                        >
                          {analysis.desc}
                        </span>
                      </div>
                    </div>

                    {/* Status pill */}
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#6E6E73]/10 text-[#6E6E73] border border-[#6E6E73]/12 shrink-0"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6E6E73]" />
                      {analysis.status}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Fine print */}
              <p
                className="mt-6 text-xs text-[#111111]/35 leading-relaxed text-center"
                style={{ fontFamily: "var(--font-lora)" }}
              >
                {s.labFine}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Overlay */}
      <PdfLightbox pdfUrl={activePdf} onClose={() => setActivePdf(null)} />
    </>
  );
}
