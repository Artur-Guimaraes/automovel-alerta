import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env") });

export function envRequired(name: string): string {
  const v = process.env[name];
  if (!v)
    throw new Error(
      `[ENV] Variável ausente: ${name}. Verifique seu back-end/.env`
    );
  return v;
}

export function getProjectUrl(): string {
  return envRequired("SUPABASE_PROJECT_URL").replace(/\/$/, "");
}

export function getAnonKey(): string {
  return envRequired("SUPABASE_ANON_KEY");
}

export function getJWKSUrl(): string {
  // usa SUPABASE_JWKS_URL se existir; senão monta com apikey
  const direct = process.env.SUPABASE_JWKS_URL;
  if (direct) return direct;
  return `${getProjectUrl()}/auth/v1/keys?apikey=${getAnonKey()}`;
}

export function getIssuer(): string {
  return `${getProjectUrl()}/auth/v1`;
}
