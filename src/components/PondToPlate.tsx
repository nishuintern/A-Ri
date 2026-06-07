"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/translations";

/* ────────────────────────────────────────────────────────
   Stage data
   ──────────────────────────────────────────────────────── */
const stages = [
  {
    id: 1,
    label: "Récolte",
    headline: "La Récolte Artisanale",
    body: "Cueillie à la main dans les zones humides préservées du Bihar, chaque graine d'Euryale Ferox est récoltée avec un savoir-faire transmis de génération en génération. Un geste millénaire, respectueux de la terre et de l'eau.",
    image: "/stage_harvest.png",
    stat: { value: "1 000", unit: "acres", desc: "de zones humides préservées" },
    benefit: "Plaisir sans Culpabilité",
  },
  {
    id: 2,
    label: "Transformation",
    headline: "Le Pop Ancestral",
    body: "Les graines noires sont séchées au soleil, puis éclatées à la chaleur — sans huile, sans machine industrielle. Ce procédé traditionnel révèle la texture aérienne et le goût délicat du Makhana.",
    image: "/stage_popping.png",
    stat: { value: "0", unit: "huile", desc: "ajoutée lors du popping" },
    benefit: "Énergie Durable",
  },
  {
    id: 3,
    label: "Assaisonnement",
    headline: "La Touche Française",
    body: "Légèrement enrobé d'huile d'olive extra-vierge et assaisonné de manière artisanale avec des épices sélectionnées. Le résultat : un apéro gastronomique, croustillant et irrésistiblement léger.",
    image: "/stage_flavoring.png",
    stat: { value: "9,5g", unit: "protéines", desc: "par portion de 30g" },
    benefit: "Plaisir sans Culpabilité",
  },
];

/* ────────────────────────────────────────────────────────
   Timeline dot component
   ──────────────────────────────────────────────────────── */
function TimelineDot({ active }: { active: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={active ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute w-10 h-10 rounded-full bg-[#6E6E73]/10"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={active ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-4 h-4 rounded-full bg-[#6E6E73] border-2 border-[#FFFFFF] shadow-md z-10"
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Individual stage card
   ──────────────────────────────────────────────────────── */
function StageCard({ stage, index }: { stage: (typeof stages)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative">
      {/* ── Grid row ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] gap-6 md:gap-0 items-center">
        {/* Left side */}
        <div className={`${isEven ? "order-1" : "order-1 md:order-3"}`}>
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl group cursor-pointer"
          >
            {/* Image with cinematic aspect */}
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={stage.image}
                alt={stage.headline}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Stage label pill */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold tracking-wider uppercase border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6E6E73]" />
                  {stage.label}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center timeline */}
        <div className="hidden md:flex order-2 flex-col items-center self-stretch">
          <TimelineDot active={isInView} />
          {index < stages.length - 1 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="flex-1 w-[2px] bg-gradient-to-b from-[#6E6E73]/50 to-[#6E6E73]/10 origin-top mt-2"
            />
          )}
        </div>

        {/* Right side — text */}
        <div className={`${isEven ? "order-3" : "order-3 md:order-1"}`}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={`md:px-8 ${isEven ? "md:text-left" : "md:text-right"}`}
          >
            {/* Step counter */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block text-6xl md:text-7xl font-black text-[#6E6E73]/10 leading-none mb-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              0{stage.id}
            </motion.span>

            {/* Headline */}
            <h3
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] mb-4 leading-tight"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {stage.headline}
            </h3>

            {/* Body */}
            <p
              className="text-base md:text-lg leading-relaxed text-[#111111]/65 mb-6 max-w-md"
              style={{
                fontFamily: "var(--font-lora)",
                marginLeft: isEven ? undefined : "auto",
              }}
            >
              {stage.body}
            </p>

            {/* Stat card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={`inline-flex items-center gap-4 px-5 py-3 rounded-xl bg-[#6E6E73]/8 border border-[#6E6E73]/12 ${
                isEven ? "" : "md:ml-auto"
              }`}
            >
              <span
                className="text-2xl md:text-3xl font-bold text-[#6E6E73]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {stage.stat.value}
              </span>
              <div className="text-left">
                <span
                  className="block text-xs font-semibold uppercase tracking-wider text-[#6E6E73]"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {stage.stat.unit}
                </span>
                <span
                  className="block text-xs text-[#111111]/50"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  {stage.stat.desc}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Spacer between stages */}
      {index < stages.length - 1 && <div className="h-16 md:h-24" />}
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Main Section
   ──────────────────────────────────────────────────────── */
export default function PondToPlate() {
  const { lang } = useLanguage();
  const s = t.pond[lang];
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const traceRef = useRef<HTMLDivElement>(null);
  const traceInView = useInView(traceRef, { once: true, amount: 0.4 });

  const stageImages = ["/stage_harvest.png", "/stage_popping.png", "/stage_flavoring.png"];

  const localizedStages = stages.map((st, i) => ({
    ...st,
    label: s.stages[i].label,
    headline: s.stages[i].headline,
    body: s.stages[i].body,
    stat: s.stages[i].stat,
    benefit: s.stages[i].benefit,
  }));

  /* Parallax for the top decorative element */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#F5F5F7]"
    >
      {/* ── Top transition gradient ── */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#F5F5F7] to-transparent z-10 pointer-events-none" />

      {/* ── Background subtle pattern ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #FFFFFF 1px, transparent 1px), radial-gradient(circle at 75% 75%, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      {/* ── Section content ── */}
      <div className="relative z-20 pt-32 pb-24 md:pt-44 md:pb-36">
        {/* ── Header ── */}
        <div ref={headerRef} className="text-center px-6 mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-xs font-semibold tracking-[0.4em] uppercase text-[#111111]/60 mb-4"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {s.label}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#111111] mb-6"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {s.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-[#111111]/60 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            {s.subtitle}
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 mx-auto w-20 h-[1px] bg-[#111111]/30 origin-center"
          />
        </div>

        {/* ── Inner container with cream background ── */}
        <div className="mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl rounded-3xl bg-[#FFFFFF] px-6 md:px-12 lg:px-16 py-16 md:py-24 shadow-2xl">
          {/* ── Stages ── */}
          {localizedStages.map((stage, i) => (
            <StageCard key={stage.id} stage={stage} index={i} />
          ))}

          {/* ── Traceability block ── */}
          <div ref={traceRef} className="mt-20 md:mt-28">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={traceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-2xl bg-[#111111] p-8 md:p-12"
            >
              {/* Decorative corner pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 opacity-5">
                <svg viewBox="0 0 100 100" fill="none">
                  {[...Array(5)].map((_, i) => (
                    <circle
                      key={i}
                      cx="100"
                      cy="0"
                      r={20 + i * 15}
                      stroke="#FFFFFF"
                      strokeWidth="0.5"
                    />
                  ))}
                </svg>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
                <div>
                  <span
                    className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[#6E6E73] mb-3"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {s.traceLabel}
                  </span>
                  <h4
                    className="text-xl md:text-2xl font-bold text-[#FFFFFF] mb-4 leading-snug"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {s.traceTitle}
                  </h4>
                  <p
                    className="text-base md:text-lg text-[#FFFFFF]/70 leading-relaxed max-w-xl"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    {s.traceBody}
                  </p>
                </div>

                {/* Benefit pills */}
                <div className="flex flex-col gap-3">
                  {["🌿", "⚡", "🤝"].map((icon, idx) => (
                    <motion.div
                      key={s.tracePills[idx]}
                      initial={{ opacity: 0, x: 20 }}
                      animate={traceInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FFFFFF]/8 border border-[#FFFFFF]/10"
                    >
                      <span className="text-lg">{icon}</span>
                      <span
                        className="text-sm font-medium text-[#FFFFFF]/80 tracking-wide"
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        {s.tracePills[idx]}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Bottom transition gradient ── */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#F5F5F7] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
