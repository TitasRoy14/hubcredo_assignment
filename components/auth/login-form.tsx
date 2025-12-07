"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginSchema } from "@/lib/schemas"
import { setUser, generateToken } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // DBOPS: Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // DBOPS: Handle login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGeneralError("")

    // Validate form data with Zod
    const validation = LoginSchema.safeParse(formData)
    if (!validation.success) {
      const newErrors: Record<string, string> = {}
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      // DBOPS: Check credentials against localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: any) => u.email === formData.email)

      if (!user || user.password !== formData.password) {
        setGeneralError("Invalid email or password")
        setLoading(false)
        return
      }

      // DBOPS: Generate JWT token
      const token = await generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
      })

      // DBOPS: Store user and token
      setUser(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      )

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setGeneralError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Log in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {generalError && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {generalError}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <a href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
