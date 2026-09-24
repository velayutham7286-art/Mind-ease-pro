import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: Pool | undefined;
}

// Helper to determine if PostgreSQL / Cloud SQL is actively configured
export const isPostgresConfigured = (): boolean => {
  return Boolean(
    process.env.SQL_HOST && 
    (process.env.SQL_USER || process.env.PGUSER) && 
    (process.env.SQL_DB_NAME || process.env.PGDATABASE)
  );
};

// Function to create or retrieve the connection pool only when SQL_HOST is present
export const createPool = (): Pool | null => {
  if (!isPostgresConfigured()) {
    return null;
  }

  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER || process.env.PGUSER,
      password: process.env.SQL_PASSWORD || process.env.PGPASSWORD,
      database: process.env.SQL_DB_NAME || process.env.PGDATABASE,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    // Prevent unhandled pool-level errors from crashing the application
    global._postgresPool.on('error', (err) => {
      console.warn('Warning on SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

// Create pool instance only if Postgres credentials are configured
const pool = createPool();

// Initialize Drizzle with pool only when pool exists
export const db = pool ? drizzle(pool, { schema }) : null;

