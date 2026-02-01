import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GEOmetrics - Optimisez votre visibilité IA",
  description: "Optimisez votre visibilité sur ChatGPT, Gemini et Perplexity avec le premier outil de GEO grand public.",
  keywords: ["SEO", "IA", "ChatGPT", "Gemini", "Perplexity", "optimisation"],
  authors: [{ name: "GEOmetrics" }],
  openGraph: {
    title: "GEOmetrics - Optimisez votre visibilité IA",
    description: "Le premier outil de GEO grand public pour optimiser votre visibilité sur les moteurs IA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="absolute top-0 left-0 px-4 py-2 bg-indigo-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 -translate-y-full focus:translate-y-0 transition-transform rounded-b-lg"
          aria-label="Aller au contenu principal"
        >
          Aller au contenu principal
        </a>

        {/* Header Navigation */}
        <Header />

        {/* Main Content */}
        <main id="main-content" className="min-h-[calc(100vh-80px)] flex flex-col">
          {children}
        </main>

       
      </body>
    </html>
  );
}