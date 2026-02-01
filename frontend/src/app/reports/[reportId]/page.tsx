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

interface KpiData {
  total_responses: number;
  brand_mentioned: number;
  brand_citation_with_link: number;
  competitor_mentions: { [name: string]: number };
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
    aggregateBy: 'keyword'
  });

  const [report, setReport] = useState<ReportMetadata | null>(null);
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportRes, kpiRes] = await Promise.all([
          fetch(`/api/reports/${reportId}`),
          fetch(`/api/reports/${reportId}/kpis`)
        ]);

        if (!reportRes.ok || !kpiRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const reportData = await reportRes.json();
        const kpiDataRaw = await kpiRes.json();

        setReport(reportData);
        setKpiData({ ...kpiDataRaw, competitor_mentions: kpiDataRaw.competitor_mentions || {} });
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
  }, [reportId, filters]); // Still depend on filters if needed for future filtering

  const pieData: ChartData<'pie'> = {
    labels: [report?.brand_name || 'Brand', ...Object.keys(kpiData?.competitor_mentions || {})],
    datasets: [{
      data: [kpiData?.brand_mentioned || 0, ...Object.values(kpiData?.competitor_mentions || {})],
      backgroundColor: ['#1DB954', '#10b981', '#f59e0b', '#6366f1', '#ec4899'],
      borderWidth: 2,
    }]
  };

  if (loading || !report || !kpiData) return <div className="h-screen flex items-center justify-center text-slate-400">Chargement...</div>;

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
                <option value="keyword">Keyword</option>
                <option value="region">Region</option>
                <option value="model">Model</option>
              </select>
            </div>

          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KpiCard title="Visibility" value={`${((kpiData.brand_mentioned / kpiData.total_responses) * 100).toFixed(0)}%`} desc="Mentions Marque" />
          <KpiCard title="Share of Voice" value="54%" desc="vs Concurrents" />
          <KpiCard title="Citations" value={`${((kpiData.brand_citation_with_link / kpiData.brand_mentioned) * 100).toFixed(0)}%`} desc="Avec liens" />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="font-black text-slate-800 dark:text-slate-100 mb-4">Distribution</h2>
            <div className="h-64"><Pie data={pieData} options={{ maintainAspectRatio: false }} /></div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="font-black text-slate-800 dark:text-slate-100 mb-4">Détail Compétiteurs</h2>
            {report.competitor_names.map(c => (
              <div key={c} className="flex justify-between py-3 border-b border-slate-50 dark:border-slate-700 last:border-0 capitalize font-medium">
                <span>{c}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{kpiData.competitor_mentions[c] || 0}</span>
              </div>
            ))}
          </div>
        </div>

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