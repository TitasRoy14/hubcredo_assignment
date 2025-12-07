import { jwtVerify, SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export interface DecodedToken {
  id: string
  email: string
  name: string
  iat: number
  exp: number
}

// DBOPS: Generate JWT token
export async function generateToken(payload: {
  id: string
  email: string
  name: string
}): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
  return token
}

// DBOPS: Verify and decode JWT token
export async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as DecodedToken
  } catch (err) {
    return null
  }
}

// DBOPS: Get current user from localStorage
export function getCurrentUser(): {
  id: string
  email: string
  name: string
} | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("user")
  if (!user) return null
  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}

// DBOPS: Get JWT token from localStorage
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

// DBOPS: Store user and token in localStorage
export function setUser(user: { id: string; email: string; name: string }, token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("user", JSON.stringify(user))
  localStorage.setItem("token", token)
}

// DBOPS: Clear user and token from localStorage
export function clearUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("user")
  localStorage.removeItem("token")
}
