"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/auth"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // DBOPS: Check if user has valid token
    const token = getToken()
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return <>{children}</>
}
