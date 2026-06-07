"use client";

import { useLanguage } from "@/context/LanguageContext";

// बैज स्ट्रिप — हर French consumer को 5 सेकंड में पता चलना चाहिए कि यह प्रोडक्ट safe, healthy और suitable है
// होमपेज animation के तुरंत बाद, product grid से पहले

const translations = {
  fr: [
    { icon: "✦", text: "Torréfié à l'huile d'olive vierge extra", sub: "jamais frit" },
    { icon: "✦", text: "Vegan", sub: null },
    { icon: "✦", text: "Sans Gluten", sub: null },
    { icon: "✦", text: "9,5g Protéines", sub: "/ 100g" },
    { icon: "✦", text: "Nutri-Score A", sub: null },
    { icon: "✦", text: "0 Cholestérol", sub: null },
    { icon: "✦", text: "Sans Additifs", sub: null },
    { icon: "✦", text: "Clean Label", sub: "5 ingrédients seulement" },
  ],
  en: [
    { icon: "✦", text: "Roasted in extra virgin olive oil", sub: "never fried" },
    { icon: "✦", text: "Vegan", sub: null },
    { icon: "✦", text: "Gluten-Free", sub: null },
    { icon: "✦", text: "9.5g Protein", sub: "/ 100g" },
    { icon: "✦", text: "Nutri-Score A", sub: null },
    { icon: "✦", text: "0 Cholesterol", sub: null },
    { icon: "✦", text: "No Additives", sub: null },
    { icon: "✦", text: "Clean Label", sub: "only 5 ingredients" },
  ],
  hi: [
    { icon: "✦", text: "एक्स्ट्रा वर्जिन जैतून के तेल में भुना हुआ", sub: "कभी नहीं तला गया" },
    { icon: "✦", text: "शाकाहारी (वीगन)", sub: null },
    { icon: "✦", text: "ग्लूटेन मुक्त", sub: null },
    { icon: "✦", text: "9.5 ग्राम प्रोटीन", sub: "/ 100 ग्राम" },
    { icon: "✦", text: "न्यूट्रि-स्कोर ए", sub: null },
    { icon: "✦", text: "शून्य कोलेस्ट्रॉल", sub: null },
    { icon: "✦", text: "कोई योजक (Additives) नहीं", sub: null },
    { icon: "✦", text: "क्लीन लेबल", sub: "केवल 5 सामग्री" },
  ]
};

export default function BadgeStrip() {
  const { lang } = useLanguage();
  const badges = translations[lang as keyof typeof translations] || translations.fr;
  
  // 4 sets of badges for a seamless infinite loop at any viewport width
  const allBadges = [...badges, ...badges, ...badges, ...badges];
  return (
    <section
      className="w-full overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #1A1A1A 0%, #242424 50%, #1A1A1A 100%)",
        borderTop: "1px solid rgba(212,175,55,0.15)",
        borderBottom: "1px solid rgba(212,175,55,0.15)",
      }}
      aria-label="Informations nutritionnelles et qualité AÉRI"
    >
      {/* Top gold accent line */}
      <div
        className="w-full h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.6) 20%, rgba(212,175,55,0.8) 50%, rgba(212,175,55,0.6) 80%, transparent 100%)",
        }}
      />

      {/* Badge marquee row */}
      <div className="relative py-3.5">
        {/* Left fade gradient */}
        <div
          className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, #1A1A1A 0%, transparent 100%)",
          }}
        />
        {/* Right fade gradient */}
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(270deg, #1A1A1A 0%, transparent 100%)",
          }}
        />

        {/* Scrolling badges — 4 sets, animate-badge-strip defined in globals.css */}
        <div
          className="flex whitespace-nowrap animate-badge-strip"
          style={{ willChange: "transform" }}
        >
          {allBadges.map((badge, i) => (
            <span key={i} className="inline-flex items-center shrink-0">
              {/* Badge pill */}
              <span
                className="inline-flex items-center gap-1.5 px-4 py-1"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {/* Gold checkmark */}
                <span
                  className="text-[9px] font-black shrink-0"
                  style={{ color: "#D4AF37" }}
                  aria-hidden="true"
                >
                  ✓
                </span>
                {/* Main label */}
                <span className="text-white text-[11px] font-semibold tracking-[0.08em] uppercase">
                  {badge.text}
                </span>
                {/* Sub-label (lighter, same line) */}
                {badge.sub && (
                  <span
                    className="text-[11px] font-normal tracking-[0.05em]"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    — {badge.sub}
                  </span>
                )}
              </span>

              {/* Gold dot separator */}
              <span
                className="inline-block w-[3px] h-[3px] rounded-full mx-2 shrink-0"
                style={{ background: "#D4AF37", opacity: 0.6 }}
                aria-hidden="true"
              />
            </span>
          ))}
        </div>
      </div>

      {/* Bottom gold accent line */}
      <div
        className="w-full h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.6) 20%, rgba(212,175,55,0.8) 50%, rgba(212,175,55,0.6) 80%, transparent 100%)",
        }}
      />
    </section>
  );
}
