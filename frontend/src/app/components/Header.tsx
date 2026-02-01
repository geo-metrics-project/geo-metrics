'use client';

import { ArrowRight, User, LogOut, ChevronDown, Settings, BarChart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [session, setSession] = useState(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_KRATOS_URL || "https://kratos.combaldieu.fr";
        const response = await fetch(`${baseUrl}/sessions/whoami`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setSession(data);
          setIsLoggedIn(true);
          setUserName(`${data.identity.traits.firstName} ${data.identity.traits.lastName}`);
          setUserEmail(data.identity.traits.email);
        } else {
          setIsLoggedIn(false);
          setSession(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setSession(null);
      }
    };

    fetchSession();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_KRATOS_URL || "https://kratos.combaldieu.fr";
    window.location.href = `${baseUrl}/self-service/login/browser`;
  };

  const handleRegister = () => {
    const baseUrl = process.env.NEXT_PUBLIC_KRATOS_URL || "https://kratos.combaldieu.fr";
    window.location.href = `${baseUrl}/self-service/registration/browser`;
  };

  const handleLogout = () => {
    const baseUrl = process.env.NEXT_PUBLIC_KRATOS_URL || "https://kratos.combaldieu.fr";
    window.location.href = `${baseUrl}/self-service/logout/browser`;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between" role="navigation" aria-label="Navigation principale">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1"
            aria-label="Accueil GEOmetrics"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" aria-hidden="true" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">GEOmetrics</span>
            <span className="hidden sm:inline text-sm px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">BETA</span>
          </Link>



          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Desktop Auth Buttons */}
            {isLoggedIn ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-expanded={showDropdown}
                  aria-haspopup="true"
                  aria-label="Menu utilisateur"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {userName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50"
                    role="menu"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 mx-1 rounded"
                      role="menuitem"
                    >
                      <BarChart className="w-4 h-4" aria-hidden="true" />
                      Tableau de bord
                    </Link>

                    <Link
                      href="/account"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 mx-1 rounded"
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4" aria-hidden="true" />
                      Paramètres
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 mx-1 rounded mt-2 border-t border-gray-100 dark:border-gray-700"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Se connecter"
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  Connexion
                </button>
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  aria-label="S'inscrire"
                >
                  S'inscrire
                </button>
              </div>
            )}

            {/* CTA Button */}
            <Link
              href={isLoggedIn ? "/reports/create" : "/auth/login"}
              className="hidden sm:flex group items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Lancer un audit IA"
            >
              <span>Lancer un audit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded={showMobileMenu}
              aria-label="Menu mobile"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-gray-900 dark:text-white" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900 dark:text-white" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div
            ref={mobileMenuRef}
            className="mt-4 pb-4 space-y-2 lg:hidden"
            role="navigation"
            aria-label="Menu mobile"
          >
            <Link
              href="#features"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Fonctionnalités
            </Link>
            <Link
              href="/tarifs"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Tarifs
            </Link>
            <Link
              href="#resources"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Ressources
            </Link>

            {isLoggedIn ? (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 space-y-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <BarChart className="w-4 h-4 inline mr-2" aria-hidden="true" />
                  Tableau de bord
                </Link>
                <Link
                  href="/account"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 inline mr-2" aria-hidden="true" />
                  Paramètres
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-700 rounded-lg transition-colors border-t border-gray-200 dark:border-gray-700"
                >
                  <LogOut className="w-4 h-4 inline mr-2" aria-hidden="true" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 space-y-2">
                <button
                  onClick={() => {
                    handleLogin();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 inline mr-2" aria-hidden="true" />
                  Connexion
                </button>
                <button
                  onClick={() => {
                    handleRegister();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg transition-all text-center"
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
