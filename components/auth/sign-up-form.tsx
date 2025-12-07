"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignUpSchema } from "@/lib/schemas"
import { setUser, generateToken } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

export function SignUpForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // DBOPS: Validate form data using Zod
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // DBOPS: Handle sign up submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGeneralError("")

    // Validate form data
    const validation = SignUpSchema.safeParse(formData)
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
      // DBOPS: Check if user already exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const userExists = existingUsers.some((user: any) => user.email === formData.email)

      if (userExists) {
        setGeneralError("Email already registered")
        setLoading(false)
        return
      }

      // DBOPS: Create new user
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password, // NOTE: In production, use bcrypt to hash passwords
      }

      // DBOPS: Store user in localStorage
      existingUsers.push(newUser)
      localStorage.setItem("users", JSON.stringify(existingUsers))

      // DBOPS: Generate JWT token
      const token = await generateToken({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      })

      // DBOPS: Store current user and token
      setUser(
        {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
        token,
      )

      // Trigger n8n webhook for new signup
      try {
        await fetch("/api/webhooks/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            signupDate: new Date().toISOString(),
          }),
        })
      } catch (err) {
        console.error("Failed to trigger signup webhook:", err)
      }

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
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join us to get started</CardDescription>
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
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

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

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary hover:underline">
              Log in
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
