import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    OPENWEATHER_API_KEY:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().optional().default("dummy-key"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // Make these optional during development
    NEXT_PUBLIC_DEFAULT_LATITUDE: z.string().optional().default("40.7128"),
    NEXT_PUBLIC_DEFAULT_LONGITUDE: z.string().optional().default("-74.0060"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    NEXT_PUBLIC_DEFAULT_LATITUDE: process.env.NEXT_PUBLIC_DEFAULT_LATITUDE,
    NEXT_PUBLIC_DEFAULT_LONGITUDE: process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
