"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

// उपभोक्ता समीक्षाओं का बहुभाषी डेटा (Multilingual review data with premium styling properties)
const translations = {
  fr: {
    sectionLabel: "Premiers retours — échantillons testés en avant-première",
    title: "Ce qu'en disent nos testeurs",
    verified: "Vérifié",
    reviews: [
      {
        initials: "AP",
        role: "L'Hôte Parisien",
        quote: "J'ai servi AÉRI lors de mon dernier apéro à Paris, et tous mes invités ont été totalement séduits par sa légèreté. Une magnifique découverte croustillante !",
        bgColor: "bg-[#F4C2C2]/20 text-[#1C1C1C]",
        borderColor: "border-[#F4C2C2]/45",
        accentColor: "#F4C2C2",
        cardHeight: "py-10"
      },
      {
        initials: "SF",
        role: "Le Sportif",
        quote: "En tant que passionné de sport, mon apport en protéines est crucial. Ce snack m'offre une alternative saine, craquante, et ultra-faible en matières grasses.",
        bgColor: "bg-[#D4AF37]/20 text-[#1C1C1C]",
        borderColor: "border-[#D4AF37]/45",
        accentColor: "#D4AF37",
        cardHeight: "py-8"
      },
      {
        initials: "PE",
        role: "La Parent Engagée",
        quote: "Mes enfants adorent la texture soufflée. C'est parfait pour leur éviter les chips industrielles sans faire de compromis sur le goût.",
        bgColor: "bg-[#1C1C1C] text-[#FFFFFF]",
        borderColor: "border-[#1C1C1C]/15",
        accentColor: "#FFFFFF",
        cardHeight: "py-12"
      },
      {
        initials: "CN",
        role: "La Consciencieuse",
        quote: "Enfin un en-cas gourmand avec un excellent profil nutritionnel. Plus besoin de s'inquiéter pour les calories ou les graisses saturées.",
        bgColor: "bg-[#F5E6D3] text-[#1C1C1C]",
        borderColor: "border-[#1C1C1C]/10",
        accentColor: "#D4AF37",
        cardHeight: "py-10"
      }
    ]
  },
  en: {
    sectionLabel: "First feedbacks — pre-release sample testing reviews",
    title: "What our testers say",
    verified: "Verified",
    reviews: [
      {
        initials: "AP",
        role: "The French Host (L'Apéro Focus)",
        quote: "I served AÉRI at my last apéro in Paris, and all my guests were completely won over and amused by its lightness. A wonderful, crunchy discovery!",
        bgColor: "bg-[#F4C2C2]/20 text-[#1C1C1C]",
        borderColor: "border-[#F4C2C2]/45",
        accentColor: "#F4C2C2",
        cardHeight: "py-10"
      },
      {
        initials: "SF",
        role: "The Fitness Enthusiast",
        quote: "As a sports enthusiast, my protein intake is crucial. This snack offers me a healthy, crunchy, and ultra-low-fat alternative.",
        bgColor: "bg-[#D4AF37]/20 text-[#1C1C1C]",
        borderColor: "border-[#D4AF37]/45",
        accentColor: "#D4AF37",
        cardHeight: "py-8"
      },
      {
        initials: "PE",
        role: "The Health-Conscious Parent",
        quote: "My children love the puffed texture. It's perfect for keeping them away from fried, industrial chips from an early age without compromising on taste.",
        bgColor: "bg-[#1C1C1C] text-[#FFFFFF]",
        borderColor: "border-[#1C1C1C]/15",
        accentColor: "#FFFFFF",
        cardHeight: "py-12"
      },
      {
        initials: "CN",
        role: "The Weight-Management Consumer",
        quote: "Finally a gourmet snack with an excellent nutritional profile. No more worrying about calories or saturated fats.",
        bgColor: "bg-[#F5E6D3] text-[#1C1C1C]",
        borderColor: "border-[#1C1C1C]/10",
        accentColor: "#D4AF37",
        cardHeight: "py-10"
      }
    ]
  },
  hi: {
    sectionLabel: "शुरुआती समीक्षाएं — प्री-रिलीज़ सैंपल टेस्टिंग समीक्षाएं",
    title: "हमारे टेस्टर्स क्या कहते हैं",
    verified: "सत्यापित",
    reviews: [
      {
        initials: "AP",
        role: "फ्रेंच होस्ट (अपेरो फोकस)",
        quote: "मैंने पेरिस में अपने पिछले अपेरो में AÉRI परोसा, और मेरे सभी मेहमान इसकी हल्केपन से पूरी तरह प्रभावित और रोमांचित हुए। एक अद्भुत, कुरकुरी खोज!",
        bgColor: "bg-[#F4C2C2]/20 text-[#1C1C1C]",
        borderColor: "border-[#F4C2C2]/45",
        accentColor: "#F4C2C2",
        cardHeight: "py-10"
      },
      {
        initials: "SF",
        role: "फिटनेस उत्साही",
        quote: "एक खेल प्रेमी के रूप में, मेरा प्रोटीन सेवन महत्वपूर्ण है। यह स्नैक मुझे एक स्वस्थ, कुरकुरा और बेहद कम वसा वाला विकल्प प्रदान करता है।",
        bgColor: "bg-[#D4AF37]/20 text-[#1C1C1C]",
        borderColor: "border-[#D4AF37]/45",
        accentColor: "#D4AF37",
        cardHeight: "py-8"
      },
      {
        initials: "PE",
        role: "स्वास्थ्य-जागरूक अभिभावक",
        quote: "मेरे बच्चों को इसका फूला हुआ (पफ्ड) टेक्सचर बहुत पसंद है। बिना स्वाद से समझौता किए, उन्हें शुरुआत से ही तली हुई और औद्योगिक चिप्स से दूर रखने के लिए यह बिल्कुल सही है।",
        bgColor: "bg-[#1C1C1C] text-[#FFFFFF]",
        borderColor: "border-[#1C1C1C]/15",
        accentColor: "#FFFFFF",
        cardHeight: "py-12"
      },
      {
        initials: "CN",
        role: "वजन-प्रबंधन उपभोक्ता",
        quote: "आखिरकार उत्कृष्ट पोषण प्रोफाइल वाला एक पेटू स्नैक। कैलोरी या संतृप्त वसा के बारे में चिंता करने की कोई आवश्यकता नहीं है।",
        bgColor: "bg-[#F5E6D3] text-[#1C1C1C]",
        borderColor: "border-[#1C1C1C]/10",
        accentColor: "#D4AF37",
        cardHeight: "py-10"
      }
    ]
  }
};

export default function SocialProofGrid() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations] || translations.fr;

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // एनिमेशन वेरिएन्ट्स (Animation variants)
  const cardVariants: any = {
    hidden: { opacity: 0, y: 35 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }
    })
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 md:py-32 px-6 bg-[#F5E6D3] border-t border-[#1d1b1a]/5"
    >
      <div className="max-w-6xl mx-auto">
        {/* अनुभाग लेबल (Section Label) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-xs md:text-sm tracking-[0.25em] uppercase text-[#6E6E73] mb-12 md:mb-16 font-semibold"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {t.sectionLabel}
        </motion.p>

        {/* ग्रिड लेआउट (Consistent CSS Grid layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-stretch">
          {t.reviews.map((review, i) => {
            const isDark = review.bgColor.includes("bg-[#1C1C1C]");
            return (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={cardVariants}
                className={`h-full rounded-[28px] p-6 md:p-8 border ${review.borderColor} shadow-[0_4px_24px_rgba(28,28,28,0.03)] hover:shadow-[0_12px_32px_rgba(28,28,28,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                  isDark ? "bg-[#1C1C1C]" : "bg-white/60 backdrop-blur-sm"
                }`}
              >
                <div>
                  {/* कोटा आइकन और अवतार (Quotes icon and luxury avatar initials) */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-full ${review.bgColor} flex items-center justify-center font-bold text-sm border border-[#1d1b1a]/5 shadow-inner`}>
                      <span style={{ fontFamily: "var(--font-didot), serif" }}>
                        {review.initials}
                      </span>
                    </div>
                    {/* डेकोरेटिव कोट मार्क (Decorative quote symbol) */}
                    <span 
                      className={`text-4xl font-serif leading-none select-none opacity-20`}
                      style={{ color: review.accentColor }}
                    >
                      “
                    </span>
                  </div>

                  {/* समीक्षा संदेश (Review quote text) */}
                  <p
                    className={`text-[14px] md:text-[15px] leading-[1.8] italic mb-6 ${
                      isDark ? "text-white/80" : "text-[#4A4A4A]"
                    }`}
                    style={{ fontFamily: "var(--font-lora), serif" }}
                  >
                    {review.quote}
                  </p>
                </div>

                {/* रोल/शीर्षक (User role tag with verification badge) */}
                <div className="pt-4 border-t border-[#1d1b1a]/5 flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold tracking-wider ${
                      isDark ? "text-[#D4AF37]" : "text-[#1C1C1C]/75"
                    }`}
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {review.role}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    {t.verified}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
