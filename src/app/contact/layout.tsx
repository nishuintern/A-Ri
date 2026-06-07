import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contactez-Nous | AÉRI Snacks",
  description: "Une question, un partenariat ou une simple envie de discuter ? L'équipe AÉRI est à votre disposition.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
