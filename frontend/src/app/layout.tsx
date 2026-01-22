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

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 border-t border-gray-800 mt-auto">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" aria-hidden="true" />
                  <span className="font-bold text-white">GEOmetrics</span>
                </div>
                <p className="text-sm">
                  Optimisez votre visibilité sur les moteurs IA avec notre solution innovante.
                </p>
              </div>

              {/* Product Links */}
              <nav aria-label="Produit">
                <h3 className="font-semibold text-white mb-4">Produit</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#features" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
                      Fonctionnalités
                    </a>
                  </li>
                  <li>
                    <a href="/tarifs" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
                      Tarifs
                    </a>
                  </li>
                  <li>
                    <a href="#roadmap" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
                      Roadmap
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Resources Links */}
              <nav aria-label="Ressources">
                <h3 className="font-semibold text-white mb-4">Ressources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#docs" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#blog" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#community" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
                      Communauté
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Legal Links */}
              <nav aria-label="Légal">
                <h3 className="font-semibold text-white mb-4">Légal</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/privacy" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
                      Politique de confidentialité
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
                      Conditions d'utilisation
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1">
                      Contact
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                <p>&copy; 2024 GEOmetrics. Tous droits réservés.</p>
                <div className="flex items-center gap-6">
                  <a href="#twitter" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1" aria-label="Twitter">
                    Twitter
                  </a>
                  <a href="#linkedin" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1" aria-label="LinkedIn">
                    LinkedIn
                  </a>
                  <a href="#github" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1" aria-label="GitHub">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}