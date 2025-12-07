import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/src/db';
import * as schema from '@/src/db/schema';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Verify Your Email Address',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { 
                  display: inline-block; 
                  padding: 12px 24px; 
                  background-color: #000; 
                  color: #fff; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  margin: 20px 0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Welcome, ${user.name}!</h2>
                <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
                <a href="${url}" class="button">Verify Email</a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">${url}</p>
                <p>This link will expire in 24 hours.</p>
              </div>
            </body>
          </html>
        `,
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // update every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  appName: 'Auth Demo',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret:
    process.env.BETTER_AUTH_SECRET || 'your-secret-key-change-in-production',
  trustedOrigins: [process.env.BETTER_AUTH_URL || 'http://localhost:3000'],
});

export type Session = typeof auth.$Infer.Session;
