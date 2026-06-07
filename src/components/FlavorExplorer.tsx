"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

const t = {
  fr: {
    title: "L'Élégance Botanique",
    subtitle: "Découvrez notre collection artisanale de Makhana — Graines Soufflées d'Exception.",
    products: [
      {
        id: "salt",
        name: "Pristine Himalayan Salt & Pepper",
        category: "SIGNATURE",
        desc: "La pureté du sel rose de l'Himalaya mariée au piquant subtil du poivre noir concassé. Torréfié à l'huile d'olive — jamais frit.",
        price: "€5.99 / 50g",
        image: "/flavor_salt_v2.png",
        badge: "Nutri-Score A",
      },
      {
        id: "truffle",
        name: "Gourmet Truffle Fusion",
        category: "GOURMET",
        desc: "Une infusion luxueuse d'huile de truffe blanche et d'éclats de truffe noire d'été. Torréfié à l'huile d'olive — jamais frit.",
        price: "€5.99 / 50g",
        image: "/flavor_truffle_v2.png",
        badge: "Nutri-Score A",
      },
      {
        id: "herb",
        name: "Mediterranean Herb Fusion",
        category: "VÉGÉTAL",
        desc: "Un bouquet aromatique d'origan sauvage, romarin et basilic séché au soleil. Torréfié à l'huile d'olive — jamais frit.",
        price: "€5.99 / 50g",
        image: "/flavor_herbes_v2.png",
        badge: "Nutri-Score A",
      },
      {
        id: "caramel-salt",
        name: "Caramel & Beurre Salé",
        category: "SUCRÉ",
        desc: "Un mélange luxueux de caramel riche et d'une pointe de sel de mer. Torréfié, jamais frit.",
        price: "€5.99 / 50g",
        image: "/flavor_caramel_salt.png",
        badge: "Nutri-Score B",
      },
      {
        id: "dark-chocolate",
        name: "Chocolat Noir 70%",
        category: "SUCRÉ",
        desc: "Chocolat noir 70% d'origine unique enrobant délicatement notre Makhana soufflé premium.",
        price: "€5.99 / 50g",
        image: "/flavor_dark_chocolate.png",
        badge: "Nutri-Score B",
      },
      {
        id: "lemon-mint",
        name: "Citron & Menthe",
        category: "VÉGÉTAL",
        desc: "Un éclat vif et citronné de citron associé à la fraîcheur de la menthe.",
        price: "€5.99 / 50g",
        image: "/flavor_lemon_mint.png",
        badge: "Nutri-Score A",
      },
      {
        id: "peanut-butter",
        name: "Beurre de Cacahuète",
        category: "SUCRÉ",
        desc: "Beurre de cacahuète onctueux et torréfié enrobant naturellement notre Makhana.",
        price: "€5.99 / 50g",
        image: "/flavor_peanut_butter.png",
        badge: "Nutri-Score A",
      },
      {
        id: "peri-peri",
        name: "Peri Peri",
        category: "ÉPICÉ",
        desc: "Un mélange audacieux et vibrant de piment africain, d'agrumes et d'ail.",
        price: "€5.99 / 50g",
        image: "/flavor_peri_peri.png",
        badge: "Nutri-Score A",
      },
      {
        id: "smokey-bbq",
        name: "BBQ Fumé",
        category: "GOURMET",
        desc: "Notes profondes et fumées de caryer associées à une touche de douceur.",
        price: "€5.99 / 50g",
        image: "/flavor_smokey_bbq.png",
        badge: "Nutri-Score A",
      },
      {
        id: "tangy-tomato",
        name: "Tomate Acidulée",
        category: "VÉGÉTAL",
        desc: "L'éclat sucré et acidulé des tomates mûries au soleil avec des herbes subtiles.",
        price: "€5.99 / 50g",
        image: "/flavor_tangy_tomato.png",
        badge: "Nutri-Score A",
      }
    ],
    addToCart: "Ajouter au Panier",
    roastedBadge: "À l'huile d'olive — jamais frit",
    collectionLabel: "✦ Collection AÉRI ✦",
    contactB2B: "Contact B2B",
  },
  en: {
    title: "Botanical Elegance",
    subtitle: "Discover our artisanal collection of Makhana — Gourmet Water Lily Pops.",
    products: [
      {
        id: "salt",
        name: "Pristine Himalayan Salt & Pepper",
        category: "SIGNATURE",
        desc: "The purity of Himalayan pink salt married with the subtle kick of crushed black pepper. Roasted in olive oil — never fried.",
        price: "€5.99 / 50g",
        image: "/flavor_salt_v2.png",
        badge: "Nutri-Score A",
      },
      {
        id: "truffle",
        name: "Gourmet Truffle Fusion",
        category: "GOURMET",
        desc: "A luxurious infusion of white truffle oil and summer black truffle shavings. Roasted in olive oil — never fried.",
        price: "€5.99 / 50g",
        image: "/flavor_truffle_v2.png",
        badge: "Nutri-Score A",
      },
      {
        id: "herb",
        name: "Mediterranean Herb Fusion",
        category: "VÉGÉTAL",
        desc: "An aromatic bouquet of wild oregano, rosemary, and sun-dried basil. Roasted in olive oil — never fried.",
        price: "€5.99 / 50g",
        image: "/flavor_herbes_v2.png",
        badge: "Nutri-Score A",
      },
      {
        id: "caramel-salt",
        name: "Caramel & Sea Salt",
        category: "SWEET",
        desc: "A luxurious blend of rich caramel and a hint of sea salt. Roasted, never fried.",
        price: "€5.99 / 50g",
        image: "/flavor_caramel_salt.png",
        badge: "Nutri-Score B",
      },
      {
        id: "dark-chocolate",
        name: "Dark Chocolate 70%",
        category: "SWEET",
        desc: "Rich, 70% single-origin dark chocolate gently coating our premium puffed Makhana.",
        price: "€5.99 / 50g",
        image: "/flavor_dark_chocolate.png",
        badge: "Nutri-Score B",
      },
      {
        id: "lemon-mint",
        name: "Lemon & Mint",
        category: "BOTANICAL",
        desc: "A bright, citrusy burst of lemon paired with cooling mint.",
        price: "€5.99 / 50g",
        image: "/flavor_lemon_mint.png",
        badge: "Nutri-Score A",
      },
      {
        id: "peanut-butter",
        name: "Peanut Butter",
        category: "SWEET",
        desc: "Smooth, roasted peanut butter naturally coats our Makhana for a protein-packed experience.",
        price: "€5.99 / 50g",
        image: "/flavor_peanut_butter.png",
        badge: "Nutri-Score A",
      },
      {
        id: "peri-peri",
        name: "Peri Peri",
        category: "SPICY",
        desc: "A bold, vibrant blend of African bird's eye chili, citrus, and garlic.",
        price: "€5.99 / 50g",
        image: "/flavor_peri_peri.png",
        badge: "Nutri-Score A",
      },
      {
        id: "smokey-bbq",
        name: "Smokey BBQ",
        category: "GOURMET",
        desc: "Deep, smoky hickory notes paired with a touch of molasses sweetness and savory spices.",
        price: "€5.99 / 50g",
        image: "/flavor_smokey_bbq.png",
        badge: "Nutri-Score A",
      },
      {
        id: "tangy-tomato",
        name: "Tangy Tomato",
        category: "BOTANICAL",
        desc: "The sweet and tart brilliance of sun-ripened tomatoes, seasoned with subtle herbs.",
        price: "€5.99 / 50g",
        image: "/flavor_tangy_tomato.png",
        badge: "Nutri-Score A",
      }
    ],
    addToCart: "Add to Cart",
    roastedBadge: "Olive oil — never fried",
    collectionLabel: "✦ AÉRI Collection ✦",
    contactB2B: "Contact B2B",
  },
};

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

export default function FlavorExplorer() {
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  const d = t[lang as keyof typeof t] || t.en;
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Use DB products if loaded and not empty, otherwise fallback to hardcoded (or just use DB)
  const displayProducts = products.length > 0 ? products.map(p => ({
    id: p.slug === "caramel-salt" ? "caramel-salt" 
      : p.slug === "peanut-butter" ? "peanut-butter" 
      : p.slug === "lemon-mint" ? "lemon-mint" 
      : p.slug === "dark-chocolate" ? "dark-chocolate" 
      : p.slug === "smokey-bbq" ? "smokey-bbq" 
      : p.slug === "peri-peri" ? "peri-peri" 
      : p.slug === "tangy-tomato" ? "tangy-tomato" 
      : p.sku === "AERI-SALT" ? "salt" 
      : p.sku === "AERI-TRUFFLE" ? "truffle" 
      : p.sku === "AERI-HERB" ? "herb" 
      : p.slug,
    name: lang === "en" && p.nameEn ? p.nameEn : p.name,
    category: p.category,
    desc: lang === "en" && p.descriptionEn ? p.descriptionEn : p.description,
    price: `€${p.price.toFixed(2)} / 50g`,
    image: p.images && p.images.length > 0 ? p.images[0] : "/flavor_mystery.png",
    badge: p.category === "SUCRÉ" || p.category === "SWEET" ? "Nutri-Score B" : "Nutri-Score A",
    slug: p.slug,
  })) : d.products.map((p: any) => ({
    ...p,
    slug: p.id === "salt" ? "himalayan-salt"
      : p.id === "truffle" ? "black-truffle"
      : p.id === "herb" ? "mediterranean-herb-fusion"
      : p.id,
  }));

  /* मोबाइल पर API fail हो तो तुरंत fallback दिखाओ (Show fallback on mobile immediately if API fails) */
  const finalProducts = displayProducts;

  return (
    <section className="py-24 bg-[#F5E6D3] relative">
      <div className="max-w-5xl mx-auto px-6 md:px-12 mb-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.3em] uppercase font-medium mb-5 text-[#4c463e]"
        >
          {d.collectionLabel}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#1d1b1a]"
          style={{ fontFamily: "var(--font-didot), var(--font-lora), serif" }}
        >
          {d.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-[#4c463e]"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {d.subtitle}
        </motion.p>
      </div>

      <div className="px-6 md:px-12 max-w-6xl mx-auto pb-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-[#1C1C1C]/20 border-t-[#1C1C1C] rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {finalProducts.map((product, i) => {
              const slug = product.slug || product.id;
              return (
                <div
                  key={product.id + "-wrapper"}
                  className={finalProducts.length % 2 === 1 && i === finalProducts.length - 1 ? "md:col-span-2 flex justify-center" : ""}
                >
                  <Link
                    href={`/products/${slug}`}
                    className="block group relative rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer w-full"
                    style={{
                      borderColor: "#cec5bb",
                      backgroundColor: "#ffffff",
                      ...(finalProducts.length % 2 === 1 && i === finalProducts.length - 1 ? { maxWidth: "calc(50% - 1rem)" } : {}),
                    }}
                  >
                    <motion.div
                      variants={fadeUp}
                      whileHover={{
                        y: -4,
                        boxShadow: "0 16px 48px -12px rgba(29,27,26,0.22)",
                      }}
                      className="h-full flex flex-col"
                    >
                      <div className="relative w-full aspect-square overflow-hidden shrink-0" style={{ backgroundColor: "#FAF7F4" }}>
                        <Image
                          src={product.image}
                          alt={`makhana ${product.name.toLowerCase()} sachet 50g aeri snacks`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className={`object-contain transition-transform duration-700 ease-out group-hover:scale-110 ${
                            product.id === "salt" ? "p-10" 
                            : product.id === "truffle" ? "p-1" 
                            : product.id === "raw" ? "p-6"
                            : "p-4"
                          }`}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAF7F4]/90 to-transparent pointer-events-none" />
                        <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-10">
                          <span
                            className={`text-[10px] tracking-[0.15em] uppercase font-semibold px-3 py-1 rounded-full ${
                              categoryColors[product.category] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {product.category}
                          </span>
                          {product.badge && (
                            <span
                              className="text-[9px] tracking-[0.1em] uppercase font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200"
                            >
                              {product.badge}
                            </span>
                          )}
                        </div>
                        {product.id !== "raw" && (
                          <span
                            className="absolute top-4 right-4 text-[9px] tracking-[0.1em] uppercase font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 z-10"
                          >
                            {d.roastedBadge}
                          </span>
                        )}
                      </div>

                      <div className="px-6 pb-6 pt-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h3
                            className="text-lg font-bold mb-1 text-[#1d1b1a]"
                            style={{ fontFamily: "var(--font-didot), var(--font-montserrat), serif" }}
                          >
                            {product.name}
                          </h3>
                          <p className="text-sm leading-relaxed mb-4 line-clamp-2 text-[#4c463e]">
                            {product.desc}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xl font-bold text-[#675d4e]"
                            style={{ fontFamily: "var(--font-didot), var(--font-montserrat), serif" }}
                          >
                            {product.price}
                          </span>
                          {product.id === "raw" ? (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.location.href = "/espace-pro";
                              }}
                              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 active:translate-y-[2px] active:shadow-none cursor-pointer"
                              style={{
                                fontFamily: "var(--font-montserrat), sans-serif",
                                background: "#1C1C1C",
                                color: "#FFFFFF",
                                boxShadow: "0 4px 12px -2px rgba(28,28,28,0.35)",
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                              </svg>
                              {d.contactB2B || 'Contact B2B'}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: parseFloat(product.price.replace("€", "").split(" /")[0]) || 5.99,
                                  image: product.image,
                                });
                              }}
                              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 active:translate-y-[2px] active:shadow-none cursor-pointer z-20"
                              style={{
                                fontFamily: "var(--font-montserrat), sans-serif",
                                background: "#1C1C1C",
                                color: "#FFFFFF",
                                boxShadow: "0 4px 12px -2px rgba(28,28,28,0.35)",
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                              </svg>
                              {d.addToCart}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
