"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

/* ── पार्टिकल टाइप डेफिनिशन ── */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
  duration: number;
  type: "salt" | "pepper";
}

/* ── ट्रांसलेशन ── */
const t = {
  fr: {
    label: "Saveur Signature",
    title: "Pristine Himalayan Salt & Pepper",
    subtitle: "Torréfié à l'huile d'olive — jamais frit",
    desc: "La pureté du sel rose de l'Himalaya mariée au piquant subtil du poivre noir concassé. L'équilibre parfait entre douceur et intensité.",
    hover: "Survolez pour découvrir l'explosion de saveurs",
    cta: "Découvrir ce produit",
  },
  en: {
    label: "Signature Flavor",
    title: "Pristine Himalayan Salt & Pepper",
    subtitle: "Roasted in olive oil — never fried",
    desc: "The purity of Himalayan pink salt married with the subtle kick of crushed black pepper. The perfect balance between gentleness and intensity.",
    hover: "Hover to discover the flavor burst",
    cta: "Discover this product",
  },
  hi: {
    label: "सिग्नेचर स्वाद",
    title: "प्रिस्टीन हिमालयन नमक और काली मिर्च",
    subtitle: "जैतून के तेल में भुना हुआ — कभी तला नहीं गया",
    desc: "हिमालयन गुलाबी नमक की शुद्धता और कुचली काली मिर्च का सूक्ष्म तीखापन। कोमलता और तीव्रता के बीच एक आदर्श संतुलन।",
    hover: "स्वाद का विस्फोट देखने के लिए होवर करें",
    cta: "यह उत्पाद खोजें",
  },
};

/* ── पार्टिकल जेनरेटर ── */
function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    // 360° कवरेज के लिए रैंडम एंगल
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const radius = 120 + Math.random() * 180;
    particles.push({
      id: i,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 3 + Math.random() * 8,
      color:
        i % 2 === 0
          ? `hsl(${350 + Math.random() * 20}, ${60 + Math.random() * 30}%, ${70 + Math.random() * 20}%)`
          : `hsl(${25 + Math.random() * 15}, ${20 + Math.random() * 15}%, ${20 + Math.random() * 25}%)`,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.15,
      duration: 0.5 + Math.random() * 0.4,
      type: i % 2 === 0 ? "salt" : "pepper",
    });
  }
  return particles;
}

export default function FlavorBurstBowl() {
  const { lang } = useLanguage();
  const s = t[lang as keyof typeof t] || t.fr;

  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // मोबाइल डिटेक्शन
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // होवर पर पार्टिकल्स जेनरेट करो
  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    setIsHovered(true);
    setParticles(generateParticles(40));
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // मोबाइल पर सिंपल लेआउट दिखाओ
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="w-full py-16 px-6"
        style={{ background: "#F5E6D3" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-sm mx-auto text-center"
        >
          <span
            className="inline-block text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] font-semibold mb-3"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {s.label}
          </span>
          <div className="relative w-48 h-48 mx-auto mb-6">
            <Image
              key={lang}
              src="/flavor_salt_v2.png"
              alt={s.title}
              fill
              className="object-contain"
              sizes="192px"
            />
          </div>
          <h3
            className="text-xl text-[#1C1C1C] mb-2"
            style={{ fontFamily: "var(--font-didot)" }}
          >
            {s.title}
          </h3>
          <p
            className="text-xs text-[#8B7355] font-semibold tracking-wide uppercase mb-3"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {s.subtitle}
          </p>
          <p
            className="text-sm text-[#6E6E73] leading-relaxed"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {s.desc}
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 md:py-32 px-6 relative overflow-hidden"
      style={{ background: "#F5E6D3" }}
    >
      {/* बैकग्राउंड ग्रेडिएंट ऑर्ब */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #F4C2C2 0%, #D4AF37 30%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        {/* सेक्शन लेबल */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] font-semibold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {s.label}
          </span>
        </div>

        <div className="flex items-center justify-center gap-16 lg:gap-24">
          {/* लेफ्ट साइड — टेक्स्ट */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 max-w-md"
          >
            <h3
              className="text-3xl lg:text-4xl text-[#1C1C1C] mb-3 leading-tight"
              style={{ fontFamily: "var(--font-didot)" }}
            >
              {s.title}
            </h3>
            <p
              className="text-xs text-[#8B7355] font-semibold tracking-[0.2em] uppercase mb-5"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {s.subtitle}
            </p>
            <p
              className="text-sm text-[#6E6E73] leading-[1.8] mb-6"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {s.desc}
            </p>

            {/* होवर हिंट */}
            <motion.p
              animate={{ opacity: isHovered ? 0 : 1 }}
              className="text-[10px] tracking-[0.15em] uppercase text-[#9E9689] italic"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              ↗ {s.hover}
            </motion.p>

            {/* CTA */}
            <motion.a
              href="/products/himalayan-salt-pepper"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block mt-4 px-6 py-3 bg-[#1C1C1C] text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-lg transition-all hover:bg-[#333]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {s.cta}
            </motion.a>
          </motion.div>

          {/* राइट साइड — बाउल + बर्स्ट */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative flex-shrink-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* ग्लो इफेक्ट */}
            <motion.div
              animate={{
                scale: isHovered ? 1.3 : 1,
                opacity: isHovered ? 0.35 : 0.15,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, #F4C2C2 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            {/* बाउल कंटेनर */}
            <motion.div
              animate={{
                scale: isHovered ? 1.08 : 1,
                rotateY: isHovered ? 8 : 0,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[280px] h-[280px] lg:w-[340px] lg:h-[340px] cursor-pointer"
            >
              {/* 3D शैडो */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 rounded-full transition-all duration-500"
                style={{
                  background: "rgba(28, 28, 28, 0.08)",
                  filter: "blur(12px)",
                  transform: `translateX(-50%) ${isHovered ? "scale(1.15)" : "scale(1)"}`,
                }}
              />

              {/* प्रोडक्ट इमेज */}
              <Image
                src="/flavor_salt_v2.png"
                alt={s.title}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="340px"
                priority
              />

              {/* पार्टिकल बर्स्ट ─── */}
              <AnimatePresence>
                {isHovered &&
                  particles.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{
                        x: 0,
                        y: 0,
                        scale: 0,
                        opacity: 1,
                        rotate: 0,
                      }}
                      animate={{
                        x: p.x,
                        y: p.y,
                        scale: 1,
                        opacity: 0,
                        rotate: p.rotation,
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: "easeOut",
                      }}
                      className="absolute top-1/2 left-1/2 pointer-events-none"
                      style={{
                        width: p.size,
                        height: p.size,
                        borderRadius: p.type === "salt" ? "2px" : "50%",
                        background: p.color,
                        boxShadow:
                          p.type === "salt"
                            ? `0 0 ${p.size}px ${p.color}`
                            : "none",
                      }}
                    />
                  ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
