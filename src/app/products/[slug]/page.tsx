import { Metadata } from "next";
import { productData } from "@/lib/productData";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = productData[resolvedParams.slug];

  if (!product) {
    return {
      title: "Produit Non Trouvé | AÉRI Snacks",
    };
  }

  const title = `${product.title} - Makhana Premium | AÉRI Snacks`;
  const description = product.heroDesc.slice(0, 150) + "...";
  const imageUrl = `https://aerisnacks.com${product.image}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aerisnacks.com/products/${resolvedParams.slug}`,
      siteName: "AÉRI Snacks",
      images: [
        {
          url: imageUrl,
          width: 1080,
          height: 1080,
          alt: `${product.title} - AÉRI Snacks`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = productData[resolvedParams.slug];

  if (!product) {
    notFound();
  }

  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.heroDesc,
    "image": `https://aerisnacks.com${product.image}`,
    "brand": {
      "@type": "Brand",
      "name": "AÉRI Snacks"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": "5.99",
      "availability": "https://schema.org/InStock",
      "url": `https://aerisnacks.com/products/${resolvedParams.slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }}
      />
      <ProductDetailClient />
    </>
  );
}
