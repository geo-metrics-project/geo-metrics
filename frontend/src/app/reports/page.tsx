"use client";

import React, { useState, useEffect } from 'react';
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

// Interface for Report
interface Report {
  id: number;
  brand_name: string;
  competitor_names: string[];
  models: string[];
  keywords: string[];
  regions: string[];
  languages: string[];
  prompt_templates: string[];
  created_at: string;
  updated_at: string;
}

export default function ReportsListPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        if (response.ok) {
          const data = await response.json();
          setReports(data.sort((a: Report, b: Report) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
                Suivez l'évolution de la visibilité de vos marques.
                {loading && <span className="block text-sm mt-2 text-gray-400 font-mono">Chargement des rapports...</span>}
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

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Database className="w-8 h-8 text-indigo-500 animate-pulse mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Chargement de vos rapports...</p>
              </div>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Aucun rapport trouvé.</p>
                <a 
                  href="/reports/create" 
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Créer votre premier rapport
                </a>
              </div>
            </div>
          ) : (
            /* Grid Layout */
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
                    href={`/reports/${report.id}`} 
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm transition-all group-hover:translate-x-1"
                  >
                    <span>Voir le rapport complet</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
    </div>
  );
}