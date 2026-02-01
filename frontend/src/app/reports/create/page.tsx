"use client";

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Target, 
  Sparkles, 
  MapPin, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Zap, 
  Globe, 
  Brain, 
  Check,
  ChevronDown,
  ChevronUp,
  BarChart,
  Trophy,
  Award
} from 'lucide-react';

// --- DONNÉES ÉTENDUES POUR DÉMO "VOIR PLUS" ---

const ALL_LANGUAGES = [
  { id: 'default', label: 'Défaut (Original)' },
  { id: 'fr', label: 'Français' },
  { id: 'en', label: 'Anglais' },
  { id: 'es', label: 'Espagnol' },
  { id: 'de', label: 'Allemand' },
  { id: 'it', label: 'Italien' },
  { id: 'pt', label: 'Portugais' },
  { id: 'nl', label: 'Néerlandais' },
  { id: 'pl', label: 'Polonais' },
  { id: 'ru', label: 'Russe' },
  { id: 'ja', label: 'Japonais' },
  { id: 'zh', label: 'Chinois (Mandarin)' },
  { id: 'ko', label: 'Coréen' },
  { id: 'ar', label: 'Arabe' },
  { id: 'tr', label: 'Turc' },
  { id: 'sv', label: 'Suédois' },
  { id: 'da', label: 'Danois' },
  { id: 'fi', label: 'Finnois' }
];

const ALL_MODELS = [
  { id: 'meta-llama/Llama-3.1-8B-Instruct', label: 'Llama 3.1 8B', desc: 'Rapide & Efficace' },
  { id: 'openai/gpt-4-turbo', label: 'GPT-4 Turbo', desc: 'Premium & Précis' },
  { id: 'anthropic/claude-3-opus', label: 'Claude 3 Opus', desc: 'Rédaction humaine' },
  { id: 'google/gemini-pro-1.5', label: 'Gemini Pro 1.5', desc: 'Large contexte' },
  { id: 'mistral/mistral-large', label: 'Mistral Large', desc: 'Top Performance EU' },
  { id: 'meta-llama/Llama-3-70b', label: 'Llama 3 70B', desc: 'Puissant Open Source' },
  { id: 'openai/gpt-3.5-turbo', label: 'GPT-3.5 Turbo', desc: 'Économique' },
  { id: 'anthropic/claude-3-sonnet', label: 'Claude 3 Sonnet', desc: 'Équilibré' },
  { id: 'google/gemma-7b', label: 'Gemma 7B', desc: 'Léger par Google' },
  { id: 'microsoft/phi-3', label: 'Phi-3', desc: 'Petit & Malin' },
  { id: 'perplexity/sonar-medium', label: 'Sonar Medium', desc: 'Spécialisé Recherche' },
  { id: 'cohere/command-r', label: 'Command R+', desc: 'Optimisé RAG' }
];

export default function CreateReportPage() {
  const [form, setForm] = useState({ 
    brand_name: '',
    keywords: '',
    competitor_names: '',
    regions: 'Global', 
    languages: ['default'], 
    models: ['meta-llama/Llama-3.1-8B-Instruct']
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; report_id?: number; message?: string }>(null);
  
  // États pour "Voir plus"
  const [showAllLangs, setShowAllLangs] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);

  // Gestion des champs textes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  // Toggle Langues
  function toggleLanguage(langId: string) {
    setForm(prev => {
      const exists = prev.languages.includes(langId);
      if (exists && prev.languages.length === 1) return prev; // Garder au moins 1
      const newLangs = exists ? prev.languages.filter(l => l !== langId) : [...prev.languages, langId];
      return { ...prev, languages: newLangs };
    });
  }

  // Toggle Modèles
  function toggleModel(modelId: string) {
    setForm(prev => {
      const exists = prev.models.includes(modelId);
      if (exists && prev.models.length === 1) return prev; // Garder au moins 1
      const newModels = exists ? prev.models.filter(m => m !== modelId) : [...prev.models, modelId];
      return { ...prev, models: newModels };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        brand_name: form.brand_name,
        keywords: form.keywords.split(',').map(k => k.trim()).filter(k => k),
        competitor_names: form.competitor_names ? form.competitor_names.split(',').map(c => c.trim()).filter(c => c) : [],
        regions: form.regions.split(',').map(r => r.trim()).filter(r => r),
        languages: form.languages,
        models: form.models,
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
        setForm(s => ({ ...s, brand_name: '', keywords: '', competitor_names: '' })); 
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
      <section className="container mx-auto px-4 pt-6">
        <div className="max-w-7xl mx-auto">
          
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Générateur de rapport
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="text-gray-900 dark:text-white">Créez votre </span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">rapport GEO</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLONNE GAUCHE : FORMULAIRE (2/3) */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 shadow-xl overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8">
                  
                  {/* IDENTITÉ */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <div className="p-1.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600">
                        <Target className="w-4 h-4" />
                      </div>
                      Paramètres de la marque
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Nom de la marque *</label>
                        <input name="brand_name" value={form.brand_name} onChange={handleChange} required placeholder="Ex: Spotify" className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Régions ciblées (manuel)</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                          <input name="regions" value={form.regions} onChange={handleChange} placeholder="Ex: Global, France, USA..." className="w-full pl-12 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MOTS CLÉS */}
                  <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <div className="p-1.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-600">
                        <Key className="w-4 h-4" />
                      </div>
                      Mots-clés & Concurrents
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Mots-clés à analyser *</label>
                        <textarea name="keywords" value={form.keywords} onChange={handleChange} rows={3} required placeholder="Ex: streaming music, sound, music platform..." className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Marques concurrentes</label>
                        <textarea name="competitor_names" value={form.competitor_names} onChange={handleChange} rows={2} placeholder="Ex: Deezer, Apple Music..." className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* LANGUES (EXPANDABLE) */}
                  <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600">
                          <Globe className="w-4 h-4" />
                        </div>
                        Langues
                      </h3>
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full dark:bg-indigo-900/30 dark:text-indigo-300">
                        {form.languages.length} sélectionnée(s)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ALL_LANGUAGES.slice(0, showAllLangs ? ALL_LANGUAGES.length : 6).map((lang) => {
                        const isSelected = form.languages.includes(lang.id);
                        return (
                          <button
                            key={lang.id}
                            type="button"
                            onClick={() => toggleLanguage(lang.id)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-500' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/80'}`}
                          >
                            {lang.label}
                            {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                          </button>
                        );
                      })}
                    </div>
                    {/* Bouton Voir Plus Langues */}
                    <button 
                      type="button"
                      onClick={() => setShowAllLangs(!showAllLangs)}
                      className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mx-auto"
                    >
                      {showAllLangs ? (
                        <>Voir moins <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>Voir les {ALL_LANGUAGES.length - 6} autres langues <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>

                  {/* MODÈLES (EXPANDABLE) */}
                  <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="p-1.5 rounded bg-orange-100 dark:bg-orange-900/50 text-orange-600">
                          <Brain className="w-4 h-4" />
                        </div>
                        Modèles IA
                      </h3>
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full dark:bg-purple-900/30 dark:text-purple-300">
                        {form.models.length} sélectionné(s)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ALL_MODELS.slice(0, showAllModels ? ALL_MODELS.length : 4).map((model) => {
                        const isSelected = form.models.includes(model.id);
                        return (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => toggleModel(model.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${isSelected ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500 dark:bg-purple-900/20 dark:border-purple-500' : 'border-gray-200 bg-white hover:border-purple-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'}`}
                          >
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-600'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div>
                              <div className={`font-semibold ${isSelected ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-white'}`}>{model.label}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{model.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {/* Bouton Voir Plus Modèles */}
                    <button 
                      type="button"
                      onClick={() => setShowAllModels(!showAllModels)}
                      className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mx-auto"
                    >
                      {showAllModels ? (
                        <>Voir moins <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>Voir les {ALL_MODELS.length - 4} autres modèles <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>

                  {/* ACTION */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full group relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Analyse en cours...</div>
                      ) : (
                        <div className="flex items-center justify-center gap-3"><Zap className="w-5 h-5" /> <span>Lancer l'analyse GEO</span> <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></div>
                      )}
                    </button>
                  </div>
                </form>

                {/* NOTIFICATIONS */}
                {result && (
                  <div className={`mx-8 mb-8 p-6 rounded-2xl border ${result.ok ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${result.ok ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {result.ok ? <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" /> : <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-2 ${result.ok ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>{result.ok ? '✅ Analyse lancée !' : '❌ Erreur'}</h3>
                        <p className={`${result.ok ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>{result.ok ? <>ID Rapport : <code className="px-2 py-1 bg-white/50 dark:bg-black/30 rounded">{result.report_id}</code></> : result.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLONNE DROITE : SIDEBAR KPI (1/3) */}
            {/* COLONNE DROITE : SIDEBAR KPI (1/3) */}
<div className="space-y-6">
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 p-6 shadow-lg sticky top-6">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
      <Trophy className="w-5 h-5 text-purple-500" />
      Aperçu des métriques
    </h3>

    <div className="space-y-4">
      {/* Exemple de carte Keyword */}
      <div className="p-4 bg-white/70 dark:bg-gray-800/50 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm transition-transform hover:scale-[1.02]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
            <BarChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-sm">"Streaming music"</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {/* VISIBILITY */}
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100/50 dark:border-indigo-800/20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Visibility</span>
              <span className="text-lg font-black text-indigo-700 dark:text-indigo-300">66%</span>
            </div>
            <div className="w-full bg-indigo-100 dark:bg-indigo-800/40 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>

          {/* SHARE OF VOICE */}
          <div className="p-3 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl border border-purple-100/50 dark:border-purple-800/20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Share of Voice</span>
              <span className="text-lg font-black text-purple-700 dark:text-purple-300">35%</span>
            </div>
            <p className="text-[10px] text-purple-600/70 dark:text-purple-400/70 italic">vs Deezer (45%) & YouTube (20%)</p>
          </div>

          {/* CITATION */}
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100/50 dark:border-emerald-800/20">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Citation</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">12</span>
                <Globe className="w-3 h-3 text-emerald-500" />
              </div>
            </div>
            <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">Nombre de liens directs vers votre site</p>
          </div>
        </div>
      </div>

      {/* Légende rapide */}
      <div className="p-4 bg-indigo-50/30 dark:bg-white/5 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-800">
        <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-widest">Glossaire</h4>
        <ul className="space-y-3">
          <li className="flex gap-2 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 flex-shrink-0" />
            <span><strong>Visibility :</strong> % de mentions globales dans les réponses générées.</span>
          </li>
          <li className="flex gap-2 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1 flex-shrink-0" />
            <span><strong>SOV :</strong> Votre part de marché conversationnelle face aux concurrents.</span>
          </li>
          <li className="flex gap-2 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
            <span><strong>Citation :</strong> Sources officielles citées avec URL cliquable.</span>
          </li>
        </ul>
      </div>
    </div>

    
  </div>
</div>

          </div>
        </div>
      </section>
    </div>
  );
}