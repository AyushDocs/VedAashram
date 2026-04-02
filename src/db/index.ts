import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (process.env.NODE_ENV === 'production' && !url) {
  console.error('CRITICAL: DATABASE_URL is missing in production environment. Please set it in Netlify settings.');
}

export const client = createClient({
  url: url || 'file:sqlite.db',
  authToken: authToken,
});

export const db = drizzle(client);
