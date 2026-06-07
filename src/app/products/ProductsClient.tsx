"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlavorExplorer from "@/components/FlavorExplorer";

/* ──────────────────────────── Translations ──────────────────────────── */

const t = {
  fr: {
    nav: {
      brand: "AÉRI",
      boutique: "Boutique",
      espacesPro: "Espace Pro",
      laboratoire: "Laboratoire",
      contact: "Contact",
    },
    hero: {
      title: "L'Élégance Botanique",
      subtitle:
        "Des saveurs d'exception, soufflées avec passion. Découvrez notre collection artisanale de Makhana premium.",
    },
    products: [
      {
        id: "salt",
        name: "Himalayan Salt & Pepper",
        category: "SIGNATURE",
        desc: "La pureté du sel rose de l'Himalaya mariée au piquant subtil du poivre noir concassé. Torréfié à l'huile d'olive — jamais frit.",
        price: "€5.99 / 50g",
        image: "/flavor_salt_v2.png",
      },
      {
        id: "truffle",
        name: "Truffle Fusion",
        category: "GOURMET",
        desc: "Une infusion luxueuse d'huile de truffe blanche et d'éclats de truffe noire d'été. Torréfié à l'huile d'olive — jamais frit.",
        price: "€5.99 / 50g",
        image: "/flavor_truffle_v2.png",
      },
      {
        id: "herb",
        name: "Mediterranean Herb",
        category: "VÉGÉTAL",
        desc: "Un bouquet aromatique d'origan sauvage, romarin et basilic séché au soleil. Torréfié à l'huile d'olive — jamais frit.",
        price: "€5.99 / 50g",
        image: "/flavor_herbes_v2.png",
      },
      {
        id: "caramel-salt",
        name: "Caramel & Beurre Salé",
        category: "SUCRÉ",
        desc: "Un mélange luxueux de caramel riche et d'une pointe de sel de mer. Torréfié, jamais frit.",
        price: "€5.99 / 50g",
        image: "/flavor_caramel_salt.png",
      },
      {
        id: "dark-chocolate",
        name: "Chocolat Noir 70%",
        category: "SUCRÉ",
        desc: "Chocolat noir 70% d'origine unique enrobant délicatement notre Makhana soufflé premium.",
        price: "€5.99 / 50g",
        image: "/flavor_dark_chocolate.png",
      },
      {
        id: "lemon-mint",
        name: "Citron & Menthe",
        category: "VÉGÉTAL",
        desc: "Un éclat vif et citronné de citron associé à la fraîcheur de la menthe.",
        price: "€5.99 / 50g",
        image: "/flavor_lemon_mint.png",
      },
      {
        id: "peanut-butter",
        name: "Beurre de Cacahuète",
        category: "SUCRÉ",
        desc: "Beurre de cacahuète onctueux et torréfié enrobant naturellement notre Makhana.",
        price: "€5.99 / 50g",
        image: "/flavor_peanut_butter.png",
      },
      {
        id: "peri-peri",
        name: "Peri Peri",
        category: "ÉPICÉ",
        desc: "Un mélange audacieux et vibrant de piment africain, d'agrumes et d'ail.",
        price: "€5.99 / 50g",
        image: "/flavor_peri_peri.png",
      },
      {
        id: "smokey-bbq",
        name: "BBQ Fumé",
        category: "GOURMET",
        desc: "Notes profondes et fumées de caryer associées à une touche de douceur.",
        price: "€5.99 / 50g",
        image: "/flavor_smokey_bbq.png",
      },
      {
        id: "tangy-tomato",
        name: "Tomate Acidulée",
        category: "VÉGÉTAL",
        desc: "L'éclat sucré et acidulé des tomates mûries au soleil avec des herbes subtiles.",
        price: "€5.99 / 50g",
        image: "/flavor_tangy_tomato.png",
      }
    ],
    addToCart: "Ajouter au Panier",
    voting: {
      title: "L'Atelier des Saveurs",
      subtitle:
        "Votez pour la prochaine saveur AÉRI. Survolez pour révéler les candidats.",
      option1: "Piment d'Espelette & Sel de Guérande",
      option2: "Fromage de Chèvre & Miel",
      voteBtn: "Voter",
      voted: "Vote enregistré !",
    },
    waitlist: {
      title: "Bientôt Disponible",
      body: "Ce produit n'est pas encore en vente. Inscrivez-vous à notre liste d'attente pour être prévenu dès sa sortie.",
      placeholder: "votre@email.com",
      cta: "M'inscrire",
      close: "Fermer",
      success: "Merci ! Nous vous tiendrons informé.",
    },
    footer: {
      copy: "© 2024 AÉRI SNACKS. ÉLÉGANCE BOTANIQUE.",
      links: [
        "Mentions Légales",
        "CGV B2B",
        "Contact",
        "Boutique",
        "Espace Pro",
        "Laboratoire",
      ],
    },
  },
  en: {
    nav: {
      brand: "AÉRI",
      boutique: "Boutique",
      espacesPro: "Pro Space",
      laboratoire: "Laboratory",
      contact: "Contact",
    },
    hero: {
      title: "Botanical Elegance",
      subtitle:
        "Exceptional flavors, passionately puffed. Discover our artisanal collection of premium Makhana.",
    },
    products: [
      {
        id: "salt",
        name: "Himalayan Salt & Pepper",
        category: "SIGNATURE",
        desc: "The purity of Himalayan pink salt married with the subtle kick of crushed black pepper. Roasted in olive oil — never fried.",
        price: "€5.99 / 50g",
        image: "/flavor_salt_v2.png",
      },
      {
        id: "truffle",
        name: "Truffle Fusion",
        category: "GOURMET",
        desc: "A luxurious infusion of white truffle oil and summer black truffle shavings. Roasted in olive oil — never fried.",
        price: "€5.99 / 50g",
        image: "/flavor_truffle_v2.png",
      },
      {
        id: "herb",
        name: "Mediterranean Herb",
        category: "VÉGÉTAL",
        desc: "An aromatic bouquet of wild oregano, rosemary, and sun-dried basil. Roasted in olive oil — never fried.",
        price: "€5.99 / 50g",
        image: "/flavor_herbes_v2.png",
      },
      {
        id: "caramel-salt",
        name: "Caramel & Sea Salt",
        category: "SWEET",
        desc: "A luxurious blend of rich caramel and a hint of sea salt. Roasted, never fried.",
        price: "€5.99 / 50g",
        image: "/flavor_caramel_salt.png",
      },
      {
        id: "dark-chocolate",
        name: "Dark Chocolate 70%",
        category: "SWEET",
        desc: "Rich, 70% single-origin dark chocolate gently coating our premium puffed Makhana.",
        price: "€5.99 / 50g",
        image: "/flavor_dark_chocolate.png",
      },
      {
        id: "lemon-mint",
        name: "Lemon & Mint",
        category: "BOTANICAL",
        desc: "A bright, citrusy burst of lemon paired with cooling mint.",
        price: "€5.99 / 50g",
        image: "/flavor_lemon_mint.png",
      },
      {
        id: "peanut-butter",
        name: "Peanut Butter",
        category: "SWEET",
        desc: "Smooth, roasted peanut butter naturally coats our Makhana for a protein-packed experience.",
        price: "€5.99 / 50g",
        image: "/flavor_peanut_butter.png",
      },
      {
        id: "peri-peri",
        name: "Peri Peri",
        category: "SPICY",
        desc: "A bold, vibrant blend of African bird's eye chili, citrus, and garlic.",
        price: "€5.99 / 50g",
        image: "/flavor_peri_peri.png",
      },
      {
        id: "smokey-bbq",
        name: "Smokey BBQ",
        category: "GOURMET",
        desc: "Deep, smoky hickory notes paired with a touch of molasses sweetness and savory spices.",
        price: "€5.99 / 50g",
        image: "/flavor_smokey_bbq.png",
      },
      {
        id: "tangy-tomato",
        name: "Tangy Tomato",
        category: "BOTANICAL",
        desc: "The sweet and tart brilliance of sun-ripened tomatoes, seasoned with subtle herbs.",
        price: "€5.99 / 50g",
        image: "/flavor_tangy_tomato.png",
      }
    ],
    addToCart: "Add to Cart",
    voting: {
      title: "Flavor Workshop",
      subtitle:
        "Vote for the next AÉRI flavor. Hover to reveal the candidates.",
      option1: "Espelette Pepper & Guérande Salt",
      option2: "Goat Cheese & Honey",
      voteBtn: "Vote",
      voted: "Vote registered!",
    },
    waitlist: {
      title: "Coming Soon",
      body: "This product is not yet available for purchase. Join our waitlist to be notified as soon as it launches.",
      placeholder: "your@email.com",
      cta: "Join Waitlist",
      close: "Close",
      success: "Thank you! We'll keep you posted.",
    },
    footer: {
      copy: "© 2024 AÉRI SNACKS. BOTANICAL ELEGANCE.",
      links: [
        "Legal Notice",
        "B2B T&C",
        "Contact",
        "Boutique",
        "Pro Space",
        "Laboratory",
      ],
    },
  },
};

/* ──────────────────────────── Category badge colors ──────────────────────────── */

const categoryColors: Record<string, string> = {
  SIGNATURE: "bg-amber-100 text-amber-800",
  GOURMET: "bg-rose-100 text-rose-800",
  "VÉGÉTAL": "bg-pink-100 text-pink-800",
  "BOTANICAL": "bg-emerald-100 text-emerald-800",
  "SUCRÉ": "bg-orange-100 text-orange-800",
  "SWEET": "bg-orange-100 text-orange-800",
  "ÉPICÉ": "bg-red-100 text-red-800",
  "SPICY": "bg-red-100 text-red-800",
  "B2B / VRAC": "bg-sky-100 text-sky-800",
  "Espace Pro": "bg-sky-100 text-sky-800",
  "Pro Space": "bg-sky-100 text-sky-800",
};

/* ──────────────────────────── Animation Variants ──────────────────────────── */

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ──────────────────────────── Component ──────────────────────────── */

export default function ProductsPage() {
  const { lang, toggle } = useLanguage();
  const d = t[lang as keyof typeof t] || t.en;

  const [voted, setVoted] = useState<Record<number, boolean>>({});

  const handleVote = useCallback((idx: number) => {
    setVoted((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => setVoted((prev) => ({ ...prev, [idx]: false })), 2200);
  }, []);

  return (
    <>
      {/* ── Inline custom styles ─────────────────────────────────────── */}
      <style jsx global>{`
        .shadow-ambient {
          box-shadow: 0 10px 30px -10px rgba(29, 27, 26, 0.15);
        }
        .shadow-ambient-lg {
          box-shadow: 0 16px 48px -12px rgba(29, 27, 26, 0.22);
        }
      `}</style>

      <main
        className="min-h-screen text-[#1d1b1a]"
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          background: "#F5E6D3",
        }}
      >
        {/* ═══════════════════════ NAVBAR ═══════════════════════ */}
        <Navbar />

        {/* ═══════════════════════ FLAVOR EXPLORER (Matches Homepage) ═══════════════════════ */}
        <div className="pt-20">
          <FlavorExplorer />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#1d1b1a]"
            style={{ fontFamily: "var(--font-didot), serif" }}
          >
            {d.hero.title}
          </h1>
          <p
            className="text-[#4c463e] max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {d.hero.subtitle}
          </p>
        </motion.div>

        {/* ═══════════════════════ VOTING SECTION ═══════════════════════ */}
        <section
          className="py-20 px-6 md:px-12"
          style={{ backgroundColor: "#f2edea" }}
        >
          <div className="max-w-4xl mx-auto text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{
                fontFamily:
                  "var(--font-didot), var(--font-lora), serif",
                color: "#1d1b1a",
              }}
            >
              {d.voting.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-sm md:text-base"
              style={{ color: "#4c463e" }}
            >
              {d.voting.subtitle}
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { img: "/flavor_salt_v2.png", label: d.voting.option1 },
              { img: "/flavor_mystery.png", label: d.voting.option2 },
            ].map((opt, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group relative rounded-2xl overflow-hidden border"
                style={{
                  borderColor: "#cec5bb",
                  backgroundColor: "#ffffff",
                }}
              >
                {/* Blurred image that unblurs on hover */}
                <div className="relative w-full aspect-[4/3] overflow-hidden" style={{ backgroundColor: "#f2edea" }}>
                  <Image
                    src={opt.img}
                    alt={opt.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-contain transition-all duration-700 ease-out blur-lg group-hover:blur-0 group-hover:scale-105 ${idx === 0 ? "p-12" : "p-6"}`}
                  />
                  {/* Mystery overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 group-hover:opacity-0">
                    <span
                      className="text-3xl"
                      role="img"
                      aria-label="mystery"
                    >
                      ?
                    </span>
                  </div>
                </div>

                {/* Label + vote */}
                <div className="px-6 py-5 flex items-center justify-between gap-4">
                  <h4
                    className="text-sm md:text-base font-semibold"
                    style={{
                      fontFamily:
                        "var(--font-didot), serif",
                      color: "#1d1b1a",
                    }}
                  >
                    {opt.label}
                  </h4>

                  <button
                    onClick={() => handleVote(idx)}
                    disabled={!!voted[idx]}
                    className="relative shrink-0 px-5 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 active:translate-y-[2px] active:shadow-none disabled:opacity-70"
                    style={{
                      background: voted[idx]
                        ? "linear-gradient(to bottom, #D4AF37, #B8941E)"
                        : "linear-gradient(to bottom, #fde68a, #fbbf24)",
                      color: voted[idx] ? "#FFFFFF" : "#78350f",
                      borderTop: "1px solid rgba(255,255,255,0.6)",
                      boxShadow:
                        "0 4px 12px -2px rgba(251,191,36,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
                    }}
                  >
                    {voted[idx] ? d.voting.voted : d.voting.voteBtn}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════ FOOTER ═══════════════════════ */}
        <Footer />
      </main>
    </>
  );
}
