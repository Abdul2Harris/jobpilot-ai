// So in essence: this file is your guardrail and central hub for environment configuration. Without it, 
// you risk scattered, unsafe, and hard-to-maintain code

const requiredEnvVars = [
  "PORT",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  port: process.env["PORT"]!,
  supabase: {
    url: process.env["SUPABASE_URL"]!,
    anonKey: process.env["SUPABASE_ANON_KEY"]!,
    serviceRoleKey: process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
  },
  nodeEnv: process.env["NODE_ENV"] ?? "development",
} as const;