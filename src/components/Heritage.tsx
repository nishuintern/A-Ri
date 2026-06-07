"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/translations";

/* ────────────────────────────────────────────────────────
   Milestone item
   ──────────────────────────────────────────────────────── */
function MilestoneItem({
  milestone,
  index,
  total,
}: {
  milestone: { year: string; title: string; text: string };
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-[1fr_60px_1fr] items-start">
      {/* Left content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        className={`${isLeft ? "order-1" : "order-1 md:order-3"} ${
          isLeft ? "md:text-right md:pr-10" : "md:text-left md:pl-10"
        }`}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-[#6E6E73] mb-2 px-3 py-1 rounded-full bg-[#6E6E73]/8 border border-[#6E6E73]/12"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {milestone.year}
        </motion.span>

        <h4
          className="text-xl md:text-2xl font-bold text-[#111111] mb-2 leading-snug"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {milestone.title}
        </h4>
        <p
          className="text-sm md:text-base text-[#111111]/60 leading-relaxed max-w-sm"
          style={{
            fontFamily: "var(--font-lora)",
            marginLeft: isLeft ? "auto" : undefined,
          }}
        >
          {milestone.text}
        </p>
      </motion.div>

      {/* Center line + dot */}
      <div className="hidden md:flex order-2 flex-col items-center self-stretch">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[#111111] border-[3px] border-[#FFFFFF] shadow-md z-10" />
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute -inset-2 rounded-full bg-[#111111]/10"
          />
        </motion.div>
        {index < total - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 w-[1px] bg-[#111111]/15 origin-top mt-2 min-h-[80px]"
          />
        )}
      </div>

      {/* Empty right side (alternating layout) */}
      <div className={`hidden md:block ${isLeft ? "order-3" : "order-1"}`} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Main Section
   ──────────────────────────────────────────────────────── */
export default function Heritage() {
  const { lang } = useLanguage();
  const s = t.heritage[lang];

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const botanicalRef = useRef<HTMLDivElement>(null);
  const botanicalInView = useInView(botanicalRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#F5E6D3" }}
    >
      {/* Subtle parchment texture */}
      <motion.div
        style={{ y: parallaxY }}
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, #111111 0.5px, transparent 0.5px), radial-gradient(circle at 70% 60%, #111111 0.5px, transparent 0.5px)",
            backgroundSize: "80px 80px",
          }}
        />
      </motion.div>

      <div className="relative z-10 py-24 md:py-36">
        {/* ═══════════════════════════════════════════════
           HEADER
        ═══════════════════════════════════════════════ */}
        <div ref={headerRef} className="text-center px-6 mb-20 md:mb-28">
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
            transition={{ duration: 1, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-8xl font-bold text-[#111111] mb-6 italic"
            style={{ fontFamily: "var(--font-didot)" }}
          >
            {s.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-[#111111]/55 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            {s.tagline}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 mx-auto w-28 h-[1px] bg-[#111111]/20 origin-center"
          />
        </div>

        {/* ═══════════════════════════════════════════════
           BOTANICAL ILLUSTRATION + INTRO TEXT
        ═══════════════════════════════════════════════ */}
        <div
          ref={botanicalRef}
          className="max-w-7xl mx-auto px-6 mb-20 md:mb-32"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={botanicalInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/heritage_ancient.png"
                  alt="Illustration botanique d'Euryale Ferox"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-[#111111]/10" />
                <div className="absolute inset-3 rounded-xl ring-1 ring-[#8E8E93]/20" />
              </div>

              {/* Floating label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={botanicalInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -bottom-4 -right-4 md:right-8 bg-[#111111] text-[#FFFFFF] px-5 py-3 rounded-xl shadow-xl"
              >
                <span
                  className="block text-[10px] tracking-[0.3em] uppercase opacity-60 mb-0.5"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Classification
                </span>
                <span
                  className="block text-sm font-semibold italic"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  Euryale Ferox Salisb.
                </span>
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={botanicalInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <h3
                className="text-2xl md:text-3xl font-bold text-[#111111] mb-6 leading-snug"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {s.botTitle1}
                <br />
                <span className="text-[#6E6E73]">{s.botTitle2}</span>
              </h3>

              <div className="space-y-4">
                <p
                  className="text-base md:text-lg text-[#111111]/65 leading-relaxed"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  {s.botP1}
                </p>
                <p
                  className="text-base md:text-lg text-[#111111]/65 leading-relaxed"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  {s.botP2}
                </p>
              </div>

              {/* Nutrition highlights */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {s.stats.map((stat: { value: string; label: string; sub: string }, i: number) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={botanicalInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    className="text-center px-3 py-4 rounded-xl bg-[#111111]/4 border border-[#111111]/6"
                  >
                    <span
                      className="block text-2xl md:text-3xl font-bold text-[#111111]"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="block text-xs font-semibold uppercase tracking-wider text-[#6E6E73] mt-1"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {stat.label}
                    </span>
                    <span
                      className="block text-[10px] text-[#111111]/40 mt-0.5"
                      style={{ fontFamily: "var(--font-lora)" }}
                    >
                      {stat.sub}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
           TIMELINE
        ═══════════════════════════════════════════════ */}
        <div className="max-w-5xl mx-auto px-6 mb-20 md:mb-32">
          <div className="flex flex-col gap-12 md:gap-16">
            {s.milestones.map((ms: { year: string; title: string; text: string }, i: number) => (
              <MilestoneItem key={ms.year} milestone={ms} index={i} total={s.milestones.length} />
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
           BOTTOM CLOSING QUOTE
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          className="text-center mt-20 md:mt-28 px-6"
        >
          <p
            className="text-base md:text-lg italic text-[#111111]/35 max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            {s.closing}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

