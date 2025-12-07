import { SignUpForm } from "@/components/auth/sign-up-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Join Today</h1>
          <p className="mt-2 text-muted-foreground">Create your account to get started</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
