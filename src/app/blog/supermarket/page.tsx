"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// सभी भाषाओं के लिए अनुवाद (Blog Supermarket article translations)
export default function SupermarketArticle() {
  const { lang } = useLanguage();

  const content = {
    fr: {
      title: "Les Mensonges Cachés de Votre Supermarché : Décoder les étiquettes de snacks",
      subtitle: "Votre snack « healthy » contient plus de surprises que prévu.",
      date: "3 Mai 2026",
      category: "Vérité",
      paragraphs: [
        "« Naturel », « Allégé », « Sans culpabilité »… Promenez-vous dans le rayon apéritif de n'importe quel supermarché et vous aurez l'impression de lire des slogans de campagne électorale. Les emballages verts et les polices de caractères 'naturelles' font tout pour vous rassurer. Mais si ces paquets pouvaient rougir, ils seraient écarlates.",
        "Prenons le temps de décortiquer ces fameuses étiquettes. Ce que l'on vous vend comme des 'chips de légumes saines' sont souvent de simples flocons de pomme de terre frits, légèrement colorés à la poudre de betterave, et tout aussi gras que des chips classiques. Et les fameuses galettes de maïs soufflé ? Elles ont souvent un index glycémique si élevé qu'elles perturbent votre taux de sucre dans le sang en un clin d'œil.",
        "Chez AÉRI, nous avons choisi une approche radicalement différente : la transparence totale. Notre ingrédient principal ? La graine d'Euryale Ferox (Makhana). Comment est-elle transformée ? Elle est éclatée à la chaleur, exactement comme du pop-corn, mais sans l'ajout massif d'huile ou de beurre industriel. Le résultat est un snack pur, avec un apport naturel en protéines végétales et une liste d'ingrédients que vous n'avez pas besoin d'un diplôme en chimie pour comprendre.",
        "Il est temps d'arrêter de se faire avoir par le marketing vert de façade. Lisez les ingrédients, regardez les valeurs nutritionnelles réelles, et choisissez des produits qui respectent à la fois votre corps et votre palais. Un vrai super-aliment n'a pas besoin de mentir pour être délicieux."
      ],
      back: "← Retour au Journal"
    },
    en: {
      title: "Your Supermarket's Lies",
      subtitle: "Your 'healthy' snack has more surprises than expected.",
      date: "May 3, 2026",
      category: "Truth",
      paragraphs: [
        "'Natural', 'Light', 'Guilt-free'… Take a walk down the snack aisle of any supermarket and you'll feel like you're reading election campaign slogans. The green packaging and 'natural' fonts do everything to reassure you. But if these bags could blush, they'd be crimson.",
        "Let's take the time to dissect these famous labels. What is sold to you as 'healthy vegetable chips' are often just fried potato flakes, lightly colored with beetroot powder, and just as greasy as classic chips. And those famous popped corn cakes? They often have a glycemic index so high that they spike your blood sugar levels in the blink of an eye.",
        "At AÉRI, we have chosen a radically different approach: total transparency. Our main ingredient? The Euryale Ferox seed (Makhana). How is it processed? It is popped with heat, exactly like popcorn, but without the massive addition of oil or industrial butter. The result is a pure snack, with a natural supply of plant-based protein and an ingredient list you don't need a degree in chemistry to understand.",
        "It's time to stop being fooled by greenwashing marketing. Read the ingredients, look at the actual nutritional values, and choose products that respect both your body and your palate. A true superfood doesn't need to lie to be delicious."
      ],
      back: "← Back to Journal"
    },
    hi: {
      title: "आपके सुपरमार्केट का झूठ",
      subtitle: "आपके 'स्वस्थ' स्नैक में उम्मीद से कहीं ज़्यादा सरप्राइज़ हैं।",
      date: "3 मई 2026",
      category: "सच",
      paragraphs: [
        "'प्राकृतिक', 'हल्का', 'अपराध-मुक्त'… किसी भी सुपरमार्केट के स्नैक आइल में टहलें और आपको लगेगा कि आप चुनाव अभियान के नारे पढ़ रहे हैं। हरी पैकेजिंग और 'प्राकृतिक' फ़ॉन्ट आपको आश्वस्त करने के लिए सब कुछ करते हैं। लेकिन अगर ये पैकेट लाल हो सकते, तो वे शर्म से लाल हो जाते।",
        "आइए इन प्रसिद्ध लेबलों को विच्छेदित करें। जो आपको 'स्वस्थ सब्जी चिप्स' के रूप में बेचा जाता है, वे अक्सर बस तले हुए आलू के गुच्छे होते हैं, चुकंदर पाउडर से हल्के रंगे हुए, और क्लासिक चिप्स जितने ही तैलीय।",
        "AÉRI में, हमने एक मौलिक रूप से अलग दृष्टिकोण चुना है: पूर्ण पारदर्शिता। हमारा मुख्य घटक? Euryale Ferox बीज (मखाना)। इसे कैसे प्रोसेस किया जाता है? इसे गर्मी से पॉप किया जाता है, बिल्कुल पॉपकॉर्न की तरह, लेकिन तेल या औद्योगिक मक्खन के बड़े पैमाने पर मिलावट के बिना।",
        "ग्रीनवॉशिंग मार्केटिंग से मूर्ख बनना बंद करने का समय आ गया है। सामग्री पढ़ें, वास्तविक पोषण मूल्यों को देखें, और ऐसे उत्पाद चुनें जो आपके शरीर और आपके तालू दोनों का सम्मान करें।"
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
