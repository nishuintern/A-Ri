import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre Histoire | AÉRI Snacks",
  description: "Découvrez notre héritage, la graine super-héroïque de Makhana et notre démarche de l'étang à l'apéro.",
};

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
