'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Redirect to Ory logout flow
    // This will redirect back to geometrics after logout
    window.location.href = `https://kratos.combaldieu.fr/self-service/logout/browser?return_to=${encodeURIComponent(window.location.origin)}`
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
    >
      Logout
    </button>
  )
}