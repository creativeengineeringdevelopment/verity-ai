import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string().min(1).url(),
    POSTGRES_DATABASE: z.string().min(1),
    DATABASE_HOST: z.string().min(1),
    DATABASE_USER: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    DATABASE_PRISMA_URL: z.string().min(1).url(),
    OPENAI_API_KEY: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    DATABASE_URL_NO_SSL: z.string().min(1),
    DATABASE_URL_NON_POOLING: z.string().min(1),
  },
  client: {
    // Any client-specific variables go here with the NEXT_PUBLIC_ prefix
    // For example:
    // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
  },
});
