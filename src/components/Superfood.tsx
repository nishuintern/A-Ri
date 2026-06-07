"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/translations";

export default function Superfood() {
  const { lang } = useLanguage();
  const s = t.superfood[lang];
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const textInView = useInView(textRef, { once: true, amount: 0.3 });
  const videoInView = useInView(videoContainerRef, { amount: 0.3 });

  // पैरेलैक्स बैकग्राउंड के लिए स्क्रॉल प्रोग्रेस
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 md:py-36"
      style={{ background: "#F5E6D3" }}
    >
      {/* Soft gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#eaddca] opacity-80 pointer-events-none" />

      {/* Floating Particles (Subtle) */}
      <motion.div
        style={{ y: parallaxY }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Particle 1 */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] w-12 h-12"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#6E6E73] opacity-20">
            <path d="M12 22C12 22 19 16 19 11C19 6 15 2 12 2C9 2 5 6 5 11C5 16 12 22 12 22Z" fill="currentColor"/>
          </svg>
        </motion.div>
        {/* Particle 2 */}
        <motion.div
          animate={{
            y: [0, 25, 0],
            rotate: [0, -15, 15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[15%] right-[8%] w-16 h-16"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#6E6E73] opacity-20">
            <path d="M12 22C12 22 19 16 19 11C19 6 15 2 12 2C9 2 5 6 5 11C5 16 12 22 12 22Z" fill="currentColor"/>
          </svg>
        </motion.div>
        {/* Particle 3 */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 20, -5, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] right-[30%] w-8 h-8"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#111111] opacity-10">
            <path d="M12 22C12 22 19 16 19 11C19 6 15 2 12 2C9 2 5 6 5 11C5 16 12 22 12 22Z" fill="currentColor"/>
          </svg>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Side: Stats Grid (Modi video moved to B2B Espace Pro) */}
          <div className="w-full lg:w-1/2 order-1" ref={videoContainerRef}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={videoInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "97%", label: "Faible en matières grasses", sub: "vs chips classiques" },
                { value: "15g", label: "Protéines", sub: "par 100g de makhana" },
                { value: "0", label: "Huile ajoutée", sub: "soufflé à sec" },
                { value: "5000", label: "Ans de tradition", sub: "origine védique" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={videoInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm text-center"
                >
                  <span className="block text-3xl md:text-4xl font-bold text-[#111111] mb-1" style={{ fontFamily: "var(--font-montserrat)" }}>
                    {stat.value}
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6E6E73] mb-0.5" style={{ fontFamily: "var(--font-montserrat)" }}>
                    {stat.label}
                  </span>
                  <span className="block text-[11px] text-[#111111]/40" style={{ fontFamily: "var(--font-montserrat)" }}>
                    {stat.sub}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Side: Typography */}
          <div className="w-full lg:w-1/2 order-2" ref={textRef}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={textInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={textInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-block text-xs font-semibold tracking-[0.4em] uppercase text-[#6E6E73] mb-6"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {s.label}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={textInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mb-8 leading-[1.15]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {s.title}
              </motion.h2>

              <div className="space-y-8 relative">
                {/* Decorative line */}
                <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#6E6E73]/40 via-[#6E6E73]/20 to-transparent" />
                
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={textInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="pl-8 text-lg md:text-xl text-[#111111]/75 leading-relaxed"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  {s.quote1}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={textInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="pl-8 text-lg md:text-xl text-[#111111]/75 leading-relaxed"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  {s.quote2}
                </motion.p>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
