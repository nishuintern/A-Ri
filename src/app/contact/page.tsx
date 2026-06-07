"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// सभी भाषाओं के लिए अनुवाद (Translations for all languages)
const pageTranslations = {
  fr: {
    title: "Contactez-nous",
    subtitle: "Une question, une commande professionnelle ou simplement l'envie de discuter de notre Makhana ? Notre équipe est à votre écoute.",
    formName: "Nom complet",
    formEmail: "Adresse email",
    formSubject: "Sujet",
    formMessage: "Votre message",
    formBtn: "Envoyer le message",
    formSuccess: "✓ Message envoyé avec succès !",
    contactInfo: {
      title: "Nos Coordonnées",
      address: "H&G Ventures Private Limited\n15 rue du Louvre\n75001 Paris, France",
      email: "bonjour@aeri-snack.com",
      phone: "+33 1 23 45 67 89"
    },
    b2b: {
      title: "Espace Professionnel (B2B)",
      desc: "Vous êtes distributeur, restaurateur ou hôtelier ? AÉRI propose des formats et tarifs adaptés aux professionnels avec une logistique mondiale simplifiée.",
      btn: "Découvrir l'offre B2B"
    }
  },
  en: {
    title: "Contact Us",
    subtitle: "A question, a professional order, or simply want to chat about our Makhana? Our team is here for you.",
    formName: "Full Name",
    formEmail: "Email Address",
    formSubject: "Subject",
    formMessage: "Your message",
    formBtn: "Send Message",
    formSuccess: "✓ Message sent successfully!",
    contactInfo: {
      title: "Our Contact Info",
      address: "H&G Ventures Private Limited\n15 rue du Louvre\n75001 Paris, France",
      email: "hello@aeri-snack.com",
      phone: "+33 1 23 45 67 89"
    },
    b2b: {
      title: "Professional Portal (B2B)",
      desc: "Are you a distributor, restaurateur, or hotelier? AÉRI offers formats and pricing adapted for professionals with simplified global logistics.",
      btn: "Discover B2B Offer"
    }
  },
  hi: {
    title: "संपर्क करें",
    subtitle: "कोई सवाल, कोई पेशेवर ऑर्डर, या बस हमारे मखाने के बारे में बात करना चाहते हैं? हमारी टीम आपके लिए है।",
    formName: "पूरा नाम",
    formEmail: "ईमेल पता",
    formSubject: "विषय",
    formMessage: "आपका संदेश",
    formBtn: "संदेश भेजें",
    formSuccess: "✓ संदेश सफलतापूर्वक भेजा गया!",
    contactInfo: {
      title: "हमारा संपर्क विवरण",
      address: "H&G Ventures Private Limited\n15 rue du Louvre\n75001 Paris, France",
      email: "hello@aeri-snack.com",
      phone: "+33 1 23 45 67 89"
    },
    b2b: {
      title: "व्यावसायिक पोर्टल (B2B)",
      desc: "क्या आप वितरक, रेस्तरां मालिक या होटल व्यवसायी हैं? AÉRI सरलीकृत वैश्विक रसद के साथ पेशेवरों के लिए उपयुक्त प्रारूप और मूल्य निर्धारण प्रदान करता है।",
      btn: "B2B ऑफर देखें"
    }
  }
};

export default function ContactPage() {
  const { lang } = useLanguage();
  const t = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.en;
  
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        console.error("Failed to submit contact form");
      }
    } catch (error) {
      console.error("Error submitting contact form", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5E6D3] text-[#111111] font-sans flex flex-col">
      {/* ग्लोबल नेवबार (Global Navbar) */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          {t.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-[#6E6E73] max-w-3xl mx-auto leading-relaxed"
        >
          {t.subtitle}
        </motion.p>
      </section>

      {/* Main Content Grid */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_400px] gap-12 md:gap-20 pb-32">
        
        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#F5F5F7] p-8 md:p-12 rounded-3xl"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#6E6E73]">{t.formName}</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="px-4 py-3 rounded-xl bg-white border border-[#111111]/10 focus:outline-none focus:ring-1 focus:ring-[#111111]/30 transition-all text-[#111111]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#6E6E73]">{t.formEmail}</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="px-4 py-3 rounded-xl bg-white border border-[#111111]/10 focus:outline-none focus:ring-1 focus:ring-[#111111]/30 transition-all text-[#111111]" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#6E6E73]">{t.formSubject}</label>
              <input required type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="px-4 py-3 rounded-xl bg-white border border-[#111111]/10 focus:outline-none focus:ring-1 focus:ring-[#111111]/30 transition-all text-[#111111]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#6E6E73]">{t.formMessage}</label>
              <textarea required rows={6} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="px-4 py-3 rounded-xl bg-white border border-[#111111]/10 focus:outline-none focus:ring-1 focus:ring-[#111111]/30 transition-all text-[#111111] resize-none" />
            </div>
            <button type="submit" disabled={loading} className="mt-4 px-8 py-4 bg-[#111111] text-white rounded-2xl font-medium tracking-wide hover:bg-[#111111]/80 transition-colors shadow-md disabled:opacity-70">
              {loading ? "..." : submitted ? t.formSuccess : t.formBtn}
            </button>
          </form>
        </motion.div>

        {/* Sidebar Info */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col gap-12"
        >
          {/* Info Block */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-[#111111]">{t.contactInfo.title}</h3>
            <div className="flex flex-col gap-4 text-[#6E6E73] text-lg">
              <p className="whitespace-pre-line leading-relaxed">{t.contactInfo.address}</p>
              <a href={`mailto:${t.contactInfo.email}`} className="text-[#111111] hover:underline transition-all">{t.contactInfo.email}</a>
              <p>{t.contactInfo.phone}</p>
            </div>
          </div>

          {/* B2B Block */}
          <div className="p-8 border border-[#111111]/10 rounded-3xl bg-white shadow-sm">
            <h4 className="text-xl font-bold mb-4 text-[#111111]">{t.b2b.title}</h4>
            <p className="text-[#6E6E73] leading-relaxed mb-6">
              {t.b2b.desc}
            </p>
            <Link href="/espace-pro" className="inline-block font-semibold text-[#111111] underline underline-offset-4 hover:opacity-70 transition-opacity">
              {t.b2b.btn}
            </Link>
          </div>
        </motion.div>

      </section>

      {/* ग्लोबल फुटर (Global Footer) */}
      <Footer />
    </main>
  );
}
