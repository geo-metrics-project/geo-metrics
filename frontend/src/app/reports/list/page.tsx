"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  MapPin, 
  Calendar, 
  Zap, 
  Database,
  ChevronRight,
  Bot,
  Users,
  Globe,
  BarChart3
} from 'lucide-react';

// --- DONNÉES EN DUR (MOCK) ---
const MOCK_REPORTS = [
  {    "id": 2,    "brand_name": "spotify",    "competitor_names": [      "deezer",      "youtube music",      "Napster"    ],    "models": [      "meta-llama/Llama-3.1-8B-Instruct"    ],    "keywords": [      "streaming music",      "sound",      "music plateform"    ],    "regions": [      "Global"    ],    "languages": [      "default"    ],    "prompt_templates": [      "What do you know about {keyword}? What brands come to your mind when you think of {keyword}?"    ],    "created_at": "2026-02-01T14:20:21.054682",    "updated_at": "2026-02-01T14:20:21.054709"  },
  {    "id": 3,    "brand_name": "spotify",    "competitor_names": [      "deezer",      "youtube music",      "Napster"    ],    "models": [      "meta-llama/Llama-3.1-8B-Instruct"    ],    "keywords": [      "streaming music",      "sound",      "music plateform"    ],    "regions": [      "Global"    ],    "languages": [      "default"    ],    "prompt_templates": [      "can you find me some web site where i can find {keyword}?"    ],    "created_at": "2026-02-01T14:26:08.383471",    "updated_at": "2026-02-01T14:26:08.383495"  },
  {    "id": 4,    "brand_name": "spotify",    "competitor_names": [      "deezer",      "youtube music",      "Napster"    ],    "models": [      "openai/gpt-oss-120b"    ],    "keywords": [      "streaming music",      "sound",      "music plateform"    ],    "regions": [      "Global"    ],    "languages": [      "default"    ],    "prompt_templates": [      "can you find me some web site where i can find {keyword}?"    ],    "created_at": "2026-02-01T14:28:13.073593",    "updated_at": "2026-02-01T14:28:13.073617"  },
  {    "id": 5,    "brand_name": "spotify",    "competitor_names": [      "deezer",      "youtube music",      "Napster"    ],    "models": [      "openai/gpt-oss-120b"    ],    "keywords": [      "streaming music",      "sound",      "music plateform"    ],    "regions": [      "Global"    ],    "languages": [      "default"    ],    "prompt_templates": [      "can you find me some web site where i can find {keyword}?"    ],    "created_at": "2026-02-01T14:30:37.233339",    "updated_at": "2026-02-01T14:30:37.233367"  },
  {    "id": 6,    "brand_name": "spotify",    "competitor_names": [      "deezer",      "youtube music",      "Napster"    ],    "models": [      "openai/gpt-oss-20b"    ],    "keywords": [      "streaming music",      "sound",      "music plateform"    ],    "regions": [      "Global"    ],    "languages": [      "default"    ],    "prompt_templates": [      "can you find me some web site where i can find {keyword}?"    ],    "created_at": "2026-02-01T14:33:04.570474",    "updated_at": "2026-02-01T14:33:04.570497"  },
  {    "id": 7,    "brand_name": "spotify",    "competitor_names": [      "deezer",      "youtube music",      "Napster"    ],    "models": [      "openai/gpt-oss-20b"    ],    "keywords": [      "streaming music",      "sound",      "music plateform"    ],    "regions": [      "Global"    ],    "languages": [      "default"    ],    "prompt_templates": [      "can you find me some web site where i can find {keyword}?"    ],    "created_at": "2026-02-01T14:34:05.138884",    "updated_at": "2026-02-01T14:34:05.138909"  },
  {    "id": 8,    "brand_name": "spotify",    "competitor_names": [      "deezer",      "youtube music",      "Napster"    ],    "models": [      "openai/gpt-oss-120b"    ],    "keywords": [      "streaming music",      "sound",      "music plateform"    ],    "regions": [      "Global"    ],    "languages": [      "default"    ],    "prompt_templates": [      "can you find me some web site where i can find {keyword}?"    ],    "created_at": "2026-02-01T14:39:01.473617",    "updated_at": "2026-02-01T14:39:01.473636"  },
  {    "id": 9,    "brand_name": "spotify",    "competitor_names": [      "deezer",      "youtube music",      "Napster"    ],    "models": [      "openai/gpt-oss-120b"    ],    "keywords": [      "streaming music",      "sound",      "music plateform"    ],    "regions": [      "Global"    ],    "languages": [      "default"    ],    "prompt_templates": [      "can you find me some web site where i can find {keyword}?"    ],    "created_at": "2026-02-01T14:40:01.048458",    "updated_at": "2026-02-01T14:40:01.048473"  }
];

export default function ReportsListPage() {
  // On utilise directement les données mockées (triées par date décroissante pour le visuel)
  const reports = MOCK_REPORTS.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Nettoyage du nom du modèle pour l'affichage
  const formatModelName = (modelRaw: string) => {
    if (modelRaw.includes('Llama')) return 'Llama 3.1';
    if (modelRaw.includes('gpt-oss-120b')) return 'GPT OSS 120B';
    if (modelRaw.includes('gpt-oss-20b')) return 'GPT OSS 20B';
    return modelRaw.split('/')[1] || modelRaw;
  };

  // Petite fonction utilitaire pour la couleur du badge modèle
  const getModelColor = (modelName: string) => {
    if (modelName.includes('Llama')) return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-12">
      <section className="container mx-auto px-4 pt-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 mb-6">
                <Database className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  Dashboard
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                <span className="text-gray-900 dark:text-white">Vos rapports </span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">GEO</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                Suivez l'évolution de la visibilité de <strong>{reports[0].brand_name}</strong>.
                <span className="block text-sm mt-2 text-gray-400 font-mono">* Données de démonstration chargées en mémoire</span>
              </p>
            </div>

            <a 
              href="/create" 
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Zap className="w-4 h-4" />
              Nouveau rapport
            </a>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div 
                key={report.id}
                className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 shadow-lg hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
              >
                {/* Card Header */}
                <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40">
                            <BarChart3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          Rapport #{report.id}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                        {report.brand_name}
                      </h3>
                    </div>
                    
                    {/* Badge du modèle IA */}
                    
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 relative z-10">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(report.created_at)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col gap-5">
                  
                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <Globe className="w-3.5 h-3.5" />
                              Région
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {report.regions[0] || 'Global'}
                          </span>
                      </div>
                      <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <Users className="w-3.5 h-3.5" />
                              Concurrents
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {report.competitor_names.length} analysés
                          </span>
                      </div>
                  </div>

                  {/* Keywords Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <Search className="w-3.5 h-3.5" />
                      <span>Mots-clés ({report.keywords.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {report.keywords.slice(0, 3).map((k, i) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                          {k}
                        </span>
                      ))}
                      {report.keywords.length > 3 && (
                        <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 rounded-md text-xs text-gray-400 border border-gray-200 dark:border-gray-700">
                          +{report.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 mt-auto">
                  <a 
                    href={`/report/${report.id}`} 
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm transition-all group-hover:translate-x-1"
                  >
                    <span>Voir le rapport complet</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}