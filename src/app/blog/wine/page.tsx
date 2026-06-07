"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// सभी भाषाओं के लिए अनुवाद (Blog Wine article translations)
export default function WineArticle() {
  const { lang } = useLanguage();

  const content = {
    fr: {
      title: "AÉRI & Vins : Le Guide d'Expert pour des Accords Parfaits",
      subtitle: "Un Bourgogne et un Makhana entrent dans un bar…",
      date: "8 Mai 2026",
      category: "Accords",
      paragraphs: [
        "On a souvent l'habitude d'associer le vin avec des fromages complexes ou de la charcuterie fine. C'est un grand classique, et on ne le remettra pas en question. Mais laissez-nous vous présenter un accord mets-vins auquel vous n'auriez peut-être pas pensé : le vin et le Makhana soufflé AÉRI.",
        "Le secret d'un bon accord réside dans l'équilibre. Prenez par exemple notre saveur 'Truffe Noire'. Le parfum terreux, boisé et intense de la truffe du Périgord se marie de manière spectaculaire avec un vin rouge léger mais structuré, comme un Pinot Noir de Bourgogne. La légèreté aérienne de la graine de Makhana permet au vin de s'exprimer sans alourdir le palais, créant une danse élégante en bouche.",
        "Si vous préférez le blanc, notre AÉRI 'Herbes de Provence' est une révélation lorsqu'il est accompagné d'un Sauvignon Blanc bien frais ou d'un Rosé de Bandol. Les notes de thym et de romarin font écho à la minéralité et à la fraîcheur du vin, vous transportant instantanément sur une terrasse ensoleillée du sud de la France.",
        "L'avantage ? Contrairement aux snacks frits qui tapissent le palais de gras et écrasent les subtilités d'un bon millésime, le Makhana nettoie le palais et prépare vos papilles pour la prochaine gorgée. La prochaine fois que vous ouvrez une belle bouteille, laissez tomber les biscuits industriels et sortez un paquet d'AÉRI. Vos invités (et votre vin) vous remercieront."
      ],
      back: "← Retour au Journal"
    },
    en: {
      title: "AÉRI & Wine: The Perfect Marriage",
      subtitle: "A Burgundy and a foxnut walk into a bar…",
      date: "May 8, 2026",
      category: "Pairings",
      paragraphs: [
        "We are often used to pairing wine with complex cheeses or fine charcuterie. It's a great classic, and we won't question it. But let us introduce you to a food and wine pairing you might not have considered: wine and popped AÉRI Makhana.",
        "The secret to a good pairing lies in balance. Take our 'Black Truffle' flavor, for example. The earthy, woody, and intense aroma of Périgord truffle pairs spectacularly with a light yet structured red wine, like a Burgundy Pinot Noir. The airy lightness of the Makhana seed allows the wine to express itself without heavying the palate, creating an elegant dance in the mouth.",
        "If you prefer white, our AÉRI 'Herbes de Provence' is a revelation when accompanied by a crisp Sauvignon Blanc or a Bandol Rosé. The notes of thyme and rosemary echo the minerality and freshness of the wine, instantly transporting you to a sunny terrace in the South of France.",
        "The advantage? Unlike fried snacks that coat the palate in grease and crush the subtleties of a good vintage, Makhana cleanses the palate and prepares your taste buds for the next sip. The next time you open a nice bottle, ditch the industrial crackers and bring out a bag of AÉRI. Your guests (and your wine) will thank you."
      ],
      back: "← Back to Journal"
    },
    hi: {
      title: "AÉRI और वाइन: एकदम सही जोड़ी",
      subtitle: "एक बरगंडी और एक मखाना एक बार में जाते हैं…",
      date: "8 मई 2026",
      category: "पेयरिंग",
      paragraphs: [
        "हम अक्सर वाइन को जटिल चीज़ या बढ़िया चारक्यूटरी के साथ जोड़ने के आदी हैं। यह एक बड़ा क्लासिक है, और हम इस पर सवाल नहीं उठाएंगे। लेकिन आइए हम आपको एक ऐसी फूड पेयरिंग से मिलवाते हैं जिसके बारे में आपने शायद नहीं सोचा होगा: वाइन और पॉप्ड AÉRI मखाना।",
        "एक अच्छी पेयरिंग का रहस्य संतुलन में है। उदाहरण के लिए, हमारा 'ब्लैक ट्रफल' फ्लेवर लें। पेरिगॉर्ड ट्रफल की मिट्टी जैसी, लकड़ी जैसी और तीव्र सुगंध बरगंडी पिनोट नोयर जैसी हल्की लेकिन संरचित रेड वाइन के साथ शानदार रूप से मेल खाती है।",
        "अगर आप व्हाइट पसंद करते हैं, तो हमारा AÉRI 'हर्ब्स डे प्रोवेंस' एक ताज़ा सॉविन्यन ब्लां या बंडोल रोज़े के साथ एक रहस्योद्घाटन है। थाइम और रोज़मेरी के नोट्स वाइन की मिनरैलिटी और ताज़गी को प्रतिध्वनित करते हैं।",
        "फायदा? तले हुए स्नैक्स के विपरीत जो तालू पर ग्रीस की परत चढ़ा देते हैं, मखाना तालू को साफ करता है और आपकी स्वाद कलियों को अगले घूंट के लिए तैयार करता है। अगली बार जब आप कोई अच्छी बोतल खोलें, AÉRI का एक पैकेट निकालें।"
      ],
      back: "← जर्नल पर वापस"
    }
  };

  const t = content[lang as keyof typeof content] || content.en;

  return (
    <main className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-block mb-12 text-[#6E6E73] font-semibold hover:underline" style={{ fontFamily: "var(--font-montserrat)" }}>
            {t.back}
          </Link>
          <span className="block text-sm font-medium tracking-wider uppercase text-[#111111]/40 mb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
            {t.date} · {t.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mb-6 leading-tight" style={{ fontFamily: "var(--font-didot)" }}>
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-[#6E6E73] italic mb-12" style={{ fontFamily: "var(--font-lora)" }}>
            {t.subtitle}
          </p>
          <div className="space-y-8 text-lg text-[#111111]/80 leading-relaxed" style={{ fontFamily: "var(--font-lora)" }}>
            {t.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
