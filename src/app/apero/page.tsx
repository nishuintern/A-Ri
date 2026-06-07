"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { validateReview, formatReview, Review } from "@/lib/reviews";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const flavors = [
  { id: "salt", name: "Himalayan Salt & Pepper", emoji: "🧂", color: "#E8D5B7" },
  { id: "truffle", name: "Gourmet Truffle Fusion", emoji: "🍄", color: "#D4C5B0" },
  { id: "herb", name: "Mediterranean Herb", emoji: "🌿", color: "#C8D5C0" },
];

const pageTranslations = {
  fr: {
    exp: "Expérience Dégustation",
    headlinePart1: "Vous venez de goûter",
    headlinePart2: "l'apéro du futur.",
    subtitle: "Makhana — Graines Soufflées d'Exception, torréfiées à l'huile d'olive. Zéro friture, zéro compromis.",
    flavorQ: "Quelle saveur avez-vous goûtée ?",
    impression: "Votre impression",
    placeholder: "Dites-nous ce que vous en avez pensé — texture, saveur, surprise…",
    sending: "Envoi en cours...",
    sendReview: "Envoyer mon avis",
    thanks: "Merci pour votre retour ! Votre avis a été enregistré avec succès dans notre base de données.",
    writeAnother: "Écrire un autre avis",
    liveFeed: "Live Feed — Avis de la rue",
    noReviews: "Aucun avis pour le moment.",
    whatYouTasted: "Ce que vous venez de déguster",
    badges: [
      { icon: "🌱", label: "100% Vegan", sub: "Aucun ingrédient animal" },
      { icon: "🌾", label: "Sans Gluten", sub: "Certifié sans gluten" },
      { icon: "💪", label: "9,5g Protéines", sub: "Pour 100g" },
      { icon: "🫒", label: "Huile d'Olive", sub: "Torréfié — jamais frit" },
      { icon: "✨", label: "Nutri-Score A", sub: "Excellence nutritionnelle" },
      { icon: "🇫🇷", label: "Bientôt en France", sub: "Lancement national" },
    ],
    firstServed: "Soyez le premier servi",
    signupDesc: "Inscrivez-vous pour recevoir votre coffret AÉRI dès notre arrivée en France.",
    signupBtn: "S'inscrire",
    signupConf: "Inscription confirmée ! Vous serez le premier alerté.",
    discoverFlavors: "Découvrir nos saveurs →",
    ourStory: "Notre histoire",
    share: "Partagez votre découverte",
    makhanaLine: "Makhana — Graines Soufflées d'Exception"
  },
  en: {
    exp: "Tasting Experience",
    headlinePart1: "You just tasted",
    headlinePart2: "the apéro of the future.",
    subtitle: "Makhana — Exceptional Popped Seeds, olive oil roasted. Zero frying, zero compromise.",
    flavorQ: "Which flavor did you taste?",
    impression: "Your impression",
    placeholder: "Tell us what you thought — texture, flavor, surprise...",
    sending: "Sending...",
    sendReview: "Send my review",
    thanks: "Thank you for your feedback! Your review has been successfully saved in our database.",
    writeAnother: "Write another review",
    liveFeed: "Live Feed — Word on the street",
    noReviews: "No reviews yet.",
    whatYouTasted: "What you just tasted",
    badges: [
      { icon: "🌱", label: "100% Vegan", sub: "No animal ingredients" },
      { icon: "🌾", label: "Gluten-Free", sub: "Certified gluten-free" },
      { icon: "💪", label: "9.5g Protein", sub: "Per 100g" },
      { icon: "🫒", label: "Olive Oil", sub: "Roasted — never fried" },
      { icon: "✨", label: "Nutri-Score A", sub: "Nutritional excellence" },
      { icon: "🇫🇷", label: "Coming to France", sub: "National launch" },
    ],
    firstServed: "Be the first served",
    signupDesc: "Sign up to receive your AÉRI box as soon as we launch.",
    signupBtn: "Sign up",
    signupConf: "Registration confirmed! You'll be the first to know.",
    discoverFlavors: "Discover our flavors →",
    ourStory: "Our story",
    share: "Share your discovery",
    makhanaLine: "Makhana — Exceptional Popped Seeds"
  },
  hi: {
    exp: "चखने का अनुभव",
    headlinePart1: "आपने अभी चखा है",
    headlinePart2: "भविष्य का स्नैक।",
    subtitle: "मखाना — असाधारण पॉप्ड बीज, जैतून के तेल में भुना हुआ। कोई तलना नहीं, कोई समझौता नहीं।",
    flavorQ: "आपने कौन सा स्वाद चखा?",
    impression: "आपकी राय",
    placeholder: "हमें बताएं कि आपने क्या सोचा — बनावट, स्वाद, आश्चर्य...",
    sending: "भेजा जा रहा है...",
    sendReview: "मेरी समीक्षा भेजें",
    thanks: "आपकी प्रतिक्रिया के लिए धन्यवाद! आपकी समीक्षा हमारे डेटाबेस में सफलतापूर्वक सहेज ली गई है।",
    writeAnother: "एक और समीक्षा लिखें",
    liveFeed: "लाइव फीड — लोगों की राय",
    noReviews: "अभी तक कोई समीक्षा नहीं।",
    whatYouTasted: "आपने जो अभी चखा",
    badges: [
      { icon: "🌱", label: "100% वीगन", sub: "कोई पशु सामग्री नहीं" },
      { icon: "🌾", label: "ग्लूटेन-मुक्त", sub: "प्रमाणित ग्लूटेन-मुक्त" },
      { icon: "💪", label: "9.5g प्रोटीन", sub: "प्रति 100g" },
      { icon: "🫒", label: "जैतून का तेल", sub: "भुना हुआ — कभी तला नहीं" },
      { icon: "✨", label: "न्यूट्री-स्कोर A", sub: "पोषण उत्कृष्टता" },
      { icon: "🇫🇷", label: "जल्द ही फ्रांस में", sub: "राष्ट्रीय लॉन्च" },
    ],
    firstServed: "सबसे पहले परोसा जाए",
    signupDesc: "जैसे ही हम लॉन्च करते हैं, अपना AÉRI बॉक्स प्राप्त करने के लिए साइन अप करें।",
    signupBtn: "साइन अप करें",
    signupConf: "पंजीकरण पक्का! आपको सबसे पहले सूचित किया जाएगा।",
    discoverFlavors: "हमारे स्वादों की खोज करें →",
    ourStory: "हमारी कहानी",
    share: "अपनी खोज साझा करें",
    makhanaLine: "मखाना — असाधारण पॉप्ड बीज"
  }
};

/* ─── Section 16: Apéro Landing — Post-Tasting Experience ─── */
export default function AperoPage() {
  const { lang } = useLanguage();
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.fr;

  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [liveReviews, setLiveReviews] = useState<Review[]>([]);

  // डेटाबेस से पुराने रिव्यू लोड करना (Load old reviews from simulated database)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aeri_apero_reviews");
      if (saved) {
        setLiveReviews(JSON.parse(saved));
      } else {
        const defaultReviews = [
          { text: "Incroyablement léger ! J'adore le goût de la truffe.", date: "Il y a 2 min", flavor: "Gourmet Truffle Fusion" },
          { text: "Parfait pour l'apéro. Très croustillant.", date: "Il y a 5 min", flavor: "Himalayan Salt & Pepper" }
        ];
        setLiveReviews(defaultReviews);
        localStorage.setItem("aeri_apero_reviews", JSON.stringify(defaultReviews));
      }
    }
  }, []);

  // फीडबैक सबमिट हैंडलर (Feedback submission handler with simulated database write)
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateReview(feedback)) return;
    setIsSubmitting(true);

    // 800ms का डिले डेटाबेस सेव को सिमुलेट करने के लिए (Simulating database save)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const selectedFlavorObj = flavors.find((f) => f.id === selectedFlavor);
    const newReview = formatReview(feedback, selectedFlavorObj ? selectedFlavorObj.name : "Himalayan Salt & Pepper");

    const updated = [newReview, ...liveReviews];
    setLiveReviews(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("aeri_apero_reviews", JSON.stringify(updated));
    }

    setFeedback("");
    setFeedbackSubmitted(true);
    setIsSubmitting(false);
  };

  // ईमेल सबमिट हैंडलर
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen w-full flex flex-col items-center relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #F5E6D3 0%, #FDF8F3 40%, #FFFFFF 100%)" }}
      >
        {/* सूक्ष्म पृष्ठभूमि पैटर्न */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1C1C1C 0.5px, transparent 0.5px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 w-full max-w-2xl mx-auto px-5 py-10 pt-32 md:py-16 md:pt-40 flex flex-col items-center">
          {/* 1. हीरो हेडलाइन */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-3"
          >
            <span
              className="inline-block text-[10px] tracking-[0.4em] uppercase text-[#9E9689] font-semibold mb-4"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {t.exp}
            </span>
            <h1
              className="text-3xl md:text-5xl text-[#1C1C1C] leading-tight"
              style={{ fontFamily: "var(--font-didot)" }}
            >
              {t.headlinePart1}
              <br />
              <span className="italic text-[#8B7355]">{t.headlinePart2}</span>
            </h1>
          </motion.div>

          {/* 2. सबटाइटल */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center text-sm md:text-base text-[#6E6E73] leading-relaxed max-w-md mb-10"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {t.subtitle}
          </motion.p>

          {/* 3. फ्लेवर सिलेक्टर */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full mb-10"
          >
            <p
              className="text-center text-xs tracking-[0.2em] uppercase text-[#9E9689] font-semibold mb-4"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {t.flavorQ}
            </p>
            <div className="flex gap-3 justify-center">
              {flavors.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFlavor(f.id)}
                  className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
                    selectedFlavor === f.id
                      ? "border-[#8B7355] bg-white shadow-lg scale-105"
                      : "border-[#E0D5C8] bg-white/60 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <span className="text-2xl">{f.emoji}</span>
                  <span
                    className="text-[10px] font-medium text-[#4A4A4A] leading-tight text-center max-w-[80px]"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {f.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* 4. फीडबैक फॉर्म */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            onSubmit={handleFeedbackSubmit}
            className="w-full mb-8"
          >
            {!feedbackSubmitted ? (
              <>
                <label
                  className="block text-xs tracking-[0.15em] uppercase text-[#9E9689] font-semibold mb-2"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {t.impression}
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={t.placeholder}
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-[#E0D5C8] bg-white px-4 py-3 text-sm text-[#1C1C1C] placeholder-[#9E9689]/60 resize-none focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]/50 transition-all disabled:opacity-50"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !feedback.trim()}
                  className="w-full mt-3 rounded-xl py-3.5 text-sm font-semibold tracking-wide text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #1C1C1C 0%, #3A3A3A 100%)",
                    fontFamily: "var(--font-montserrat), sans-serif",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 width-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{t.sending}</span>
                    </>
                  ) : (
                    <span>{t.sendReview}</span>
                  )}
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 px-4 rounded-xl bg-white border border-[#E0D5C8]"
              >
                <span className="text-3xl mb-2 block">🙏</span>
                <p
                  className="text-sm text-[#4A4A4A] font-semibold mb-4"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {t.thanks}
                </p>
                <button
                  type="button"
                  onClick={() => setFeedbackSubmitted(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#8B7355] border border-[#8B7355]/30 bg-[#F5E6D3]/35 hover:bg-[#F5E6D3]/60 transition-all"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {t.writeAnother}
                </button>
              </motion.div>
            )}
          </motion.form>

          {/* 4.5 लाइव फीडबैक फीड */}
          <div className="w-full mb-10 p-5 rounded-2xl bg-white/50 border border-[#E0D5C8]/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p
                className="text-xs tracking-[0.2em] uppercase text-[#8B7355] font-bold"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {t.liveFeed}
              </p>
            </div>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {liveReviews.length === 0 ? (
                <p className="text-xs text-[#9E9689] italic text-center py-4">{t.noReviews}</p>
              ) : (
                liveReviews.map((rev, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="p-3.5 rounded-xl bg-white border border-[#E0D5C8]/40 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span
                        className="inline-block px-2 py-0.5 rounded bg-[#F5E6D3] text-[9px] font-bold text-[#8B7355] uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      >
                        {rev.flavor}
                      </span>
                      <span
                        className="text-[9px] text-[#9E9689]"
                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                      >
                        {rev.date}
                      </span>
                    </div>
                    <p
                      className="text-xs text-[#1C1C1C] italic leading-relaxed"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* 5. न्यूट्रिशन बैज ग्रिड */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="w-full mb-10"
          >
            <p
              className="text-center text-xs tracking-[0.2em] uppercase text-[#9E9689] font-semibold mb-5"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {t.whatYouTasted}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {t.badges.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                  className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl bg-white border border-[#E0D5C8]/80 hover:shadow-md hover:border-[#8B7355]/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F5E6D3]/60 flex items-center justify-center text-xl">
                    {badge.icon}
                  </div>
                  <span
                    className="text-[11px] font-semibold text-[#1C1C1C] text-center"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {badge.label}
                  </span>
                  <span
                    className="text-[9px] text-[#9E9689] text-center leading-tight"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {badge.sub}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 6. ईमेल कैप्चर — वेटलिस्ट */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="w-full mb-10 p-6 rounded-2xl bg-white border border-[#E0D5C8] shadow-sm"
          >
            <p
              className="text-center text-sm text-[#1C1C1C] font-semibold mb-1"
              style={{ fontFamily: "var(--font-didot)" }}
            >
              {t.firstServed}
            </p>
            <p
              className="text-center text-xs text-[#9E9689] mb-5"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {t.signupDesc}
            </p>

            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 rounded-xl border border-[#E0D5C8] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1C1C1C] placeholder-[#9E9689]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 focus:border-[#8B7355]/50 transition-all"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                />
                <button
                  type="submit"
                  className="rounded-xl px-6 py-3 text-sm font-semibold tracking-wide text-white shrink-0 transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #1C1C1C 0%, #3A3A3A 100%)",
                    fontFamily: "var(--font-montserrat), sans-serif",
                  }}
                >
                  {t.signupBtn}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-2"
              >
                <span className="text-2xl mb-1 block">✉️</span>
                <p
                  className="text-sm text-[#4A4A4A] font-medium"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {t.signupConf}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* 7. डिस्कवरी लिंक */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="w-full flex flex-col sm:flex-row gap-3 mb-10"
          >
            <Link
              href="/products"
              className="flex-1 text-center rounded-xl py-3.5 text-sm font-semibold tracking-wide text-white transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #8B7355 0%, #A68B64 100%)",
                fontFamily: "var(--font-montserrat), sans-serif",
              }}
            >
              {t.discoverFlavors}
            </Link>
            <Link
              href="/brand"
              className="flex-1 text-center rounded-xl py-3.5 text-sm font-semibold tracking-wide text-[#1C1C1C] border border-[#E0D5C8] bg-white transition-all hover:bg-[#FAFAF7] hover:border-[#8B7355]/30"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {t.ourStory}
            </Link>
          </motion.div>

          {/* 8. सोशल शेयर CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="text-center mb-8"
          >
            <p
              className="text-xs text-[#9E9689] mb-3"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {t.share}
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="https://www.instagram.com/aerisnacks/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                  fontFamily: "var(--font-montserrat), sans-serif",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                @aerisnacks
              </a>
            </div>
          </motion.div>

          {/* 9. मिनिमल ब्रांडिंग */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-auto pt-6 flex flex-col items-center gap-2"
          >
            <span
              className="text-xl tracking-[0.4em] uppercase text-[#1C1C1C] font-semibold"
              style={{ fontFamily: "var(--font-didot)" }}
            >
              AÉRI
            </span>
            <span
              className="text-[9px] tracking-[0.3em] uppercase text-[#9E9689]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {t.makhanaLine}
            </span>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
