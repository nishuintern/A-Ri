import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre Raison d'Être | AÉRI Snacks",
  description: "Découvrez notre mission, notre vision et nos valeurs. Faire d'un super-aliment indien millénaire une référence mondiale du snacking premium.",
};

export default function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
