'use client';

import { ArrowRight, BarChart3, TrendingUp, Link as LinkIcon, Download } from 'lucide-react';
import Link from 'next/link';

export default function ExampleReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Exemple de rapport
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Voici ce que vous obtenez quand vous lancez un audit sur GEOmetrics.
            </p>
          </div>

          {/* Example Report */}
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Rapport d'audit IA
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Mot-clé: <span className="font-semibold">agence web Paris</span>
                  </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">
                  <Download className="w-5 h-5" />
                  Télécharger PDF
                </button>
              </div>

              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Marque analysée:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Mon Agence Web</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">1 février 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>IA analysées:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">ChatGPT, Gemini, Perplexity</span>
                </div>
              </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex p-2 rounded-lg bg-indigo-200 dark:bg-indigo-800">
                    <TrendingUp className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Visibility</h3>
                </div>
                <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">66%</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Votre marque est mentionnée dans 66% des réponses pour ce mot-clé.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex p-2 rounded-lg bg-purple-200 dark:bg-purple-800">
                    <BarChart3 className="w-6 h-6 text-purple-700 dark:text-purple-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share of Voice</h3>
                </div>
                <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">35%</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Vous avez 35% des mentions vs 45% pour le concurrent principal.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-2xl p-8 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex p-2 rounded-lg bg-green-200 dark:bg-green-800">
                    <LinkIcon className="w-6 h-6 text-green-700 dark:text-green-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Citation</h3>
                </div>
                <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">5</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Vous avez 5 mentions avec lien direct vers votre site.
                </p>
              </div>
            </div>

            {/* Details Section */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Détail des mentions
              </h2>

              <div className="space-y-6">
                {[
                  {
                    ai: 'ChatGPT',
                    mention: 'Mon Agence Web est mentionnée pour ses services de création web.',
                    hasLink: true,
                  },
                  {
                    ai: 'Gemini',
                    mention: 'Recommandée comme l\'une des meilleures agences web à Paris.',
                    hasLink: true,
                  },
                  {
                    ai: 'Perplexity',
                    mention: 'Citée dans le contexte des services web modernes.',
                    hasLink: false,
                  },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{item.ai}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{item.mention}</p>
                      </div>
                      {item.hasLink && (
                        <span className="ml-4 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold whitespace-nowrap">
                          Avec lien
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Analysis */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Comparaison avec vos concurrents
              </h2>

              <div className="space-y-4">
                {[
                  { name: 'Mon Agence Web', visibility: 66, color: 'indigo' },
                  { name: 'Concurrent A', visibility: 45, color: 'gray' },
                  { name: 'Concurrent B', visibility: 38, color: 'gray' },
                  { name: 'Concurrent C', visibility: 28, color: 'gray' },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{item.visibility}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-${item.color}-500`}
                        style={{ width: `${item.visibility}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl border border-indigo-200 dark:border-indigo-800 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Recommandations
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-2xl">✨</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Vous êtes bien mentionné. Continuez à développer votre contenu de qualité.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">🔗</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Augmentez vos mentions avec liens directs en optimisant votre SEO.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">🎯</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Travaillez sur des mots-clés moins compétitifs pour augmenter votre visibility.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="inline-block">
              <Link
                href="/reports/create"
                className="group flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-lg">Créer votre propre audit</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
