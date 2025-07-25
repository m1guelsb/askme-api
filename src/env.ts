import { z } from 'zod';

const envSchema = z.object({
  // parse env variable to number
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url().startsWith('postgres://'),
  GOOGLE_GEN_AI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
