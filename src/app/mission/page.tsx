"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pageTranslations = {
  fr: {
    title: "Notre Raison d'Être",
    missionTitle: "Notre Mission",
    missionBody: "Faire d'un super-aliment indien millénaire — naturellement riche en protéines, faible en graisses et en glucides complexes — une référence mondiale du snacking premium.",
    visionTitle: "Notre Vision",
    visionBody: "Devenir le partenaire d'approvisionnement le plus fiable, le plus rigoureux en matière de qualité et le plus certifié pour les super-aliments alternatifs premium à l'échelle mondiale.",
    valuesTitle: "Nos Valeurs",
    values: [
      {
        title: "Qualité Absolue",
        body: "Nous prenons l'entière responsabilité de nos standards de transformation alimentaire, de la récolte au container final. Chaque lot est calibré pour garantir une texture croquante uniforme, une taille premium constante, et une conformité sanitaire sans compromis.",
      },
      {
        title: "Fiabilité d'Approvisionnement",
        body: "Notre héritage familial de 25 ans dans la fabrication industrielle à haute capacité soutient chaque promesse. Notre pipeline logistique est conçu pour éliminer les retards, prévenir les ruptures de stock et garantir que vos rayons restent continuellement approvisionnés.",
      },
      {
        title: "Sécurité Réglementaire",
        body: "Nous supprimons intégralement le risque douanier pour nos partenaires importateurs. Notre réseau de transformation opère sous des normes de conformité européennes et internationales auditées, pour garantir zéro rejet en douane et zéro risque juridique.",
      },
    ]
  },
  en: {
    title: "Our Purpose",
    missionTitle: "Our Mission",
    missionBody: "To elevate an ancient Indian superfood—naturally high in protein, low in fat, and rich in complex carbohydrates—into a global benchmark for premium snacking.",
    visionTitle: "Our Vision",
    visionBody: "To become the most reliable, rigorously quality-controlled, and certified supply partner for premium alternative superfoods worldwide.",
    valuesTitle: "Our Values",
    values: [
      {
        title: "Absolute Quality",
        body: "We take full responsibility for our food processing standards, from harvest to the final container. Every batch is calibrated to guarantee uniform crunch, consistent premium size, and uncompromising sanitary compliance.",
      },
      {
        title: "Supply Reliability",
        body: "Our 25-year family heritage in high-capacity industrial manufacturing underpins every promise. Our logistics pipeline is engineered to eliminate delays, prevent stockouts, and ensure your shelves remain continuously supplied.",
      },
      {
        title: "Regulatory Security",
        body: "We entirely eliminate customs risk for our importing partners. Our processing network operates under audited European and international compliance standards, guaranteeing zero customs rejections and zero legal risk.",
      },
    ]
  },
  hi: {
    title: "हमारा उद्देश्य",
    missionTitle: "हमारा मिशन",
    missionBody: "एक प्राचीन भारतीय सुपरफूड को—जो प्राकृतिक रूप से प्रोटीन में उच्च, वसा में कम और जटिल कार्बोहाइड्रेट से भरपूर है—प्रीमियम स्नैकिंग के लिए एक वैश्विक मानक बनाना।",
    visionTitle: "हमारा दृष्टिकोण",
    visionBody: "दुनिया भर में प्रीमियम वैकल्पिक सुपरफूड्स के लिए सबसे विश्वसनीय, गुणवत्ता-नियंत्रित और प्रमाणित आपूर्ति भागीदार बनना।",
    valuesTitle: "हमारे मूल्य",
    values: [
      {
        title: "पूर्ण गुणवत्ता",
        body: "हम कटाई से लेकर अंतिम कंटेनर तक अपने खाद्य प्रसंस्करण मानकों की पूरी जिम्मेदारी लेते हैं। हर बैच को एक समान कुरकुरापन, लगातार प्रीमियम आकार और बेजोड़ स्वच्छता अनुपालन की गारंटी देने के लिए कैलिब्रेट किया जाता है।",
      },
      {
        title: "आपूर्ति विश्वसनीयता",
        body: "उच्च क्षमता वाले औद्योगिक निर्माण में हमारी 25 साल की पारिवारिक विरासत हर वादे का समर्थन करती है। हमारी रसद पाइपलाइन को देरी को खत्म करने, स्टॉकआउट को रोकने और यह सुनिश्चित करने के लिए डिज़ाइन किया गया है कि आपकी अलमारियों में लगातार आपूर्ति बनी रहे।",
      },
      {
        title: "नियामक सुरक्षा",
        body: "हम अपने आयातक भागीदारों के लिए सीमा शुल्क जोखिम को पूरी तरह समाप्त कर देते हैं। हमारा प्रसंस्करण नेटवर्क ऑडिट किए गए यूरोपीय और अंतर्राष्ट्रीय अनुपालन मानकों के तहत काम करता है, जिससे शून्य सीमा शुल्क अस्वीकृति और शून्य कानूनी जोखिम की गारंटी मिलती है।",
      },
    ]
  }
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function MissionPage() {
  const { lang } = useLanguage();
  const d = pageTranslations[lang as keyof typeof pageTranslations] || pageTranslations.fr;
  
  const sectionRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.2 });

  return (
    <main className="min-h-screen w-full bg-[#FFFFFF]">
      <Navbar />
      <section ref={sectionRef} className="max-w-5xl mx-auto px-6 pt-40 pb-20 md:pb-32">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl text-center mb-20 md:mb-28 text-[#1C1C1C]"
          style={{
            fontFamily: "var(--font-didot)",
          }}
        >
          {d.title}
        </motion.h1>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-16 md:mb-20"
        >
          <h2
            className="text-2xl md:text-3xl text-[#1C1C1C] mb-5"
            style={{
              fontFamily: "var(--font-didot)",
            }}
          >
            {d.missionTitle}
          </h2>
          <p
            className="text-base md:text-lg text-[#1C1C1C]/80 leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {d.missionBody}
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-20 md:mb-28"
        >
          <h2
            className="text-2xl md:text-3xl text-[#1C1C1C] mb-5"
            style={{
              fontFamily: "var(--font-didot)",
            }}
          >
            {d.visionTitle}
          </h2>
          <p
            className="text-base md:text-lg text-[#1C1C1C]/80 leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {d.visionBody}
          </p>
        </motion.div>

        {/* Values */}
        <div ref={valuesRef}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-2xl md:text-3xl text-[#1C1C1C] mb-10 md:mb-12"
            style={{
              fontFamily: "var(--font-didot)",
            }}
          >
            {d.valuesTitle}
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {d.values.map((value, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="bg-white rounded-xl p-6 md:p-8 border border-[#E5E5E5]"
                style={{
                  borderTop: "3px solid #D4AF37",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <h3
                  className="text-lg md:text-xl text-[#1C1C1C] mb-4 font-semibold"
                  style={{
                    fontFamily: "var(--font-didot)",
                  }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-sm md:text-base text-[#1C1C1C]/75 leading-relaxed"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {value.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
