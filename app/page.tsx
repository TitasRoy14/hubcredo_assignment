import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, Shield, Mail, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary p-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">
          Welcome to HubCredo Assignment
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A complete authentication system with email verification built on
          modern serverless architecture
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

        <div className="mt-12 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Shield className="h-4 w-4 text-primary" />
            <span>Better Auth with Email Verification</span>
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Database className="h-4 w-4 text-primary" />
            <span>Neon Serverless Postgres</span>
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Mail className="h-4 w-4 text-primary" />
            <span>Nodemailer Email Service</span>
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Zap className="h-4 w-4 text-primary" />
            <span>n8n Webhook Integration</span>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Built with Next.js 15, TypeScript, Drizzle ORM, and Zod validation
          </p>
        </div>
      </div>
    </div>
  );
}
