import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Où Nous Trouver | AÉRI Snacks",
  description: "Retrouvez les snacks AÉRI dans les meilleures épiceries fines, hôtels et réseaux bio à travers la France et l'Europe.",
};

export default function FindUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
