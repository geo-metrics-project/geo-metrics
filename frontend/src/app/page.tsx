import { ArrowRight, BarChart3, CheckCircle, MessageSquare, Search, Target, Users, Zap, Globe, Shield, TrendingUp, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Supprimez le Header de cette page car il est déjà dans le layout */}
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 mb-8">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              La révolution GEO est en marche
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Ne disparaissez pas
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              de la conversation.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Google n&apos;est plus le seul juge. Optimisez votre visibilité sur ChatGPT, Gemini et Perplexity avec le premier outil de GEO grand public.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95">
              <span className="text-lg">Analyser mon entreprise</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              Voir une démo
            </button>
          </div>

          {/* Hero Visual - Bento Grid Style */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full" />
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl">
              <div className="md:col-span-2 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                    <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Qui peut réparer une chaudière à gaz rapidement sur Lyon ?</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Je vous recommande <span className="font-semibold text-indigo-600 dark:text-indigo-400">&quot;Chauffage Pro Lyon&quot;</span>. Ils sont souvent cités pour leur réactivité et expertise sur les forums professionnels...
                    </p>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">ChatGPT</span>
                      <span>• Réponse basée sur 42 sources vérifiées</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">87%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">de visibilité augmentée</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paradigm Shift Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Le changement de paradigme
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              La recherche évolue des liens vers les conversations. Être présent n&apos;est plus suffisant, il faut être recommandé.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ancien modèle : Moteur de Recherche</h3>
              </div>
              <ul className="space-y-4">
                {['10 liens bleus à analyser', 'L\'utilisateur doit trier et comparer', 'SEO basé sur les mots-clés', 'Visibilité = Position dans la page'].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900 border border-indigo-100 dark:border-indigo-800/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                  <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nouveau modèle : Moteur de Réponse</h3>
              </div>
              <ul className="space-y-4">
                {['1 réponse synthétique et directe', 'L\'IA décide pour l\'utilisateur', 'GEO basé sur la réputation', 'Visibilité = Être recommandé'].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Metrics Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Votre score GEO complet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Des métriques clés pour comprendre et optimiser votre présence dans les réponses d&apos;IA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'GEO Score',
                value: '82/100',
                description: 'Indicateur synthétique de visibilité hybride',
                color: 'from-indigo-500 to-purple-500'
              },
              {
                icon: Zap,
                title: 'Visibilité IA',
                value: '64%',
                description: 'Fréquence des citations spontanées par les robots',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Shield,
                title: 'Cohérence NAP',
                value: '92%',
                description: 'Précision Nom/Adresse/Téléphone (base de validation)',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: BarChart3,
                title: 'Sentiment Analysis',
                value: '+8.5',
                description: 'Analyse de la tonalité des avis (réputation perçue)',
                color: 'from-orange-500 to-pink-500'
              }
            ].map((metric, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all hover:shadow-xl">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${metric.color} mb-4`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
                  {index === 3 && <span className="text-sm font-medium text-green-600 dark:text-green-400">points</span>}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{metric.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{metric.description}</p>
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
              Conçu pour les TPE/PME
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Pas besoin d&apos;être expert en SEO ou en IA. Nous simplifions la GEO pour que vous puissiez vous concentrer sur votre métier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Artisans',
                description: 'Plombiers, électriciens, menuisiers qui veulent être recommandés localement',
                features: ['Recommandations locales', 'Urgence 24/7', 'Expertise technique']
              },
              {
                icon: Globe,
                title: 'Commerces',
                description: 'Boutiques, restaurants, services qui cherchent à augmenter leur clientèle',
                features: ['Touristes & locaux', 'Spécialités uniques', 'Horaires étendus']
              },
              {
                icon: CheckCircle,
                title: 'Services locaux',
                description: 'Coiffeurs, garages, médecins qui dépendent de la confiance et des recommandations',
                features: ['Fidélisation', 'Avis vérifiés', 'Proximité géographique']
              }
            ].map((audience, index) => (
              <div key={index} className="p-8 rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-colors">
                <div className="inline-flex p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 mb-6">
                  <audience.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{audience.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{audience.description}</p>
                <ul className="space-y-3">
                  {audience.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
                Testez votre visibilité IA maintenant
              </h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                Découvrez comment vous apparaissez dans les conversations d&apos;IA et obtenez un plan d&apos;action personnalisé.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-white text-indigo-600 font-bold hover:bg-gray-50 transition-all hover:scale-105 active:scale-95">
                  <span className="text-lg">Analyser gratuitement</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-10 py-5 rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-colors">
                  Voir un exemple de rapport
                </button>
              </div>
              <p className="mt-6 text-sm text-indigo-200">
                Aucune carte bancaire requise • Résultats en 2 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">GEOptimize</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              Fonctionnalités
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              Tarifs
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              Documentation
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              Blog
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              Contact
            </a>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} GEOptimize. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}