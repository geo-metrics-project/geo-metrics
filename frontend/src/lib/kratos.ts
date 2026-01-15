// Kratos API client for authentication flows

const KRATOS_BASE_URL = process.env.NEXT_PUBLIC_KRATOS_URL || 'https://kratos.combaldieu.fr'

/**
 * Initialize logout flow
 * @returns Logout flow data with logout URL
 */
export async function initLogout() {
  const response = await fetch(`${KRATOS_BASE_URL}/self-service/logout/browser`, {
    credentials: 'include'
  })
  
  if (!response.ok) {
    throw new Error(`Logout initialization failed: ${response.statusText}`)
  }
  
  return response.json()
}
