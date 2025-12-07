import { createAuthClient } from "better-auth/react"

// Client-side auth utilities
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
})

export const { useSession, signOut } = authClient
