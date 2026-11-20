import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { sitioUrl } from "@/lib/evento";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(sitioUrl),
  title: {
    default: "Punto y Aparte · Conversaciones sobre empresa, prosperidad y humanidad",
    template: "%s · Punto y Aparte",
  },
  description:
    "Una pausa para pensar qué empresa vas a heredar. Encuentros para dueños y directivos de empresa en Guadalajara.",
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Punto y Aparte",
    url: sitioUrl,
    title: "Punto y Aparte · Conversaciones sobre empresa, prosperidad y humanidad",
    description:
      "Una pausa para pensar qué empresa vas a heredar. Encuentros para dueños y directivos de empresa en Guadalajara.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Punto y Aparte",
    description: "Una pausa para pensar qué empresa vas a heredar.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${interTight.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
