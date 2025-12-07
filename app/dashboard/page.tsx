"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, clearUser, getToken } from "@/lib/auth"
import { LogOut, User, Mail, Clock } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // DBOPS: Get current user from localStorage
    const currentUser = getCurrentUser()
    const token = getToken()

    if (!currentUser || !token) {
      router.push("/login")
    } else {
      setUser(currentUser)
    }
    setLoading(false)
  }, [router])

  // DBOPS: Handle logout
  const handleLogout = () => {
    clearUser()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Welcome back, {user.name}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Welcome Card */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>You have successfully logged in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-4">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-foreground">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-4">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                <p className="text-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-4">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="font-mono text-foreground">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your account has been successfully created. You can now access all features of the platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Welcome Email</CardTitle>
              <CardDescription>Check your inbox</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A welcome email has been sent to {user.email}. Check your inbox for more information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
