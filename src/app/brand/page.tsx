"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

// भाषा के अनुसार अनुवाद (Translations for French, English, and Hindi)
const pageTranslations = {
  fr: {
    title: "Notre Histoire",
    subtitle: "Une quête de perfection, de la tradition indienne millénaire jusqu'à l'art de vivre à la française.",
    infographicTitle: "Le Makhana en 3 Étapes",
    steps: [
      {
        number: "01",
        title: "La Graine Super-Héroïque",
        desc: "C'est une graine de makhana. Non, pas la plante classique de votre jardin, la version super-aliment d’origine védique.",
        image: "/heritage_ancient.png"
      },
      {
        number: "02",
        title: "De l'Étang à l'Apéro",
        desc: "Cultivé sur 1 000 acres de zones humides préservées en partenariat exclusif avec Hybite Foods pour garantir une traçabilité à 100%. Sans intermédiaires.",
        image: "/stage_harvest.png"
      },
      {
        number: "03",
        title: "Plus léger que l'air",
        desc: "Adieu la sensation de ‘brique’ dans l’estomac après l’apéro. AÉRI est si léger que vous pourriez presque vous envoler.",
        image: "/stage_flavoring.png"
      }
    ],
    founderTitle: "La Fondatrice & Notre Expertise",
    founderStories: [
      "Après avoir obtenu son Master en France, notre fondatrice a vécu le rituel sacré de l'apéro en tant qu'étudiante urbaine à Paris. C'est en constatant l'absence cruelle de snacks clean-label, sains et véritablement gourmands sur les tables de l'apéro qu'elle a décidé d'entreprendre. De cette frustration est née une conviction : il fallait bâtir une chaîne d'approvisionnement directe, reliant les producteurs du Bihar aux tables françaises pour de bon.",
      "Derrière AÉRI se trouve également un solide socle industriel familial de plus de 20 ans d'expertise active dans la fabrication d'emballages et le négoce de matières premières en Inde. Ce savoir-faire opérationnel — allant de l'ingénierie de conservation de la fraîcheur à la logistique conteneurisée — nous donne l'autorité et la capacité de passage à l'échelle nécessaires pour approvisionner les plus grandes enseignes de la distribution en Europe."
    ]
  },
  en: {
    title: "Our Story",
    subtitle: "A quest for perfection, from ancient Indian traditions to the French art of living.",
    infographicTitle: "Makhana in 3 Steps",
    steps: [
      {
        number: "01",
        title: "The Superhero Seed",
        desc: "This is a makhana seed. No, not the typical plant from your backyard, but the Vedic-origin superfood version.",
        image: "/heritage_ancient.png"
      },
      {
        number: "02",
        title: "From Pond to Apéro",
        desc: "Cultivated across 1,000 acres of preserved wetlands in exclusive partnership with Hybite Foods to guarantee 100% traceability. Middleman-free.",
        image: "/stage_harvest.png"
      },
      {
        number: "03",
        title: "Lighter than Air",
        desc: "Goodbye to the heavy 'brick' feeling in your stomach after the apéro. AÉRI is so light you might just float away.",
        image: "/stage_flavoring.png"
      }
    ],
    founderTitle: "The Founder & Our Expertise",
    founderStories: [
      "After obtaining her Master's degree in France, our founder experienced the authentic local L'Apéro ritual firsthand as an urban student in Paris. Recognizing the complete lack of healthy, clean-label gourmet snacks on French tables, she set out to change things. From that frustration, she designed a direct supply chain from Bihar to Europe.",
      "Behind AÉRI lies over 20 years of active family industrial expertise in the packaging industry and raw materials trading across India. This operational foundation — from shelf-life engineering to containerised international logistics — grants AÉRI the authority and scalability to supply Europe's largest retail chains at high volume."
    ]
  },
  hi: {
    title: "हमारी कहानी",
    subtitle: "हजारों साल पुरानी भारतीय परंपरा से लेकर फ्रेंच कला तक, पूर्णता की एक खोज।",
    infographicTitle: "मखाना के 3 चरण",
    steps: [
      {
        number: "01",
        title: "सुपरहीरो बीज",
        desc: "यह मखाना बीज है। आपके बगीचे का सामान्य पौधा नहीं, बल्कि वैदिक मूल का सुपरफूड संस्करण।",
        image: "/heritage_ancient.png"
      },
      {
        number: "02",
        title: "तालाब से अपेरो तक",
        desc: "100% पता लगाने की क्षमता (ट्रेसेबिलिटी) सुनिश्चित करने के लिए हाइब्रिड Foods (Hybite Foods) के साथ विशेष साझेदारी में 1,000 एकड़ संरक्षित वेटलैंड्स में खेती।",
        image: "/stage_harvest.png"
      },
      {
        number: "03",
        title: "हवा से भी हल्का",
        desc: "अपेरो के बाद पेट में भारीपन (भारी ईंट जैसा महसूस होना) को अलविदा कहें। AÉRI इतना हल्का है कि आप लगभग उड़ सकते हैं।",
        image: "/stage_flavoring.png"
      }
    ],
    founderTitle: "संस्थापक और हमारी विशेषज्ञता",
    founderStories: [
      "फ्रांस में मास्टर डिग्री पूरी करने के दौरान, हमारी संस्थापक ने एक शहरी छात्र के रूप में प्रामाणिक स्थानीय 'ल-अपेरो' (L'Apéro) सांस्कृतिक अनुष्ठान को करीब से जिया। स्वस्थ, क्लीन-लेबल पेटू स्नैक्स की भारी कमी को देखते हुए, उन्होंने सीधे आपूर्ति श्रृंखला (सप्लाई चेन) का निर्माण किया जो बिहार के किसानों को सीधे यूरोपीय मेजों से जोड़ता है।",
      "AÉRI के पीछे पैकेजिंग उद्योग और कच्चे माल के व्यापार में 20 से अधिक वर्षों का सक्रिय पारिवारिक औद्योगिक अनुभव है। यह परिचालन अनुभव हमें उन्नत शेल्फ-लाइफ इंजीनियरिंग और उच्च मात्रा में यूरोपीय रिटेल श्रृंखलाओं को मखाना की निरंतर आपूर्ति करने की क्षमता प्रदान करता है।"
    ]
  }
};

export default function BrandPage() {
  const { lang } = useLanguage();
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.en;

  // एनिमेशन वेरिएन्ट्स (Animation variants)
  const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: (d: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: d }
    })
  };

  return (
    <main className="min-h-screen bg-[#F5E6D3] text-[#1C1C1C] font-sans overflow-hidden">
      {/* नैविगेशन बार (Unified Navbar) */}
      <Navbar />

      {/* हीरो विभाग (Hero Section) */}
      <section className="pt-44 pb-20 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          style={{ fontFamily: "var(--font-didot), serif" }}
        >
          {t.title}
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.2}
          className="text-lg md:text-xl text-[#4C463E] max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {t.subtitle}
        </motion.p>
      </section>

      {/* ३-चरणों का इन्फोग्राफिक (3-Step Infographic Section) */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto mb-20">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-didot), serif" }}
          >
            {t.infographicTitle}
          </h2>
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto" />
        </div>

        {/* हॉरिजॉन्टल स्टेप्स लेआउट (Horizontal Infographic Steps layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {t.steps.map((step, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              custom={index * 0.15}
              className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-[#1d1b1a]/5 hover:border-[#D4AF37]/35 transition-all duration-300 group flex flex-col justify-between h-full"
            >
              <div>
                {/* स्टेप नंबर और शीर्षक (Step Number and Title) */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-4xl font-bold text-[#D4AF37]/30 group-hover:text-[#D4AF37]/90 transition-colors duration-300"
                    style={{ fontFamily: "var(--font-didot), serif" }}
                  >
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#1C1C1C]/5 flex items-center justify-center text-xs font-bold text-[#1C1C1C]/40 group-hover:bg-[#D4AF37]/15 group-hover:text-[#D4AF37] transition-all">
                    ✓
                  </div>
                </div>

                <h3
                  className="text-xl font-bold mb-4 group-hover:text-[#D4AF37] transition-colors"
                  style={{ fontFamily: "var(--font-didot), serif" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm text-[#4C463E] leading-relaxed mb-6"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {step.desc}
                </p>
              </div>

              {/* इमेज कंटेनर (Image Preview with nice borders) */}
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[#1d1b1a]/5 shadow-sm">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* संस्थापक और विशेषज्ञता विभाग (Founders & Expertise Module) */}
      <section className="py-20 px-6 md:px-12 bg-white/50 border-y border-[#1d1b1a]/5 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* संस्थापक का फोटो (Founder Photo Frame) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.1}
              className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl group border-4 border-white"
            >
              <Image
                src="/founder.png"
                alt="AÉRI Founder"
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
              />
              {/* डेकोरेटिव गोल्डन फ्रेम (Decorative golden frame border) */}
              <div className="absolute inset-3 border border-[#D4AF37]/35 rounded-[22px] pointer-events-none group-hover:inset-2 transition-all duration-500" />
              {/* नाम टैग (Name tag badge) */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#1C1C1C]/90 backdrop-blur-md py-4 px-6 rounded-2xl text-white text-center shadow-lg border border-[#FFFFFF]/10">
                <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-0.5" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {lang === 'fr' ? 'Fondatrice' : 'Founder'}
                </p>
                <p className="text-base font-bold tracking-wide" style={{ fontFamily: "var(--font-didot), serif" }}>
                  AÉRI Snacks
                </p>
              </div>
            </motion.div>

            {/* स्टोरी पैराग्राफ्स (Two narrative paragraphs) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.2}
              className="flex flex-col justify-center"
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-8 text-[#1C1C1C]"
                style={{ fontFamily: "var(--font-didot), serif" }}
              >
                {t.founderTitle}
              </h2>
              <div className="space-y-6 text-[#4C463E] leading-[1.8] text-base md:text-[17px]">
                <p style={{ fontFamily: "var(--font-lora), serif" }}>
                  {t.founderStories[0]}
                </p>
                <p style={{ fontFamily: "var(--font-lora), serif" }}>
                  {t.founderStories[1]}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* फुटर (Footer) */}
      <Footer />
    </main>
  );
}
