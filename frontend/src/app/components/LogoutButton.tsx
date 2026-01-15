'use client'

import { useRouter } from 'next/navigation'
import { initLogout } from '@/lib/kratos'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const data = await initLogout()
      
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