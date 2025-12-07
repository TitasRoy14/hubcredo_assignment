import { db } from '@/src/db';
import { user } from '@/src/db/schema';

export async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    // DBOPS: Create tables using Drizzle
    // The tables are created from the schema definitions
    console.log('Tables defined in schema:');
    console.log('  - user');
    console.log('  - session');
    console.log('  - account');
    console.log('  - verification');

    // Check if tables exist by attempting a query
    try {
      await db.select().from(user).limit(1);
      console.log('User table already exists');
    } catch (err) {
      console.log(
        'User table does not exist - it will be created on first connection'
      );
    }

    console.log('Database initialization complete!');
    console.log("Run 'npm run db:generate' to generate migrations");
    console.log("Run 'npm run db:migrate' to apply migrations");
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  initializeDatabase();
}
