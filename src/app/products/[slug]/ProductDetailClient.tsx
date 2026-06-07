"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

import { productData } from "@/lib/productData";

/* ─── animation helpers ─── */
const fadeUp: any = {
  hidden: { opacity: 0, y: 36 },
  visible: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: d },
  }),
};

const fadeIn: any = {
  hidden: { opacity: 0 },
  visible: (d: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: d },
  }),
};

/* ─── component ─── */
export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = productData[slug];
  const { addToCart } = useCart();

  const isComingSoon = slug === "coming-soon";
  // भाषा अब ग्लोबल टॉगल से आती है, स्लग से नहीं (Language now comes from global toggle, not slug)
  const { lang } = useLanguage();
  const isFrench = lang === 'fr';

  /* 404 */
  if (!product) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "#F5E6D3",
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        <div className="text-center">
          <h1
            className="text-5xl font-bold mb-4 tracking-tight"
            style={{
              color: "#1d1b1a",
              fontFamily: "var(--font-didot), serif",
            }}
          >
            {isFrench ? "Produit Non Trouvé" : "Product Not Found"}
          </h1>
          <Link
            href="/products"
            className="text-sm tracking-widest uppercase hover:opacity-70 transition-opacity"
            style={{ color: "#675d4e" }}
          >
            ← {isFrench ? "Retour aux Produits" : "Back to Products"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "#F5E6D3",
        color: "#1d1b1a",
        fontFamily: "var(--font-montserrat), sans-serif",
      }}
    >
      {/* ════════ FIXED NAVBAR ════════ */}
      {/* Navbar */}
      <Navbar />

      {/* ════════ HERO ════════ */}
      <section
        className="pt-32 pb-16 md:pt-40 md:pb-28 px-6 md:px-12"
        style={{ backgroundColor: product.color }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Text side */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="w-full md:w-1/2 flex flex-col justify-center"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-[11px] font-semibold tracking-[0.35em] uppercase mb-5 block"
              style={{
                color: "#4c463e",
                fontFamily: "var(--font-montserrat), sans-serif",
              }}
            >
              {product.tagline}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              custom={0.1}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
              style={{ fontFamily: "var(--font-didot), serif" }}
            >
              {product.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="text-[17px] leading-[1.8] mb-6 max-w-lg"
              style={{
                color: "#4c463e",
                fontFamily: "var(--font-lora), serif",
              }}
            >
              {product.heroDesc}
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={0.25}
              className="mb-10"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              <span className="text-2xl font-bold" style={{ color: "#1d1b1a" }}>€5.99</span>
              <span className="text-sm font-medium tracking-wide uppercase ml-2" style={{ color: "#675d4e" }}>/ 50g</span>
            </motion.div>

            {!isComingSoon && (
              <motion.div
                variants={fadeUp}
                custom={0.35}
                className="flex flex-wrap gap-4"
              >
                {slug === "raw-bulk-kernels" ? (
                  <button
                    onClick={() => {
                      window.location.href = "/espace-pro";
                    }}
                    className="px-8 py-4 rounded-2xl font-medium tracking-wide transition-all duration-300 hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: "#1C1C1C",
                      color: "#fff",
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: "14px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Contact B2B
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      addToCart({
                        id: slug,
                        name: product.title,
                        price: 5.99,
                        image: product.image,
                      });
                    }}
                    className="px-8 py-4 rounded-2xl font-medium tracking-wide transition-all duration-300 hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: "#1C1C1C",
                      color: "#fff",
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: "14px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {isFrench ? "Ajouter au Panier" : "Add to Cart"}
                  </button>
                )}
                <Link
                  href="/products"
                  className="px-8 py-4 rounded-2xl font-medium tracking-wide transition-all duration-300 hover:bg-[#1d1b1a]/5"
                  style={{
                    border: "1px solid rgba(29,27,26,0.12)",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "14px",
                    letterSpacing: "0.05em",
                    color: "#1d1b1a",
                  }}
                >
                  {isFrench ? "Tous les Produits" : "All Products"}
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <div
              className="relative w-[300px] h-[300px] md:w-[460px] md:h-[460px] group"
              style={{
                filter:
                  "drop-shadow(0 10px 30px rgba(29,27,26,0.15))",
              }}
            >
              <Image
                key={lang}
                src={product.image}
                alt={`makhana ${product.title.toLowerCase()} sachet 50g aeri snacks`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-contain transition-transform duration-700 ease-out ${product.image.includes("flavor_salt") ? "p-10 group-hover:scale-105" : product.image.includes("flavor_truffle") ? "scale-110 group-hover:scale-125" : "group-hover:scale-105"}`}
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ COMING SOON ════════ */}
      {isComingSoon ? (
        <section className="py-32 px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-md mx-auto"
          >
            <motion.div
              variants={fadeIn}
              custom={0}
              className="w-20 h-20 rounded-full border-4 animate-spin mx-auto mb-10"
              style={{
                borderColor: "rgba(29,27,26,0.08)",
                borderTopColor: "#675d4e",
              }}
            />
            <motion.h2
              variants={fadeUp}
              custom={0.1}
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "var(--font-didot), serif" }}
            >
              {isFrench ? "En Développement" : "In Development"}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="mb-10 text-lg leading-relaxed"
              style={{
                color: "#4c463e",
                fontFamily: "var(--font-lora), serif",
              }}
            >
              {isFrench ? "Notre équipe prépare la prochaine saveur inoubliable. Inscrivez-vous pour être le premier informé de son lancement." : "Our team is crafting the next unforgettable flavor. Sign up to be the first to know when it launches."}
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={0.3}
              className="flex justify-center gap-3"
            >
              <input
                type="email"
                placeholder={isFrench ? "votre@email.com" : "your@email.com"}
                className="flex-1 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 text-sm focus:ring-[#675d4e]/30"
                style={{
                  border: "1px solid rgba(29,27,26,0.1)",
                  fontFamily: "var(--font-montserrat), sans-serif",
                }}
              />
              <button
                className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:opacity-90 shrink-0 cursor-pointer text-sm"
                style={{
                  backgroundColor: "#675d4e",
                  color: "#fff",
                  fontFamily: "var(--font-montserrat), sans-serif",
                }}
              >
                {isFrench ? "M'avertir" : "Notify Me"}
              </button>
            </motion.div>
          </motion.div>
        </section>
      ) : (
        <>
          {/* ════════ THE STORY ════════ */}
          <section className="py-20 md:py-28 px-6 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="max-w-3xl mx-auto"
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="text-3xl md:text-4xl font-bold mb-8"
                style={{ fontFamily: "var(--font-didot), serif" }}
              >
                {isFrench ? "L\u2019Histoire" : "The Story"}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={0.1}
                className="text-[17px] leading-[2]"
                style={{
                  color: "rgba(29,27,26,0.65)",
                  fontFamily: "var(--font-lora), serif",
                }}
              >
                {product.story}
              </motion.p>
            </motion.div>
          </section>

          {/* subtle divider */}
          <div
            className="h-px max-w-3xl mx-auto"
            style={{ backgroundColor: "rgba(29,27,26,0.06)" }}
          />

          {/* ════════ HOW IT'S MADE ════════ */}
          <section className="py-20 md:py-28 px-6 md:px-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="max-w-3xl mx-auto"
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="text-3xl md:text-4xl font-bold mb-8"
                style={{ fontFamily: "var(--font-didot), serif" }}
              >
                {isFrench ? "Notre Procédé" : "Our Process"}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={0.1}
                className="text-[17px] leading-[2]"
                style={{
                  color: "rgba(29,27,26,0.65)",
                  fontFamily: "var(--font-lora), serif",
                }}
              >
                {product.process}
              </motion.p>
            </motion.div>
          </section>

          {/* ════════ NUTRITION & INGREDIENTS ════════ */}
          <section
            className="py-20 md:py-28 px-6 md:px-12"
            style={{ backgroundColor: "#f2edea" }}
          >
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nutrition Table */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={0}
                className="p-8 md:p-10 rounded-3xl"
                style={{
                  backgroundColor: "#fef8f6",
                  border: "1px solid rgba(29,27,26,0.05)",
                  boxShadow: "0 10px 30px -10px rgba(29,27,26,0.08)",
                }}
              >
                <h3
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-didot), serif" }}
                >
                  {isFrench ? "Valeurs Nutritionnelles" : "Nutritional Values"}
                </h3>
                <span
                  className="text-xs block mb-7"
                  style={{
                    color: "#4c463e",
                    fontFamily: "var(--font-montserrat), sans-serif",
                  }}
                >
                  {isFrench ? "par sachet de 50g" : "per 50g pack"}
                </span>

                <div className="space-y-0">
                  {product.nutrition.map((n, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-3"
                      style={{
                        borderBottom:
                          i < product.nutrition.length - 1
                            ? "1px solid rgba(29,27,26,0.06)"
                            : "none",
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{ color: "#4c463e" }}
                      >
                        {n.label}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#1d1b1a" }}
                      >
                        {n.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Ingredients + Allergens */}
              <div className="flex flex-col gap-6">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={0.1}
                  className="p-8 rounded-3xl flex-1"
                  style={{
                    backgroundColor: "#fef8f6",
                    border: "1px solid rgba(29,27,26,0.05)",
                    boxShadow: "0 10px 30px -10px rgba(29,27,26,0.08)",
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "var(--font-didot), serif" }}
                  >
                    {isFrench ? "Ingrédients" : "Ingredients"}
                  </h3>
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{
                      color: "#4c463e",
                      fontFamily: "var(--font-lora), serif",
                    }}
                  >
                    {product.ingredients}
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={0.2}
                  className="p-8 rounded-3xl flex-1"
                  style={{
                    backgroundColor: "#fef8f6",
                    border: "1px solid rgba(29,27,26,0.05)",
                    boxShadow: "0 10px 30px -10px rgba(29,27,26,0.08)",
                  }}
                >
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "var(--font-didot), serif" }}
                  >
                    {isFrench ? "Informations Allergènes" : "Allergen Information"}
                  </h3>
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{
                      color: "#4c463e",
                      fontFamily: "var(--font-lora), serif",
                    }}
                  >
                    {product.allergens}
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ════════ PAIRINGS & DETAILS ════════ */}
          <section className="py-20 md:py-28 px-6 md:px-12">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pairing Suggestions */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={0}
                className="p-8 rounded-3xl"
                style={{
                  backgroundColor: "#f2edea",
                  border: "1px solid rgba(29,27,26,0.05)",
                }}
              >
                <h3
                  className="text-xl font-bold mb-5"
                  style={{ fontFamily: "var(--font-didot), serif" }}
                >
                  {isFrench ? "Suggestions d\u0027Accords" : "Pairing Suggestions"}
                </h3>
                <ul className="space-y-3">
                  {product.pairings.map((p, i) => (
                    <li
                      key={i}
                      className="text-sm leading-relaxed flex gap-2.5"
                      style={{
                        color: "#4c463e",
                        fontFamily: "var(--font-lora), serif",
                      }}
                    >
                      <span
                        className="mt-0.5 shrink-0"
                        style={{ color: "#cec5bb" }}
                      >
                        •
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Storage + Pack Size */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={0.1}
                className="p-8 rounded-3xl"
                style={{
                  backgroundColor: "#f2edea",
                  border: "1px solid rgba(29,27,26,0.05)",
                }}
              >
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-didot), serif" }}
                >
                  {isFrench ? "Conservation" : "Storage"}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-8"
                  style={{
                    color: "#4c463e",
                    fontFamily: "var(--font-lora), serif",
                  }}
                >
                  {product.storage}
                </p>

                <h3
                  className="text-xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-didot), serif" }}
                >
                  {isFrench ? "Format" : "Pack Size"}
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: "#4c463e",
                    fontFamily: "var(--font-lora), serif",
                  }}
                >
                  {product.weight}
                </p>
              </motion.div>

              {/* Origin & Certifications */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={0.2}
                className="p-8 rounded-3xl"
                style={{
                  backgroundColor: "#f2edea",
                  border: "1px solid rgba(29,27,26,0.05)",
                }}
              >
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-didot), serif" }}
                >
                  {isFrench ? "Origine & Traçabilité" : "Origin & Traceability"}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "#4c463e",
                    fontFamily: "var(--font-lora), serif",
                  }}
                >
                  {product.origin}
                </p>

                <div
                  className="mt-7 pt-6"
                  style={{ borderTop: "1px solid rgba(29,27,26,0.08)" }}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] block mb-2"
                    style={{
                      color: "#4c463e",
                      fontFamily: "var(--font-montserrat), sans-serif",
                    }}
                  >
                    {isFrench ? "Certifications" : "Certifications"}
                  </span>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#1d1b1a" }}
                  >
                    FSSAI · NABL · {isFrench ? "Conforme UE" : "EU Compliant"}
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ════════ CTA ════════ */}
          <section
            className="py-24 px-6 text-center"
            style={{ backgroundColor: "#32302f" }}
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{
                  color: "#fef8f6",
                  fontFamily: "var(--font-didot), serif",
                }}
              >
                {isFrench ? "Découvrez Notre Collection" : "Discover Our Collection"}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={0.1}
                className="max-w-lg mx-auto mb-10 text-[16px]"
                style={{
                  color: "rgba(254,248,246,0.5)",
                  fontFamily: "var(--font-lora), serif",
                }}
              >
                {isFrench ? "L\u0027équilibre parfait entre tradition et innovation." : "Experience the perfect balance of tradition and innovation."}
              </motion.p>
              <motion.div variants={fadeUp} custom={0.2}>
                <Link
                  href="/products"
                  className="inline-block px-9 py-4 rounded-2xl font-medium transition-all duration-300 hover:opacity-90 text-sm tracking-wide"
                  style={{
                    backgroundColor: "#fef8f6",
                    color: "#32302f",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {isFrench ? "Découvrir Toutes les Saveurs" : "Explore All Flavors"}
                </Link>
              </motion.div>
            </motion.div>
          </section>
        </>
      )}

      <Footer />
    </main>
  );
}
