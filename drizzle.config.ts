import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'libsql://vedaashram-bt24103125.aws-ap-south-1.turso.io',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
