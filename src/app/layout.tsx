import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { Encabezado } from "@/components/encabezado";
import { Pie } from "@/components/pie";
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
  title: {
    default: "Punto y Aparte · Conversaciones sobre empresa, prosperidad y humanidad",
    template: "%s · Punto y Aparte",
  },
  description:
    "Una pausa para replantear la forma de hacer negocios. Encuentros para dueños y directivos de empresa en Guadalajara.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${interTight.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Encabezado />
        <main className="flex-1">{children}</main>
        <Pie />
      </body>
    </html>
  );
}
