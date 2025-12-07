import { auth } from '@/src/lib/auth';

// DBOPS: Handle all Better Auth routes through dynamic catch-all route
const handler = auth.handler;

export { handler as GET, handler as POST };
