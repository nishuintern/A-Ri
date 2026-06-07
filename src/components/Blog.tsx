"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/translations";

/* ────────────────────────────────────────────────────────
   Blog articles
   ──────────────────────────────────────────────────────── */
const articles = [
  {
    id: "apero",
    tag: "Culture",
    date: "12 Mai 2026",
    readTime: "5 min",
    image: "/blog_apero.png",
    title: "L'Étiquette de l'Apéro",
    subtitle: "Comment ne pas passer pour un barbare devant le fromage.",
    description:
      "L'apéro, c'est sacré. Mais entre la planche qui ressemble à un accident de supermarché et celle qui fait dire 'oh là là', il y a un monde. Spoiler : AÉRI fait partie du deuxième camp.",
    accent: "#6E6E73",
  },
  {
    id: "wine",
    tag: "Accords",
    date: "8 Mai 2026",
    readTime: "4 min",
    image: "/blog_wine.png",
    title: "AÉRI & Vins : Le Mariage Parfait",
    subtitle: "Un Bourgogne et un Makhana entrent dans un bar…",
    description:
      "On ne vous fera pas un cours d'œnologie (promis). Mais imaginez : la légèreté d'AÉRI Truffe avec un Pinot Noir. Oui, c'est aussi beau que ça en a l'air. Non, votre paquet de chips n'est pas invité.",
    accent: "#111111",
  },
  {
    id: "supermarket",
    tag: "Vérité",
    date: "3 Mai 2026",
    readTime: "6 min",
    image: "/blog_supermarket.png",
    title: "Les Mensonges de Votre Supermarché",
    subtitle: "Votre snack « healthy » contient plus de surprises que prévu.",
    description:
      "« Naturel », « Léger », « Sans culpabilité »… Si les paquets de chips pouvaient rougir, ils seraient écarlates. On décortique les étiquettes et — attention — on a apporté nos lunettes.",
    accent: "#8B4513",
  },
];

/* ────────────────────────────────────────────────────────
   Blog card
   ──────────────────────────────────────────────────────── */
function BlogCard({
  article,
  index,
  readMore,
}: {
  article: (typeof articles)[0];
  index: number;
  readMore: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="group relative flex flex-col h-full"
    >
      <div className="relative flex flex-col h-full rounded-2xl overflow-hidden bg-white/40 border border-[#111111]/6 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:border-[#111111]/12 hover:bg-white/70">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Tag */}
          <div className="absolute top-4 left-4">
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase text-white/90 backdrop-blur-md border border-white/15"
              style={{
                fontFamily: "var(--font-montserrat)",
                background: `${article.accent}CC`,
              }}
            >
              {article.tag}
            </span>
          </div>

          {/* Read time */}
          <div className="absolute top-4 right-4">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium text-white/80 bg-black/25 backdrop-blur-md"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {article.readTime}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 md:p-7">
          {/* Date */}
          <span
            className="text-[11px] font-medium tracking-wider uppercase text-[#111111]/35 mb-3"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {article.date}
          </span>

          {/* Title */}
          <h3
            className="text-xl md:text-2xl font-bold text-[#111111] mb-1.5 leading-snug group-hover:text-[#111111]/80 transition-colors"
            style={{ fontFamily: "var(--font-didot)" }}
          >
            {article.title}
          </h3>

          {/* Subtitle (witty) */}
          <p
            className="text-sm italic text-[#6E6E73] mb-3"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            {article.subtitle}
          </p>

          {/* Description */}
          <p
            className="text-sm text-[#111111]/50 leading-relaxed flex-1"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            {article.description}
          </p>

          {/* CTA */}
          <div className="mt-5 pt-5 border-t border-[#111111]/6">
            <Link href={`/blog/${article.id}`}>
              <motion.div
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111] cursor-pointer group/btn"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {readMore}
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </motion.svg>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
          style={{ background: article.accent }}
        />
      </div>
    </motion.article>
  );
}

/* ────────────────────────────────────────────────────────
   Main Section
   ──────────────────────────────────────────────────────── */
export default function Blog() {
  const { lang } = useLanguage();
  const s = t.blog[lang];
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  const localizedArticles = articles.map((a, i) => ({
    ...a,
    tag: s.articles[i].tag,
    title: s.articles[i].title,
    subtitle: s.articles[i].subtitle,
    description: s.articles[i].desc,
  }));

  return (
    <section
      className="relative w-full py-24 md:py-36 overflow-hidden bg-[#F5F5F7]"
    >
      {/* ── Header ── */}
      <div ref={headerRef} className="text-center px-6 mb-16 md:mb-20">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-block text-xs font-semibold tracking-[0.4em] uppercase text-[#6E6E73] mb-5"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {s.label}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#111111] mb-4 italic"
          style={{ fontFamily: "var(--font-didot)" }}
        >
          {s.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg md:text-xl text-[#111111]/50 max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          {s.subtitle}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 mx-auto w-20 h-[1px] bg-[#111111]/20 origin-center"
        />
      </div>

      {/* ── Blog Grid ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {localizedArticles.map((article, i) => (
            <BlogCard key={article.id} article={article} index={i} readMore={s.readMore} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-14 md:mt-20 px-6"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#111111] text-[#FFFFFF] text-sm font-semibold tracking-wide transition-all hover:shadow-xl cursor-pointer"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {s.allArticles}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
}
