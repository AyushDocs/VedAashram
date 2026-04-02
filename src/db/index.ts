import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

// Initialize LibSQL client for Turso (Remote/Serverless)
// For local development, use sqlite.db if DATABASE_URL is missing
export const client = createClient({
  url: url || 'file:sqlite.db',
  authToken: authToken,
});

export const db = drizzle(client);
