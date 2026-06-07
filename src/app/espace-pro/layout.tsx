import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace Professionnel (B2B) | AÉRI Snacks",
  description: "Portail dédié aux acheteurs B2B, épiceries fines, réseaux bio et distributeurs. Rejoignez notre réseau de revendeurs AÉRI Snacks.",
};

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
