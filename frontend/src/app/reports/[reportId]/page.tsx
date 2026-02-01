"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartData,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// --- INTERFACES ---
interface ReportMetadata {
  id: number;
  brand_name: string;
  competitor_names: string[];
  models: string[];
  keywords: string[];
  regions: string[];
  languages: string[];
  prompt_templates: string[];
}

interface KpiMetadata {
  total_responses_aggregated?: number;
  limit: number;
  offset: number;
  applied_filters: { [key: string]: string };
  aggregated_by?: string;
}

interface KpiData {
  total_responses: number;
  brand_mentioned: number;
  brand_citation_with_link: number;
  competitor_mentions: { [name: string]: number };
}

interface AggregatedKpis {
  [key: string]: KpiData;
}

interface LlmResponse {
  id: number;
  report_id: number;
  prompt_template: string;
  region: string;
  language_code: string;
  keyword: string;
  model: string;
  prompt_text: string;
  response: string;
  kpis: {
    brand_mentioned: boolean;
    competitor_mentions: { [key: string]: boolean };
    brand_citation_with_link: boolean;
  };
  created_at: string;
}

interface FilterState {
  region: string;
  language: string;
  model: string;
  keyword: string;
  prompt_templates: string;
  aggregateBy: string;
}

const GlobalDashboard: React.FC = () => {
  const params = useParams();
  const reportId = params.reportId as string;
  // État des filtres
  const [filters, setFilters] = useState<FilterState>({
    region: 'All',
    language: 'All',
    model: 'All',
    keyword: 'All',
    prompt_templates : 'All',
    aggregateBy: 'none'
  });

  const [report, setReport] = useState<ReportMetadata | null>(null);
  const [kpiMetadata, setKpiMetadata] = useState<KpiMetadata | null>(null);
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [aggregatedKpis, setAggregatedKpis] = useState<AggregatedKpis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [responses, setResponses] = useState<{ [key: string]: LlmResponse[] }>({});
  const [loadingResponses, setLoadingResponses] = useState<{ [key: string]: boolean }>({});
  const [showResponses, setShowResponses] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (filters.region !== 'All') queryParams.set('region', filters.region);
        if (filters.language !== 'All') queryParams.set('language_code', filters.language);
        if (filters.model !== 'All') queryParams.set('model', filters.model);
        if (filters.keyword !== 'All') queryParams.set('keyword', filters.keyword);
        if (filters.prompt_templates !== 'All') queryParams.set('prompt_template', filters.prompt_templates);
        if (filters.aggregateBy !== 'none') queryParams.set('aggregate_by', filters.aggregateBy);

        queryParams.set('limit', '1000');
        queryParams.set('offset', '0');

        const [reportRes, kpiRes] = await Promise.all([
          fetch(`/api/reports/${reportId}`),
          fetch(`/api/reports/${reportId}/kpis?${queryParams}`)
        ]);

        if (!reportRes.ok || !kpiRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const reportData = await reportRes.json();
        const kpiResponse = await kpiRes.json();

        setReport(reportData);
        setKpiMetadata(kpiResponse.metadata);

        if (kpiResponse.metadata.aggregated_by) {
          setAggregatedKpis(kpiResponse.kpis);
          // Compute totals
          const kpis = Object.values(kpiResponse.kpis) as KpiData[];
          const totalKpi: KpiData = {
            total_responses: kpis.reduce((sum, kpi) => sum + kpi.total_responses, 0),
            brand_mentioned: kpis.reduce((sum, kpi) => sum + kpi.brand_mentioned, 0),
            brand_citation_with_link: kpis.reduce((sum, kpi) => sum + kpi.brand_citation_with_link, 0),
            competitor_mentions: kpis.reduce((acc, kpi) => {
              Object.entries(kpi.competitor_mentions).forEach(([comp, count]) => {
                acc[comp] = (acc[comp] || 0) + count;
              });
              return acc;
            }, {} as { [name: string]: number })
          };
          setKpiData(totalKpi);
        } else {
          setKpiData(kpiResponse.kpis);
          setAggregatedKpis(null);
        }
      } catch (error) {
        console.error("Erreur API", error);
        // Optionally set an error state
      } finally {
        setLoading(false);
      }
    };
    if (reportId) {
      fetchData();
    }
  }, [reportId, filters]); // Refetch when filters change

  const fetchResponses = async (groupKey?: string) => {
    const key = groupKey || 'main';
    if (responses[key]) {
      setShowResponses(prev => ({ ...prev, [key]: !prev[key] }));
      return;
    }
    setLoadingResponses(prev => ({ ...prev, [key]: true }));
    try {
      const queryParams = new URLSearchParams();
      if (groupKey && filters.aggregateBy !== 'none') {
        if (filters.aggregateBy === 'language_code') queryParams.set('language_code', groupKey);
        else if (filters.aggregateBy === 'model') queryParams.set('model', groupKey);
        else if (filters.aggregateBy === 'region') queryParams.set('region', groupKey);
        else if (filters.aggregateBy === 'keyword') queryParams.set('keyword', groupKey);
        else if (filters.aggregateBy === 'prompt_template') queryParams.set('prompt_template', groupKey);
      } else {
        if (filters.region !== 'All') queryParams.set('region', filters.region);
        if (filters.language !== 'All') queryParams.set('language_code', filters.language);
        if (filters.model !== 'All') queryParams.set('model', filters.model);
        if (filters.keyword !== 'All') queryParams.set('keyword', filters.keyword);
        if (filters.prompt_templates !== 'All') queryParams.set('prompt_template', filters.prompt_templates);
      }
      queryParams.set('limit', '100');
      queryParams.set('offset', '0');

      const res = await fetch(`/api/reports/${reportId}/llm-responses?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setResponses(prev => ({ ...prev, [key]: data.responses }));
        setShowResponses(prev => ({ ...prev, [key]: true }));
      }
    } catch (error) {
      console.error('Error fetching responses', error);
    } finally {
      setLoadingResponses(prev => ({ ...prev, [key]: false }));
    }
  };

  const pieData: ChartData<'pie'> = {
    labels: [report?.brand_name || 'Brand', ...Object.keys(kpiData?.competitor_mentions || {})],
    datasets: [{
      data: [kpiData?.brand_mentioned || 0, ...Object.values(kpiData?.competitor_mentions || {})],
      backgroundColor: ['#1DB954', '#10b981', '#f59e0b', '#6366f1', '#ec4899'],
      borderWidth: 2,
    }]
  };

  if (loading || !report || !kpiData || !kpiMetadata) return <div className="h-screen flex items-center justify-center text-slate-400">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 font-sans text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter capitalize">
            {report.brand_name} <span className="text-slate-400 dark:text-slate-500">Intelligence</span>
          </h1>
        </header>

        {/* SECTION FILTRES (Dropdowns) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Filtres de recherche</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            <FilterSelect 
              label="Region" 
              value={filters.region} 
              options={report.regions} 
              onChange={(v) => setFilters({...filters, region: v})} 
            />
            
            <FilterSelect 
              label="Language" 
              value={filters.language} 
              options={report.languages} 
              onChange={(v) => setFilters({...filters, language: v})} 
            />

            <FilterSelect 
              label="Model" 
              value={filters.model} 
              options={report.models} 
              onChange={(v) => setFilters({...filters, model: v})} 
            />

            <FilterSelect 
              label="Keyword" 
              value={filters.keyword} 
              options={report.keywords} 
              onChange={(v) => setFilters({...filters, keyword: v})} 
            />

            <FilterSelect 
              label="Prompt Template" 
              value={filters.prompt_templates} 
              options={report.prompt_templates} 
              onChange={(v) => setFilters({...filters, prompt_templates: v})} 
            />

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-blue-600 dark:text-blue-400 ml-1 uppercase">Aggregate By</label>
              <select 
                className="bg-blue-50 dark:bg-blue-900 border-none text-blue-700 dark:text-blue-200 text-xs font-bold rounded-xl p-2.5 outline-none cursor-pointer"
                value={filters.aggregateBy}
                onChange={(e) => setFilters({...filters, aggregateBy: e.target.value})}
              >
                <option value="none">None</option>
                <option value="keyword">Keyword</option>
                <option value="region">Region</option>
                <option value="language_code">Language</option>
                <option value="model">Model</option>
                <option value="prompt_template">Prompt Template</option>
              </select>
            </div>

          </div>
        </div>

        {/* CONTENT */}
        {aggregatedKpis ? (
          <div className="space-y-8">
            {Object.entries(aggregatedKpis).map(([key, kpi]) => {
              const groupPieData: ChartData<'pie'> = {
                labels: [report?.brand_name || 'Brand', ...Object.keys(kpi.competitor_mentions || {})],
                datasets: [{
                  data: [kpi.brand_mentioned || 0, ...Object.values(kpi.competitor_mentions || {})],
                  backgroundColor: ['#1DB954', '#10b981', '#f59e0b', '#6366f1', '#ec4899'],
                  borderWidth: 2,
                }]
              };
              return (
                <div key={key} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-6 capitalize">{key}</h2>
                  
                  {/* KPI Cards for this group */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <KpiCard title="Visibility" value={`${kpi.total_responses > 0 ? ((kpi.brand_mentioned / kpi.total_responses) * 100).toFixed(0) : 0}%`} desc="Mentions Marque" />
                    <KpiCard title="Share of Voice" value={`${(() => {
                      const totalMentions = kpi.brand_mentioned + Object.values(kpi.competitor_mentions).reduce((a, b) => a + b, 0);
                      return totalMentions > 0 ? ((kpi.brand_mentioned / totalMentions) * 100).toFixed(0) : 0;
                    })()}%`} desc="vs Concurrents" />
                    <KpiCard title="Citations" value={`${kpi.brand_mentioned > 0 ? ((kpi.brand_citation_with_link / kpi.brand_mentioned) * 100).toFixed(0) : 0}%`} desc="Avec liens" />
                  </div>

                  {/* Chart for this group */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Distribution</h3>
                      <div className="h-64"><Pie data={groupPieData} options={{ maintainAspectRatio: false }} /></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Détails</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-3 border-b border-slate-50 dark:border-slate-700 capitalize font-medium">
                          <span>{report.brand_name}</span>
                          <span className="font-bold text-green-600 dark:text-green-400">{kpi.brand_mentioned}</span>
                        </div>
                        {report.competitor_names.map(c => (
                          <div key={c} className="flex justify-between py-3 border-b border-slate-50 dark:border-slate-700 last:border-0 capitalize font-medium">
                            <span>{c}</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{kpi.competitor_mentions[c] || 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Raw Responses */}
                  <div className="mt-8">
                    <button
                      onClick={() => fetchResponses(key)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {loadingResponses[key] ? 'Loading...' : showResponses[key] ? 'Hide Raw Responses' : 'View Raw Responses'}
                    </button>
                    {showResponses[key] && responses[key] && (
                      <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                        {responses[key].map(resp => (
                          <div key={resp.id} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              <strong>Model:</strong> {resp.model} | <strong>Region:</strong> {resp.region} | <strong>Language:</strong> {resp.language_code} | <strong>Keyword:</strong> {resp.keyword} | <strong>Prompt Template:</strong> {resp.prompt_template}
                            </div>
                            <div className="mb-2">
                              <strong>Prompt:</strong> <span className="text-slate-700 dark:text-slate-300">{resp.prompt_text}</span>
                            </div>
                            <div className="mb-2">
                              <strong>Response:</strong>
                            </div>
                            <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap bg-white dark:bg-slate-600 p-2 rounded">{resp.response}</div>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                              <strong>KPIs:</strong> Brand Mentioned: {resp.kpis.brand_mentioned ? 'Yes' : 'No'} | Citations with Link: {resp.kpis.brand_citation_with_link ? 'Yes' : 'No'} | Competitors: {Object.keys(resp.kpis.competitor_mentions).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <KpiCard title="Visibility" value={`${kpiData.total_responses > 0 ? ((kpiData.brand_mentioned / kpiData.total_responses) * 100).toFixed(0) : 0}%`} desc="Mentions Marque" />
              <KpiCard title="Share of Voice" value={`${(() => {
                const totalMentions = kpiData.brand_mentioned + Object.values(kpiData.competitor_mentions).reduce((a, b) => a + b, 0);
                return totalMentions > 0 ? ((kpiData.brand_mentioned / totalMentions) * 100).toFixed(0) : 0;
              })()}%`} desc="vs Concurrents" />
              <KpiCard title="Citations" value={`${kpiData.brand_mentioned > 0 ? ((kpiData.brand_citation_with_link / kpiData.brand_mentioned) * 100).toFixed(0) : 0}%`} desc="Avec liens" />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="font-black text-slate-800 dark:text-slate-100 mb-4">Distribution</h2>
                <div className="h-64"><Pie data={pieData} options={{ maintainAspectRatio: false }} /></div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="font-black text-slate-800 dark:text-slate-100 mb-4">Détails</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-slate-50 dark:border-slate-700 capitalize font-medium">
                    <span>{report.brand_name}</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{kpiData.brand_mentioned}</span>
                  </div>
                  {report.competitor_names.map(c => (
                    <div key={c} className="flex justify-between py-3 border-b border-slate-50 dark:border-slate-700 last:border-0 capitalize font-medium">
                      <span>{c}</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{kpiData.competitor_mentions[c] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Raw Responses */}
            <div className="mt-8">
              <button
                onClick={() => fetchResponses()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {loadingResponses['main'] ? 'Loading...' : showResponses['main'] ? 'Hide Raw Responses' : 'View Raw Responses'}
              </button>
              {showResponses['main'] && responses['main'] && (
                <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                  {responses['main'].map(resp => (
                    <div key={resp.id} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <strong>Model:</strong> {resp.model} | <strong>Region:</strong> {resp.region} | <strong>Language:</strong> {resp.language_code} | <strong>Keyword:</strong> {resp.keyword} | <strong>Prompt Template:</strong> {resp.prompt_template}
                      </div>
                      <div className="mb-2">
                        <strong>Prompt:</strong> <span className="text-slate-700 dark:text-slate-300">{resp.prompt_text}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Response:</strong>
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap bg-white dark:bg-slate-600 p-2 rounded">{resp.response}</div>
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <strong>KPIs:</strong> Brand Mentioned: {resp.kpis.brand_mentioned ? 'Yes' : 'No'} | Citations with Link: {resp.kpis.brand_citation_with_link ? 'Yes' : 'No'} | Competitors: {Object.keys(resp.kpis.competitor_mentions).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

// Sous-composant pour les Selects
const FilterSelect = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 ml-1 uppercase">{label}</label>
    <select 
      className="bg-slate-100 dark:bg-slate-700 border-none text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="All">All {label}s</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const KpiCard = ({ title, value, desc }: { title: string, value: string, desc: string }) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{title}</p>
    <p className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-1">{value}</p>
    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase">{desc}</p>
  </div>
);

export default GlobalDashboard;