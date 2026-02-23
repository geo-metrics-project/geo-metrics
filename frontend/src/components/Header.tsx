'use client';

import { User, LogOut, ChevronDown, Settings, BarChart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [session, setSession] = useState(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

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
          setUserName(data.identity.traits.email);
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

  const handleLogout = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_KRATOS_URL || "https://kratos.combaldieu.fr";
      const response = await fetch(`${baseUrl}/self-service/logout/browser`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.logout_url;
      } else {
        console.error('Failed to initiate logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
          <nav className="relative flex items-center justify-between" role="navigation" aria-label="Navigation principale">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1"
            aria-label="Accueil GEOmetrics"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" aria-hidden="true" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">GEOmetrics</span>
            <span className="hidden sm:inline text-sm px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">DEMO</span>
          </Link>

          {/* Center: Nav links */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/cv"
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              CV
            </Link>
            <div className="relative group">
              <button className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Projects
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link
                    href="https://geometrics.combaldieu.fr"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    GEOMetrics
                  </Link>
                </div>
              </div>
            </div>
          </div>

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
                    </div>

                    <Link
                      href="/reports"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 mx-1 rounded"
                      role="menuitem"
                    >
                      <BarChart className="w-4 h-4" aria-hidden="true" />
                      Mes rapports
                    </Link>

                    <Link
                      href={`${process.env.NEXT_PUBLIC_KRATOS_URL || "https://kratos.combaldieu.fr"}/self-service/settings/browser`}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 mx-1 rounded"
                      role="menuitem"
                    >
                      <Settings className="w-4 h-4" aria-hidden="true" />
                      Paramètres de compte
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
              href="/cv"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              CV
            </Link>
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">Projects</p>
              <Link
                href="https://geometrics.combaldieu.fr"
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowMobileMenu(false)}
                className="block pl-3 py-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                GEOMetrics
              </Link>
            </div>

            {isLoggedIn ? (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 space-y-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                </div>
                <Link
                  href="/reports"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <BarChart className="w-4 h-4 inline mr-2" aria-hidden="true" />
                  Mes rapports
                </Link>
                <Link
                  href={`${process.env.NEXT_PUBLIC_KRATOS_URL || "https://kratos.combaldieu.fr"}/self-service/settings/browser`}
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 inline mr-2" aria-hidden="true" />
                  Paramètres de compte
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
