"use client";

import { Check, Sparkles, Zap, Crown, Target, Shield, Users, BarChart, Globe, MessageSquare, Brain, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { useState } from 'react';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'business'>('pro');

  const plans = {
    starter: {
      name: 'Starter',
      description: 'Pour les artisans et commerçants indépendants',
      price: billingPeriod === 'monthly' ? 49 : 39,
      features: [
        'Analyse de 1 entreprise',
        'GEO Score & Share of Voice',
        'Monitoring des citations IA (ChatGPT, Gemini, Perplexity)',
        'Validation NAP basique',
        'Rapport mensuel PDF',
        'Alertes de visibilité',
        'Support email',
        '3 rapports historiques',
      ],
      popular: false,
      cta: 'Commencer gratuitement',
    },
    pro: {
      name: 'Professional',
      description: 'Pour les TPE/PME qui veulent dominer les conversations IA',
      price: billingPeriod === 'monthly' ? 99 : 79,
      features: [
        'Analyse de 3 entreprises',
        'GEO Score complet avec tendances',
        'Share of Voice & Citation Rate',
        'Monitoring multi-IA en temps réel',
        'Validation NAP avancée',
        'Benchmark concurrentiel',
        'Rapports hebdomadaires + exports',
        'API limitée',
        'Support prioritaire',
        'Plan d\'action personnalisé',
        'Analyse sentiment IA',
        'Historique 6 mois',
      ],
      popular: true,
      cta: 'Essayer 14 jours gratuitement',
    },
    business: {
      name: 'Business',
      description: 'Pour les agences et entreprises avec plusieurs établissements',
      price: billingPeriod === 'monthly' ? 249 : 199,
      features: [
        'Analyse illimitée d\'entreprises',
        'GEO Score Enterprise',
        'Dashboard multi-utilisateurs',
        'Share of Voice par région',
        'Monitoring 24/7 toutes les IA',
        'Validation NAP enterprise',
        'Benchmark concurrentiel détaillé',
        'API complète',
        'Support dédié & formation',
        'Alertes personnalisées',
        'Rapports blanc-label',
        'Historique complet 2 ans',
        'Audits GEO approfondis',
        'Conseils stratégiques',
      ],
      popular: false,
      cta: 'Contactez-nous',
    },
  };

  const testimonials = [
    {
      name: 'Marc Dubois',
      role: 'Plombier - Paris',
      content: 'En 3 mois, mes demandes via ChatGPT ont augmenté de 65%. GEOptimize m\'a montré exactement où j\'étais invisible.',
      rating: 5,
    },
    {
      name: 'Sophie Martin',
      role: 'Restauratrice - Lyon',
      content: 'Les recommandations IA sont devenues ma première source de clients. Le dashboard est tellement simple à comprendre.',
      rating: 5,
    },
    {
      name: 'Thomas Leroy',
      role: 'Agence immobilière - Bordeaux',
      content: 'Je recommande GEOptimize à tous mes clients artisans. C\'est le seul outil qui parle vraiment de visibilité IA.',
      rating: 5,
    },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: 'Monitoring IA en temps réel',
      description: 'Surveillez vos citations sur ChatGPT, Gemini, Perplexity, Claude et Copilot',
    },
    {
      icon: TrendingUp,
      title: 'GEO Score & Share of Voice',
      description: 'Mesurez votre part de marché dans les conversations IA',
    },
    {
      icon: Shield,
      title: 'Validation NAP intelligente',
      description: 'Vérifiez la cohérence de vos informations sur 150+ sources',
    },
    {
      icon: Brain,
      title: 'Analyse de sentiment IA',
      description: 'Comprenez comment les IA perçoivent et recommandent votre marque',
    },
    {
      icon: Target,
      title: 'Benchmark concurrentiel',
      description: 'Comparez votre visibilité avec vos concurrents directs',
    },
    {
      icon: BarChart,
      title: 'Dashboard actionnable',
      description: 'Des insights clairs avec des recommandations concrètes',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 mb-6">
              <Crown className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Tarifs transparents - Aucun engagement
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900 dark:text-white">Exister dans les </span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                réponses d'IA
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Choisissez l'offre adaptée à votre ambition. Notre mission : rendre le GEO accessible à tous les artisans et commerçants.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 mb-12">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingPeriod === 'monthly' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingPeriod === 'yearly' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Annuel <span className="ml-1 text-xs px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">-20%</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`relative rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${selectedPlan === key ? 'border-indigo-300 dark:border-indigo-500 shadow-2xl' : 'border-gray-200 dark:border-gray-800 shadow-lg'} ${plan.popular ? 'bg-white dark:bg-gray-900' : 'bg-white/80 dark:bg-gray-900/80'}`}
                onClick={() => setSelectedPlan(key as any)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg">
                      Le plus populaire
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${plan.popular ? 'bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      {key === 'starter' && <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                      {key === 'pro' && <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                      {key === 'business' && <Crown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}€</span>
                      <span className="text-gray-500 dark:text-gray-400">/mois</span>
                    </div>
                    {billingPeriod === 'yearly' && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Facturé {plan.price * 12}€ par an
                      </p>
                    )}
                  </div>

                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-all mb-6 ${plan.popular ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    {plan.cta}
                  </button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise CTA */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full -translate-y-32 translate-x-32" />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Solution Enterprise</h3>
                    <p className="text-gray-300">
                      Pour les chaînes, groupes et organisations avec des besoins spécifiques
                    </p>
                  </div>
                  <button className="group flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all">
                    <span>Discuter avec un expert</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <p className="text-white font-semibold">+50 établissements</p>
                    <p className="text-gray-300 text-sm">Gestion centralisée</p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <p className="text-white font-semibold">Formations & workshops</p>
                    <p className="text-gray-300 text-sm">Pour vos équipes</p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <p className="text-white font-semibold">Intégrations personnalisées</p>
                    <p className="text-gray-300 text-sm">CRM, Analytics, etc.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tout ce dont vous avez besoin pour dominer le GEO
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Des fonctionnalités conçues spécifiquement pour optimiser votre visibilité dans les IA
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all hover:shadow-lg"
                >
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ils dominent déjà les conversations IA
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Rejoignez les artisans et commerçants qui ont déjà transformé leur visibilité
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic mb-6">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Questions fréquentes
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Tout ce que vous devez savoir sur GEOptimize
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Comment fonctionne le monitoring IA ?",
                  answer: "Nous interrogeons quotidiennement les principales IA conversationnelles (ChatGPT, Gemini, Perplexity, etc.) avec des requêtes pertinentes pour votre secteur, et analysons si votre entreprise apparaît dans les réponses.",
                },
                {
                  question: "Le GEO Score, comment est-il calculé ?",
                  answer: "Il combine 5 indicateurs clés : votre Share of Voice dans les citations IA, la cohérence de vos informations (NAP), la qualité de vos avis, votre présence dans les annuaires locaux et votre position dans Google Maps. Chaque indicateur est pondéré en fonction de son importance pour les IA.",
                },
                {
                  question: "Puis-je essayer gratuitement ?",
                  answer: "Oui ! L'offre Professional inclut un essai gratuit de 14 jours. L'offre Starter propose également une version gratuite limitée à une analyse par mois.",
                },
                {
                  question: "Quelle est la différence avec le SEO local ?",
                  answer: "Le SEO local optimise votre visibilité sur Google Maps et dans les résultats de recherche. Le GEO optimise votre présence dans les réponses des IA conversationnelles. Les deux sont complémentaires, mais le GEO est devenu essentiel avec l'essor des assistants IA.",
                },
                {
                  question: "Combien de temps pour voir des résultats ?",
                  answer: "Les premiers insights sont disponibles immédiatement après votre audit. Pour des améliorations significatives de votre visibilité IA, comptez généralement 2 à 3 mois d'optimisation continue.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Sans engagement • Changement d'offre à tout moment
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Prêt à exister dans les conversations IA ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
              Rejoignez les milliers d'artisans et commerçants qui ont déjà pris le virage du GEO
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                <span>Essayer gratuitement 14 jours</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="/"
                className="px-8 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                Retour à l'accueil
              </a>
            </div>

            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              Aucune carte bancaire requise pour l'essai • Support 7j/7
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}