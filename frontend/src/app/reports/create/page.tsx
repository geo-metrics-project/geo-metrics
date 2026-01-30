"use client";

import React, { useState } from 'react';
import { ArrowRight, Target, Users, Search, FileText, Sparkles, MapPin, Phone, Mail, Key, CheckCircle, AlertCircle, Loader2, Trophy, Zap, BarChart, Shield, MessageSquare, TrendingUp, Eye, Globe, ChartBar, Brain, Target as TargetIcon, Award } from 'lucide-react';

export default function CreateReportPage() {
  const [form, setForm] = useState({ 
    website: '',
    businessName: '',
    industry: '',
    geographicScope: 'local',
    mainKeywords: '',
    competitors: '',
    language: 'fr',
    auditType: 'complete'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; id?: string; message?: string }>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setResult({ ok: true, id: data.id });
        setForm({ website: '', businessName: '', industry: '', geographicScope: 'local', mainKeywords: '', competitors: '', language: 'fr', auditType: 'complete' });
      } else {
        const text = await res.text();
        setResult({ ok: false, message: text });
      }
    } catch (err: any) {
      setResult({ ok: false, message: err?.message ?? String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-12">
      <section className="container mx-auto px-4 pt-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Analyse Génerative Engine Optimization
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gray-900 dark:text-white">Créez votre </span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">rapport GEO</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Analysez votre Share of Voice dans les réponses d'IA et obtenez des insights actionnables pour dominer les conversations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire Principal */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-indigo-50 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                      <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Informations de l'entreprise
                    </h2>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Remplissez les champs ci-dessous pour générer un rapport complet de visibilité GEO
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <Globe className="w-4 h-4 text-indigo-500" />
                        URL du site/page *
                      </label>
                      <input
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        required
                        type="url"
                        placeholder="https://monsite.com"
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <Target className="w-4 h-4 text-indigo-500" />
                        Nom de l'entreprise/site *
                      </label>
                      <input
                        name="businessName"
                        value={form.businessName}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Mon Entreprise"
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <Zap className="w-4 h-4 text-indigo-500" />
                        Secteur d'activité *
                      </label>
                      <input
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                        required
                        placeholder="Ex: E-commerce, SaaS, Services..."
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        Portée géographique *
                      </label>
                      <select
                        name="geographicScope"
                        value={form.geographicScope}
                        onChange={handleChange as any}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="local">Local (ville/région)</option>
                        <option value="national">National</option>
                        <option value="international">International</option>
                        <option value="multi-regional">Multi-régional</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      <Key className="w-4 h-4 text-purple-500" />
                      Mots-clés principaux à auditer *
                    </label>
                    <textarea
                      name="mainKeywords"
                      value={form.mainKeywords}
                      onChange={handleChange}
                      rows={3}
                      required
                      placeholder="Ex: plomberie Paris, plombier urgent, fuite d'eau, chauffage, dépannage 24/7..."
                      className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Séparez les mots-clés par des virgules. Focus sur vos mots-clés principaux pour la visibilité IA.
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      <Users className="w-4 h-4 text-purple-500" />
                      Compétiteurs directs
                    </label>
                    <textarea
                      name="competitors"
                      value={form.competitors}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Ex: competitor1.com, competitor2.com, competitor3.com..."
                      className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      URLs de vos 2-4 principaux concurrents (optionnel). Utilisé pour le benchmarking.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <Globe className="w-4 h-4 text-indigo-500" />
                        Langue d'audit
                      </label>
                      <select
                        name="language"
                        value={form.language}
                        onChange={handleChange as any}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="fr">Français</option>
                        <option value="en">Anglais</option>
                        <option value="es">Espagnol</option>
                        <option value="de">Allemand</option>
                        <option value="it">Italien</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <ChartBar className="w-4 h-4 text-indigo-500" />
                        Type d'audit
                      </label>
                      <select
                        name="auditType"
                        value={form.auditType}
                        onChange={handleChange as any}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="complete">Audit complet (recommandé)</option>
                        <option value="quick">Audit rapide</option>
                        <option value="competitive">Analyse concurrentielle</option>
                        <option value="kpi-focused">Focus KPI spécifiques</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <Shield className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Vos données sont sécurisées
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Analyse anonymisée conforme RGPD
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                        <button
                          type="button"
                          onClick={() => setForm({ website: '', businessName: '', industry: '', geographicScope: 'local', mainKeywords: '', competitors: '', language: 'fr', auditType: 'complete' })}
                          className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                          Réinitialiser
                        </button>
                      <button
                        disabled={loading}
                        className="group relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Génération en cours...
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5" />
                            <span className="text-lg">Générer le rapport</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {result && (
                  <div className={`mx-8 mb-8 p-6 rounded-2xl border ${result.ok ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${result.ok ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {result.ok ? (
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-2 ${result.ok ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                          {result.ok ? '✅ Rapport créé avec succès !' : '❌ Une erreur est survenue'}
                        </h3>
                        <p className={`${result.ok ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                          {result.ok ? (
                            <>
                              Votre rapport a été généré. Identifiant : <code className="px-2 py-1 bg-white/50 dark:bg-black/30 rounded">{result.id}</code>
                            </>
                          ) : (
                            result.message
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Métriques GEO */}
            <div className="space-y-6">
              {/* Section des KPI GEO */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                    <TargetIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vos métriques GEO</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">KPI analysés dans votre rapport</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* GEO Visibility Score */}
                  <div className="p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                        <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 dark:text-white">GEO Visibility Score</span>
                          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            67/100
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Visibilité globale sur les moteurs IA (ChatGPT, Gemini, Perplexity)
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-2">
                      <div className="h-full w-2/3 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    </div>
                  </div>

                  {/* Share of Voice */}
                  <div className="p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                        <BarChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 dark:text-white">Share of Voice (SOV)</span>
                          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            18%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Part de voix vs compétiteurs sur vos mots-clés
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>Vous</span>
                      <span>Compétiteurs</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    </div>
                  </div>

                  {/* Citation Rate across AI engines */}
                  <div className="p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                        <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 dark:text-white">Citation Rate (Moyen)</span>
                          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            52%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Taux moyen de citations spontanées par les IA
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="text-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">68%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">ChatGPT</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-sm font-bold text-purple-600 dark:text-purple-400">45%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Gemini</div>
                      </div>
                      <div className="text-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">43%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Perplexity</div>
                      </div>
                    </div>
                  </div>

                  {/* Average Position */}
                  <div className="p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                        <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 dark:text-white">Position Moyenne</span>
                          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            3.2
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Position moyenne dans les réponses IA (1ère = meilleur)
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/70 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Mention 1ère</div>
                        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">23%</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/70 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Dans top 3</div>
                        <div className="text-sm font-bold text-purple-600 dark:text-purple-400">61%</div>
                      </div>
                    </div>
                  </div>

                  {/* Knowledge Panel & Featured Snippet */}
                  <div className="p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                        <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">SERP Features</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/70 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Featured Snippet</span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">8 occurrences</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/70 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Knowledge Panel</span>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Détecté ✓</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/70 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Answer Box</span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">3 occurrences</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Analyse complète</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Rapport incluant visibilité IA, SOV, citation rates sur ChatGPT, Gemini, Perplexity, Featured Snippets, Knowledge Panels, et recommandations d'optimisation.
                  </p>
                </div>
              </div>

              {/* Timeline & Détails */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 p-6 shadow-lg">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Processus d'analyse</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">Crawl du site</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Indexation et structure</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">Scanning IA</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ChatGPT, Gemini, Perplexity, etc</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">Calcul KPI GEO</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SOV, Citation Rate, Position</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">Analyse concurrentielle</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Benchmarking vs compétiteurs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs">
                      5
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">Plan d'action</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Recommandations d'optimisation</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Délai estimé :</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">15-20 minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Format :</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">PDF + Dashboard</span>
                  </div>
                </div>
              </div>

              {/* Note technique */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <strong>Note :</strong> Analyse basée sur 150+ sources incluant ChatGPT, Gemini, Perplexity, Google Business, PagesJaunes, etc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA Final */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 shadow-2xl">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Prêt à dominer les conversations IA ?
              </h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                Génerez votre premier rapport GEO et découvrez votre vrai potentiel de visibilité
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-white text-indigo-600 font-bold hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span className="text-lg">Générer mon rapport</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <a
                  href="/"
                  className="px-10 py-5 rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  Retour à l'accueil
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}