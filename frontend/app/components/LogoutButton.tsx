'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Initialize logout flow
      const response = await fetch('https://kratos.combaldieu.fr/self-service/logout/browser', {
        credentials: 'include'
      })
      const data = await response.json()
      
      // Follow the logout URL
      window.location.href = data.logout_url
    } catch (error) {
      console.error('Logout failed:', error)
    }
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