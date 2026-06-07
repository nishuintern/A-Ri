"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fallbackFlavors = [
  { name: "Himalayan Salt & Pepper", label: "SIGNATURE", image: "/flavor_salt_v2.png" },
  { name: "Gourmet Truffle Fusion", label: "GOURMET", image: "/flavor_truffle.png" },
  { name: "Mediterranean Herb Fusion", label: "VÉGÉTAL", image: "/flavor_herbes_v2.png" },
];

export default function ThreeFlavorLineup() {
  const { lang } = useLanguage();
  const isFrench = lang === "fr";
  const [flavors, setFlavors] = useState<any[]>(fallbackFlavors);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          // Take top 3 products (assuming the first 3 are the ones needed)
          const top3 = json.data.slice(0, 3).map((p: any) => ({
            name: p.name,
            label: p.category,
            image: p.images && p.images.length > 0 ? p.images[0] : "/flavor_mystery.png"
          }));
          setFlavors(top3);
        }
      } catch (error) {
        console.error("Failed to fetch products for lineup:", error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section
      className="relative w-full py-16 md:py-24 overflow-hidden"
      style={{ background: "#F5E6D3" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#1C1C1C] mb-4"
          style={{ fontFamily: "var(--font-didot)" }}
        >
          {isFrench ? "La Collection AÉRI" : "The AÉRI Collection"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-sm md:text-base text-[#1C1C1C]/60 mb-12 md:mb-16 max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {isFrench ? "Trois saveurs d'exception, torréfiées à l'huile d'olive vierge extra." : "Three exceptional flavors, roasted in extra virgin olive oil."}
        </motion.p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {flavors.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex flex-col items-center group"
            >
              <div className="relative w-[200px] h-[200px] md:w-[260px] md:h-[260px] mb-5 transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={f.image}
                    alt={`makhana ${f.name.toLowerCase()} sachet 50g aeri snacks`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain drop-shadow-lg"
                  />
              </div>
              <span
                className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1"
                style={{ fontFamily: "var(--font-montserrat)", color: "#D4AF37" }}
              >
                {f.label === "VÉGÉTAL" && !isFrench ? "PLANT-BASED" : f.label}
              </span>
              <span
                className="text-sm font-semibold text-[#1C1C1C]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {f.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
