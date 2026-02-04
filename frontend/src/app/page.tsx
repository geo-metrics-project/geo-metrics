import { ArrowRight, BarChart3, CheckCircle, MessageSquare, Search, Target, Users, Zap, Globe, Shield, TrendingUp, Sparkles, Link as LinkIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white">Êtes-vous recommandé par </span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ChatGPT, Gemini, Perplexity ?</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Analysez votre visibilité IA. Découvrez comment votre marque est mentionnée, comparez avec vos concurrents, et optimisez votre présence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="/reports/create" className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 cursor-pointer">
              <span className="text-lg">Lancer un audit</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#how-it-works" className="px-8 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-300 dark:hover:border-gray-700 transition-colors inline-block">
              En savoir plus
            </a>
          </div>

          {/* Hero Visual - Example Results */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full" />
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl">
              <div className="md:col-span-2 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                    <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Exemple: "agence web Paris"</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Visibility (mentions)</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">66%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Share of Voice (vs concurrents)</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">35%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Citation (avec lien)</span>
                        <span className="font-bold text-green-600 dark:text-green-400">5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 flex flex-col justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Vos 3 KPI clés</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
                    <p>📊 Visibility</p>
                    <p>🎯 Share of Voice</p>
                    <p>🔗 Citation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-16 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comment ça marche
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Analysez votre visibilité IA en 3 étapes simples.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '1',
                title: 'Entrez vos données',
                description: 'Votre marque, vos mots-clés principaux, et vos concurrents directs',
              },
              {
                number: '2',
                title: 'On analyse',
                description: 'Nos outils interrogent les IA pour voir comment vous êtes mentionné',
              },
              {
                number: '3',
                title: 'Recevez votre rapport',
                description: 'Découvrez vos mentions, les liens directs et la comparaison avec les concurrents',
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-80px)] h-1 bg-gradient-to-r from-indigo-500/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KPIs Explained */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Les métriques que vous obtenez
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Pour chaque mot-clé, analysez votre présence dans les réponses IA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Visibility',
                description: 'Pourcentage de réponses IA où votre marque est mentionnée pour ce mot-clé',
                example: '66%'
              },
              {
                icon: BarChart3,
                title: 'Share of Voice',
                description: 'Part de vos mentions comparée aux concurrents (vous vs compétition)',
                example: '35% vs 45% (Concurrent A)'
              },
              {
                icon: LinkIcon,
                title: 'Citation',
                description: 'Nombre de mentions avec lien direct vers votre site',
                example: '5 citations sur 8'
              }
            ].map((metric, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all hover:shadow-lg">
                <div className="inline-flex p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                  <metric.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{metric.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{metric.description}</p>
                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{metric.example}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pour qui ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Quiconque veut savoir si son entreprise est recommandée par les IA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Prestataires locaux',
                description: 'Plombiers, électriciens, services qui cherchent des recommandations IA',
              },
              {
                icon: Globe,
                title: 'E-commerce',
                description: 'Boutiques en ligne voulant savoir si les IA les recommandent',
              },
              {
                icon: Zap,
                title: 'Agences & Consultants',
                description: 'Professionnels qui veulent monitorer leur visibilité IA',
              }
            ].map((audience, index) => (
              <div key={index} className="p-8 rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-colors">
                <div className="inline-flex p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 mb-6">
                  <audience.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{audience.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Tarification simple et transparente
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Tous les plans incluent un essai gratuit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Parfait pour tester</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">Gratuit</span>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">pour toujours</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">1 audit par mois</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Jusqu'à 50 requêtes par rapport</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">3 KPI clés</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Accès limité aux modèles de LLM</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Support email</span>
                </li>
              </ul>
              <a href="/auth/register" className="block w-full px-6 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-center">
                Commencer
              </a>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl border-2 border-indigo-600 p-8 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 relative shadow-xl">
              <div className="absolute top-0 right-0 px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-bl-lg rounded-tr-2xl">
                Populaire
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 mt-4">Pro</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Pour les professionnels</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">49€</span>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">par mois, facturé annuellement</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Jusqu'à 50 audits par mois</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Jusqu'à 500 requêtes par rapport</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Analytics avancées</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Rapports exportables</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Support prioritaire</span>
                </li>
              </ul>
              <a href="/auth/register" className="block w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 active:scale-95 text-center">
                Essayer gratuitement
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Pour les équipes</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">Sur mesure</span>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">selon vos besoins</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Tout du plan Pro</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">API personnalisée</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Support 24/7</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">SSO & contrôles</span>
                </li>
              </ul>
              <a href="/contact" className="block w-full px-6 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-center">
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 shadow-2xl">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Testez maintenant
              </h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                Lancez votre premier audit et voyez comment vous êtes recommandé par les IA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/reports/create" className="group flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-white text-indigo-600 font-bold hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                  <span className="text-lg">Analyser gratuitement</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="/example-report" className="px-10 py-5 rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-colors text-center">
                  Voir un exemple de rapport
                </a>
              </div>
              <p className="mt-6 text-sm text-indigo-200">
                Aucune carte bancaire requise • Résultats en 2 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
}