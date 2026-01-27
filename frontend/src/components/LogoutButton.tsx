// components/LogoutButton.tsx
'use client'

import { kratosClient } from "@/lib/kratos"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()
  
  const handleLogout = async () => {
    try {
      const { data: flow } = await kratosClient.createBrowserLogoutFlow()
      await kratosClient.updateLogoutFlow({ token: flow.logout_token })
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
  
  return <button onClick={handleLogout}>Logout</button>
}