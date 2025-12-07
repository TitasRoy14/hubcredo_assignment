'use client';

import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authClient.verifyEmail({ query: { token } });

        if (response.error) {
          setStatus('error');
          setMessage(response.error.message || 'Verification failed');
          return;
        }

        setStatus('success');
        setMessage('Email verified successfully!');
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your email...'}
            {status === 'success' && 'Verification complete'}
            {status === 'error' && 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 text-center">
            {status === 'loading' && <Spinner className="h-12 w-12" />}
            {status === 'success' && (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground">{message}</p>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full"
                >
                  Go to Login
                </Button>
              </>
            )}
            {status === 'error' && (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-sm text-red-600">{message}</p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/signup')}
                  className="w-full"
                >
                  Back to Sign Up
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={<div className="flex justify-center p-10">Loading...</div>}
    >
      <VerifyEmailPage />
    </Suspense>
  );
}
