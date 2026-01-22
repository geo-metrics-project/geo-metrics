'use client';

import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const handleLogout = () => {
    // Logique de déconnexion
    console.log('Déconnexion...');
    // Redirection ou appel API ici
  };

  return (
    <button
      onClick={handleLogout}
      className="group flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Déconnexion</span>
    </button>
  );
}