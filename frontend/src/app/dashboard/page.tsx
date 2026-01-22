'use client';

import { BarChart3, TrendingUp, Users, Zap, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      router.push('/auth/login');
      return;
    }

    setIsLoggedIn(true);

    // Load user data
    const email = localStorage.getItem('user_email');
    const data = localStorage.getItem('user_data');

    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setUserData({
          name: `${parsedData.firstName} ${parsedData.lastName}`,
          email: parsedData.email || email || '',
        });
      } catch (e) {
        setUserData({ name: 'Utilisateur', email: email || '' });
      }
    } else {
      setUserData({ name: 'Utilisateur', email: email || '' });
    }
  }, [router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bienvenue, {userData.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Voici un aperçu de vos audits et de vos performances.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Audits totaux</h3>
              <BarChart3 className="w-5 h-5 text-indigo-600" aria-hidden="true" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
            <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              <span>+3 ce mois-ci</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Score moyen</h3>
              <TrendingUp className="w-5 h-5 text-purple-600" aria-hidden="true" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">78/100</p>
            <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              <span>+5 points</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Visibilité IA</h3>
              <Zap className="w-5 h-5 text-yellow-600" aria-hidden="true" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">82%</p>
            <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              <span>+2% vs semaine dernière</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pages analysées</h3>
              <Users className="w-5 h-5 text-blue-600" aria-hidden="true" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">156</p>
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              <span>-1 page</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Audits */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Audits récents</h2>
              <Link
                href="#all-audits"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
              >
                Voir tous
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Mon Blog', score: 85, status: 'Optimisé', date: 'Hier' },
                { name: 'Page Produits', score: 72, status: 'À améliorer', date: 'Il y a 2 jours' },
                { name: 'Page Contact', score: 91, status: 'Excellent', date: 'Il y a 3 jours' },
              ].map((audit, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{audit.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{audit.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{audit.score}</p>
                    <p
                      className={`text-xs font-medium ${
                        audit.status === 'Excellent'
                          ? 'text-green-600'
                          : audit.status === 'Optimisé'
                          ? 'text-blue-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {audit.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Link
                  href="/reports/create"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  Nouveau rapport
                </Link>
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white">
                  <Zap className="w-4 h-4" aria-hidden="true" />
                  Lancer un audit
                </button>
              </div>
            </div>

            {/* Usage Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Plan actuel</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Audits utilisés</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">12/50</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: '24%' }}
                      role="progressbar"
                      aria-valuenow={24}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Audits utilisés"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pages analysées</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">156/500</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: '31.2%' }}
                      role="progressbar"
                      aria-valuenow={31.2}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Pages analysées"
                    />
                  </div>
                </div>
              </div>

              <Link
                href="/tarifs"
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors w-full justify-center font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Améliorer votre plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
