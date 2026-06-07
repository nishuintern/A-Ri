import Hero from "@/components/Hero";
import BadgeStrip from "@/components/BadgeStrip";
import ThreeFlavorLineup from "@/components/ThreeFlavorLineup";
import FlavorExplorer from "@/components/FlavorExplorer";
import SocialProofGrid from "@/components/SocialProofGrid";
import MakhanaEducation from "@/components/MakhanaEducation";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AÉRI — Makhana Graines Soufflées Premium | L'Apéro Réinventé.",
  description: "Découvrez AÉRI, le snack d'exception aux graines de makhana soufflées. Un makhana France idéal pour un snack sain apéro. Nos graines soufflées bio sont l'alternative parfaite pour l'apéritif.",
  keywords: [
    "makhana France",
    "snack sain apéro",
    "graines soufflées bio",
    "AÉRI snacks",
  ],
};

export default function Home() {
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AÉRI Snacks",
    "url": "https://aerisnacks.com",
    "logo": "https://aerisnacks.com/logo.png",
    "sameAs": [
      "https://www.instagram.com/aerisnacks",
      "https://www.linkedin.com/company/aeri-snacks"
    ]
  };

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }}
      />
      {/* 1. Hero animation with headline, sub-headline, CTA */}
      <Hero />
      
      {/* 2. Badge strip — health claims */}
      <BadgeStrip />
      
      {/* 3. Three-flavor product lineup visual */}
      <ThreeFlavorLineup />
      
      {/* 4. Product grid with "Ajouter au Panier" buttons */}
      <FlavorExplorer />
      
      {/* 5. Consumer review grid */}
      <SocialProofGrid />
      
      {/* 6. "Qu'est-ce que le Makhana" educational section */}
      <MakhanaEducation />
      
      {/* 7. Journal d'AÉRI blog preview */}
      <Blog />
      
      {/* 8. Footer */}
      <Footer />
    </main>
  );
}
