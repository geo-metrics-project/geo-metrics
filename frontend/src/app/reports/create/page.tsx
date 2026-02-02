"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const ALL_LANGUAGES = [
  { id: 'default', label: 'Original' },
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
  { id: 'openai/gpt-oss-120b', label: 'GPT OSS 120B', desc: 'Puissant Open Source' },
  { id: 'deepseek-ai/DeepSeek-V3.2', label: 'DeepSeek V3.2', desc: 'Modèle Avancé' },
  { id: 'zai-org/GLM-4.7-Flash', label: 'GLM 4.7 Flash', desc: 'Ultra Rapide' },
  { id: 'Qwen/Qwen3-VL-8B-Instruct', label: 'Qwen3 VL 8B', desc: 'Vision & Texte' },
  { id: 'moonshotai/Kimi-K2.5', label: 'Kimi K2.5', desc: 'Conversationnel' },
  { id: 'google/gemma-3-27b-it', label: 'Gemma 3 27B', desc: 'Par Google' },
  { id: 'mistralai/Mixtral-8x22B-Instruct-v0.1', label: 'Mixtral 8x22B', desc: 'Top Performance EU' },
  { id: 'meta-llama/Llama-3.3-70B-Instruct', label: 'Llama 3.3 70B', desc: 'Très Puissant' },
  { id: 'Qwen/Qwen3-235B-A22B-Instruct-2507', label: 'Qwen3 235B', desc: 'Massif & Précis' },
  { id: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek R1', desc: 'Raisonnement Avancé' },
  { id: 'meta-llama/Llama-4-Scout-17B-16E-Instruct', label: 'Llama 4 Scout 17B', desc: 'Nouvelle Génération' }
];

export default function CreateReportPage() {
  const router = useRouter();
  const [form, setForm] = useState<{ 
    brand_name: string; 
    keywords: string[]; 
    competitor_names: string[]; 
    regions: string[]; 
    languages: string[]; 
    models: string[];
    prompt_templates: string[]
  }>({ 
    brand_name: '',
    keywords: [],
    competitor_names: [], 
    regions: ['Global'], 
    languages: ['default'], 
    models: ['meta-llama/Llama-3.1-8B-Instruct'],
    prompt_templates: ["Quelles marques me conseilles-tu à propos de {keyword}?"]
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; message?: string }>(null);
  
  // États pour "Voir plus"
  const [showAllLangs, setShowAllLangs] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);

  // État pour nouvelle région, concurrent et mot-clé
  const [newRegion, setNewRegion] = useState('');
  const [newCompetitor, setNewCompetitor] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newPromptTemplate, setNewPromptTemplate] = useState('');
  const [includeGlobal, setIncludeGlobal] = useState(true);

  // Gestion des champs textes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  // Effet pour gérer l'inclusion de Global
  useEffect(() => {
    setForm(prev => {
      const hasGlobal = prev.regions.includes('Global');
      if (includeGlobal && !hasGlobal) {
        return { ...prev, regions: ['Global', ...prev.regions] };
      } else if (!includeGlobal && hasGlobal) {
        return { ...prev, regions: prev.regions.filter(r => r !== 'Global') };
      }
      return prev;
    });
  }, [includeGlobal]);

  // Ajouter une région
  function addRegion() {
    if (newRegion.trim() && !form.regions.includes(newRegion.trim()) && newRegion.trim().toLowerCase() !== 'global') {
      setForm(prev => ({ ...prev, regions: [...prev.regions, newRegion.trim()] }));
      setNewRegion('');
    }
  }

  // Supprimer une région
  function removeRegion(region: string) {
    setForm(prev => ({ ...prev, regions: prev.regions.filter(r => r !== region) }));
  }

  // Ajouter un concurrent
  function addCompetitor() {
    if (newCompetitor.trim() && !form.competitor_names.includes(newCompetitor.trim())) {
      setForm(prev => ({ ...prev, competitor_names: [...prev.competitor_names, newCompetitor.trim()] }));
      setNewCompetitor('');
    }
  }

  // Supprimer un concurrent
  function removeCompetitor(competitor: string) {
    setForm(prev => ({ ...prev, competitor_names: prev.competitor_names.filter(c => c !== competitor) }));
  }

  // Ajouter un mot-clé
  function addKeyword() {
    if (newKeyword.trim() && !form.keywords.includes(newKeyword.trim())) {
      setForm(prev => ({ ...prev, keywords: [...prev.keywords, newKeyword.trim()] }));
      setNewKeyword('');
    }
  }

  // Supprimer un mot-clé
  function removeKeyword(keyword: string) {
    setForm(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== keyword) }));
  }

  // Ajouter un template de prompt
  function addPromptTemplate() {
    if (newPromptTemplate.trim() && !form.prompt_templates.includes(newPromptTemplate.trim())) {
      setForm(prev => ({ ...prev, prompt_templates: [...prev.prompt_templates, newPromptTemplate.trim()] }));
      setNewPromptTemplate('');
    }
  }

  // Supprimer un template de prompt
  function removePromptTemplate(template: string) {
    setForm(prev => ({ ...prev, prompt_templates: prev.prompt_templates.filter(t => t !== template) }));
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

    // Validation
    if (!form.brand_name.trim()) {
      setResult({ ok: false, message: "Le nom de la marque est requis." });
      setLoading(false);
      return;
    }
    if (form.keywords.length === 0) {
      setResult({ ok: false, message: "Au moins un mot-clé est requis." });
      setLoading(false);
      return;
    }
    if (form.regions.length === 0) {
      setResult({ ok: false, message: "Au moins une région est requise." });
      setLoading(false);
      return;
    }
    if (form.languages.length === 0) {
      setResult({ ok: false, message: "Au moins une langue est requise." });
      setLoading(false);
      return;
    }
    if (form.models.length === 0) {
      setResult({ ok: false, message: "Au moins un modèle IA est requis." });
      setLoading(false);
      return;
    }
    if (form.prompt_templates.length === 0) {
      setResult({ ok: false, message: "Au moins un template de prompt est requis." });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        brand_name: form.brand_name,
        keywords: form.keywords,
        competitor_names: form.competitor_names,
        regions: form.regions,
        languages: form.languages,
        models: form.models,
        prompt_templates: form.prompt_templates
      };

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setResult({ ok: true });
        setTimeout(() => {
          router.push(`/reports/${data.report_id}`);
        }, 2000);
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
                        <input name="brand_name" value={form.brand_name} onChange={handleChange} placeholder="Ex: Spotify" className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Marques concurrentes</label>
                        <div className="flex gap-2">
                          <input 
                            value={newCompetitor} 
                            onChange={(e) => setNewCompetitor(e.target.value)} 
                            placeholder="Ex: Deezer, Apple Music..." 
                            className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
                          />
                          <button 
                            type="button" 
                            onClick={addCompetitor} 
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                          >
                            Ajouter
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {form.competitor_names.map((competitor, index) => (
                            <div key={index} className="flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                              <span>{competitor}</span>
                              <button 
                                type="button" 
                                onClick={() => removeCompetitor(competitor)} 
                                className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200 ml-1 text-lg leading-none"
                              >
                                ×
                              </button>
                            </div>
                          ))}
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
                      Mots-clés
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Mots-clés à analyser *</label>
                        <div className="flex gap-2">
                          <input 
                            value={newKeyword} 
                            onChange={(e) => setNewKeyword(e.target.value)} 
                            placeholder="Ex: streaming music, sound..." 
                            className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                          />
                          <button 
                            type="button" 
                            onClick={addKeyword} 
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                          >
                            Ajouter
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {form.keywords.map((keyword, index) => (
                            <div key={index} className="flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                              <span>{keyword}</span>
                              <button 
                                type="button" 
                                onClick={() => removeKeyword(keyword)} 
                                className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200 ml-1 text-lg leading-none"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Templates de prompts *</label>
                        <div className="flex gap-2">
                          <input 
                            value={newPromptTemplate} 
                            onChange={(e) => setNewPromptTemplate(e.target.value)} 
                            placeholder="Ex: What do you know about {keyword}?..." 
                            className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPromptTemplate())}
                          />
                          <button 
                            type="button" 
                            onClick={addPromptTemplate} 
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                          >
                            Ajouter
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {form.prompt_templates.map((template, index) => (
                            <div key={index} className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm max-w-xs">
                              <span className="truncate">{template}</span>
                              <button 
                                type="button" 
                                onClick={() => removePromptTemplate(template)} 
                                className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200 ml-1 text-lg leading-none flex-shrink-0"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LANGUES & RÉGIONS */}
                  <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600">
                          <Globe className="w-4 h-4" />
                        </div>
                        Langues & Régions
                      </h3>
                    </div>

                    {/* Langues */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Langues *</span>
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

                    {/* Régions */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Régions *</span>
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full dark:bg-indigo-900/30 dark:text-indigo-300">
                          {form.regions.length} sélectionnée(s)
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="includeGlobal" 
                            checked={includeGlobal} 
                            onChange={(e) => setIncludeGlobal(e.target.checked)} 
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor="includeGlobal" className="text-sm text-gray-700 dark:text-gray-200">Inclure la région Global</label>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            value={newRegion} 
                            onChange={(e) => setNewRegion(e.target.value)} 
                            placeholder="Ex: France, USA..." 
                            className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRegion())}
                          />
                          <button 
                            type="button" 
                            onClick={addRegion} 
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                          >
                            Ajouter
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {form.regions.map((region, index) => (
                            <div key={index} className="flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                              <span>{region}</span>
                              {region !== 'Global' && (
                                <button 
                                  type="button" 
                                  onClick={() => removeRegion(region)} 
                                  className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200 ml-1 text-lg leading-none"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MODÈLES (EXPANDABLE) */}
                  <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="p-1.5 rounded bg-orange-100 dark:bg-orange-900/50 text-orange-600">
                          <Brain className="w-4 h-4" />
                        </div>
                        Modèles IA *
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
                        <h3 className={`font-bold text-lg mb-2 ${result.ok ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>{result.ok ? '✅ Analyse réussie !' : '❌ Erreur'}</h3>
                        <p className={`${result.ok ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>{result.ok ? 'Redirection vers le rapport en cours...' : result.message}</p>
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
      Exemple de métriques
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