"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";

const VALID_FRAMES: number[] = [];
for (let i = 1; i <= 233; i++) {
  if (i >= 60 && i <= 135) continue; // Skip blueberry frames
  VALID_FRAMES.push(i);
}

const FRAME_COUNT = VALID_FRAMES.length;

const heroText = {
  fr: {
    ticker: "• Livraison gratuite sur votre première commande • Livraison gratuite sur votre première commande •",
    headline: "AÉRI : L'Apéro Soufflé d'Exception.",
    subheadline: "Croustillant, noble, et naturellement sain. Découvrez la super-graine d'origine indienne qui réinvente vos débuts de soirée.",
    cta: "ACHETER MAINTENANT",
    disclaimer: "Représentation botanique illustrative.",
  },
  en: {
    ticker: "• Free shipping on your first delivery • Free shipping on your first delivery •",
    headline: "AÉRI: The Ultimate Gourmet Puff.",
    subheadline: "Crunchy, noble, and naturally healthy. Discover the Indian super-seed that reinvents your evening rituals.",
    cta: "SHOP NOW",
    disclaimer: "Illustrative botanical representation.",
  },
  hi: {
    ticker: "• आपके पहले ऑर्डर पर मुफ़्त डिलीवरी • आपके पहले ऑर्डर पर मुफ़्त डिलीवरी •",
    headline: "AÉRI: बेमिसाल गॉर्मे स्नैक।",
    subheadline: "कुरकुरा, शानदार, और प्राकृतिक रूप से स्वस्थ। भारतीय सुपर-सीड की खोज करें जो आपकी शाम को बदल दे।",
    cta: "अभी खरीदें",
    disclaimer: "सचित्र वानस्पतिक प्रतिनिधित्व।",
  },
};

export default function Hero() {
  const { lang } = useLanguage();
  const s = heroText[lang as keyof typeof heroText] || heroText.fr;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    VALID_FRAMES.forEach((frameNum) => {
      const img = new window.Image();
      const frameStr = frameNum.toString().padStart(3, "0");
      img.src = `/hero-sequence/ezgif-frame-${frameStr}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setLoaded(true);
        }
      };
      loadedImages.push(img);
    });
    
    setImages(loadedImages);
  }, []);

  // Draw the initial frame once loaded
  useEffect(() => {
    if (loaded && images.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = images[0];
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [loaded, images]);

  // Draw frame on scroll
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!loaded || images.length === 0 || !canvasRef.current) return;
    
    let index = Math.floor(latest) - 1;
    if (index < 0) index = 0;
    if (index >= FRAME_COUNT) index = FRAME_COUNT - 1;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = images[index];
    
    if (ctx && img && img.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  });

  // Transition effects to hide the jump cut between frame 59 and 136
  const cutIndex = 58;
  const cutNextIndex = 59;
  
  const canvasOpacity = useTransform(
    frameIndex,
    [cutIndex - 8, cutIndex, cutNextIndex, cutNextIndex + 8],
    [0.85, 0, 0, 0.85]
  );
  
  const canvasFilter = useTransform(
    frameIndex,
    [cutIndex - 8, cutIndex, cutNextIndex, cutNextIndex + 8],
    ["blur(0px)", "blur(16px)", "blur(16px)", "blur(0px)"]
  );

  // Opacity transform for the text
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[400vh]"
      style={{ background: '#000000' }}
    >
      {/* Infinite Marquee Ticker */}
      <div className="fixed top-0 left-0 right-0 z-[50] bg-[#1C1C1C] text-white overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee py-2.5">
          <span className="text-xs tracking-widest uppercase px-8" style={{ fontFamily: "var(--font-montserrat)" }}>
            {s.ticker}
          </span>
          <span className="text-xs tracking-widest uppercase px-8" style={{ fontFamily: "var(--font-montserrat)" }}>
            {s.ticker}
          </span>
          <span className="text-xs tracking-widest uppercase px-8" style={{ fontFamily: "var(--font-montserrat)" }}>
            {s.ticker}
          </span>
          <span className="text-xs tracking-widest uppercase px-8" style={{ fontFamily: "var(--font-montserrat)" }}>
            {s.ticker}
          </span>
        </div>
      </div>

      <div
        className="sticky top-0 left-0 w-full h-screen overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #FDF8F0 0%, #F9F0E3 35%, #F5E6D0 65%, #EDE0D4 100%)' }}
      >
        {/* Canvas for image sequence — no blend mode so text stays readable */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <motion.canvas
            ref={canvasRef}
            style={{ opacity: canvasOpacity, filter: canvasFilter }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Radial gradient scrim behind copy — boosts text legibility over any frame */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 58%, rgba(245,230,211,0.72) 0%, rgba(245,230,211,0.18) 65%, transparent 100%)',
          }}
        />

        {/* Logo overlay — covers watermark bottom-right */}
        <div
          className="absolute z-[3] pointer-events-none flex items-center justify-center"
          style={{
            bottom: 0,
            right: 0,
            width: '120px',
            height: '50px',
            background: 'linear-gradient(135deg, rgba(237,224,212,0.95) 0%, rgba(245,230,208,0.98) 50%, rgba(237,224,212,0.95) 100%)',
            backdropFilter: 'blur(8px)',
            borderTopLeftRadius: '8px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-didot)',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#1C1C1C',
              textTransform: 'uppercase',
            }}
          >
            AÉRI
          </span>
        </div>

        {/* Navbar — fixed, rendered here for mount context */}
        <Navbar />

        {/* ── Hero Copy & CTA ── */}
        {/* pt accounts for ticker (≈36px) + navbar (≈52px) */}
        <div
          className="relative z-[10] flex flex-col items-center justify-center text-center px-6 h-full pt-[88px] pb-16 pointer-events-none"
        >
          {/* Animated Text Container */}
          <motion.div
            style={{ opacity: textOpacity }}
            className="flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-5xl lg:text-[3.75rem] font-bold tracking-tight mb-5 text-[#1C1C1C] leading-tight"
              style={{
                fontFamily: 'var(--font-didot)',
                textShadow: '0 2px 24px rgba(245,230,211,0.9), 0 1px 4px rgba(245,230,211,0.8)',
              }}
            >
              {s.headline}
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.75 }}
              className="text-sm md:text-base lg:text-[1.05rem] max-w-xl leading-relaxed mb-9 text-[#3a342c]"
              style={{
                fontFamily: 'var(--font-montserrat)',
                textShadow: '0 1px 12px rgba(245,230,211,0.95)',
              }}
            >
              {s.subheadline}
            </motion.p>
          </motion.div>

          {/* CTA Button - always visible */}
          <motion.a
            href="/products"
            whileHover={{ scale: 1.04, backgroundColor: '#333' }}
            whileTap={{ scale: 0.96 }}
            className="pointer-events-auto inline-block px-9 py-4 bg-[#1C1C1C] text-[#F5E6D3] text-[11px] font-bold tracking-[0.3em] uppercase rounded-xl shadow-xl transition-colors duration-200 mt-2"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {s.cta}
          </motion.a>

          {/* Scroll nudge - always visible */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-[1px] h-7 bg-[#1C1C1C]/25 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#1C1C1C]/30" />
          </motion.div>
        </div>

        {/* Botanical disclaimer — bottom left */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[10] text-center">
          <span
            className="text-[10px] tracking-wide text-[#4c463e]/45"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {s.disclaimer}
          </span>
        </div>
      </div>
    </section>
  );
}
