'use client'

import dynamic from "next/dynamic";

const LogoutButton = dynamic(() => import("./LogoutButton").then(mod => ({ default: mod.LogoutButton })), { ssr: false });

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">Geometrics</h1>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
