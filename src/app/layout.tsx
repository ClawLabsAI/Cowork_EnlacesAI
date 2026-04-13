import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "enlaces.ai — Directorio de IA en Español",
    template: "%s | enlaces.ai",
  },
  description:
    "El directorio de herramientas de inteligencia artificial más completo en español. Curado, con reviews honestas y contexto para Latinoamérica y España.",
  openGraph: {
    title: "enlaces.ai — Directorio de IA en Español",
    description: "Herramientas y modelos de IA curados en español.",
    url: "https://enlaces.ai",
    siteName: "enlaces.ai",
    locale: "es_ES",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-[var(--c-bg)] text-[var(--c-text)] antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
