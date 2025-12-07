import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary p-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">Welcome to Auth Demo</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A complete authentication system built with Next.js, TypeScript, JWT, and Zod validation
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Log In
            </Button>
          </Link>
        </div>

        <div className="mt-12 space-y-2 text-sm text-muted-foreground">
          <p>✓ Secure JWT Authentication</p>
          <p>✓ Form Validation with Zod</p>
          <p>✓ Protected Routes</p>
          <p>✓ n8n Webhook Integration</p>
        </div>
      </div>
    </div>
  )
}
