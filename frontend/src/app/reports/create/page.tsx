"use client";

import React, { useState } from 'react';
import { ArrowRight, Target, Users, Search, FileText, Sparkles, MapPin, Phone, Mail, Key, CheckCircle, AlertCircle, Loader2, Trophy, Zap, BarChart, Shield, MessageSquare, TrendingUp, Eye, Globe, ChartBar, Brain, Target as TargetIcon, Award } from 'lucide-react';

export default function CreateReportPage() {
  const [form, setForm] = useState({ 
    brand_name: '',
    keywords: '',
    competitor_names: '',
    regions: 'Global',
    languages: 'default',
    models: 'meta-llama/Llama-3.1-8B-Instruct'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; report_id?: number; message?: string }>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      // Parse comma-separated values into arrays
      const payload = {
        brand_name: form.brand_name,
        keywords: form.keywords.split(',').map(k => k.trim()).filter(k => k),
        competitor_names: form.competitor_names ? form.competitor_names.split(',').map(c => c.trim()).filter(c => c) : [],
        regions: [form.regions],
        languages: [form.languages],
        models: form.models ? [form.models] : ["meta-llama/Llama-3.1-8B-Instruct"],
        prompt_templates: ["What do you know about {keyword}? What brands come to your mind when you think of {keyword}?"]
      };

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setResult({ ok: true, report_id: data.report_id });
        setForm({ brand_name: '', keywords: '', competitor_names: '', regions: 'Global', languages: 'default', models: 'meta-llama/Llama-3.1-8B-Instruct' });
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
                        <Target className="w-4 h-4 text-indigo-500" />
                        Nom de la marque *
                      </label>
                      <input
                        name="brand_name"
                        value={form.brand_name}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Mon Entreprise"
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        Région
                      </label>
                      <select
                        name="regions"
                        value={form.regions}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="Global">Global</option>
                        <option value="Europe">Europe</option>
                        <option value="France">France</option>
                        <option value="UK">Royaume-Uni</option>
                        <option value="USA">USA</option>
                        <option value="Canada">Canada</option>
                        <option value="Asia">Asie</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      <Key className="w-4 h-4 text-purple-500" />
                      Mots-clés à analyser *
                    </label>
                    <textarea
                      name="keywords"
                      value={form.keywords}
                      onChange={handleChange}
                      rows={3}
                      required
                      placeholder="Ex: plomberie, plombier, fuite d'eau, chauffage, dépannage..."
                      className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Séparez les mots-clés par des virgules. Exemples: plomberie, plombier, fuite d'eau...
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      <Users className="w-4 h-4 text-purple-500" />
                      Marques concurrentes
                    </label>
                    <textarea
                      name="competitor_names"
                      value={form.competitor_names}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Ex: Competitor1, Competitor2, Competitor3..."
                      className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Noms de vos 2-4 principaux concurrents (optionnel). Utilisé pour l'analyse de Share of Voice.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <Globe className="w-4 h-4 text-indigo-500" />
                        Langue
                      </label>
                      <select
                        name="languages"
                        value={form.languages}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="default">Défaut (original)</option>
                        <option value="fr">Français</option>
                        <option value="en">Anglais</option>
                        <option value="es">Espagnol</option>
                        <option value="de">Allemand</option>
                        <option value="it">Italien</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <Brain className="w-4 h-4 text-indigo-500" />
                        Modèle LLM
                      </label>
                      <select
                        name="models"
                        value={form.models}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      >
                        <option value="meta-llama/Llama-3.1-8B-Instruct">Llama 3.1 8B (Recommandé)</option>
                        <option value="gpt-4">GPT-4 (Premium)</option>
                        <option value="claude-3">Claude 3 (Premium)</option>
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
                          onClick={() => setForm({ brand_name: '', keywords: '', competitor_names: '', regions: 'Global', languages: 'default', models: 'meta-llama/Llama-3.1-8B-Instruct' })}
                          className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                          Réinitialiser
                        </button>
                      </div>
                      <button
                        type="submit"
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
                          {result.ok ? '✅ Audit créé avec succès !' : '❌ Une erreur est survenue'}
                        </h3>
                        <p className={`${result.ok ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                          {result.ok ? (
                            <>
                              Votre audit a été lancé. ID du rapport : <code className="px-2 py-1 bg-white/50 dark:bg-black/30 rounded">{result.report_id}</code>
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  Exemple de Métriques
                </h3>

                <div className="space-y-3">
                  {/* Exemple Keyword - "Agence Web" */}
                  <div className="p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                        <BarChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">Mot-clé: "Agence web Paris"</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <div className="text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-1">Visibility</div>
                        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">66%</div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">8 mentions sur 12 réponses</div>
                      </div>
                      
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">Share of Voice</div>
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">35%</div>
                        <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">vs Concurrent A: 45%</div>
                      </div>
                      
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Citation</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">5</div>
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">Mentions avec lien direct</div>
                      </div>
                    </div>
                  </div>

                  {/* KPIs Description */}
                  <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Visibility:</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400">% de réponses IA où votre marque est mentionnée</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Share of Voice:</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Vos mentions comparées aux concurrents (part de voix)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Citation:</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Nombre de mentions avec lien vers votre site</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Audit complet</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Analyse de votre Visibility (%), Share of Voice (vs concurrents), et Citations (avec lien) sur les principaux modèles IA.
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">Visibility, Share of Voice, Citation</p>
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