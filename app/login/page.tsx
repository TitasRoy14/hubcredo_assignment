import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Log in to access your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
